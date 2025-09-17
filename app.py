from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from pymongo import MongoClient
from bson import ObjectId
from google.oauth2 import id_token
from google.auth.transport import requests
import bcrypt
import secrets
import base64
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Email configuration (Flask-Mail)
# Configure these in your .env file or directly here
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', '587'))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'your-email@gmail.com')  # Replace with your email
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'your-app-password')     # Replace with your app password
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'your-email@gmail.com')

# Initialize Flask-Mail
mail = Mail(app)

# Connect to MongoDB (local default)
client = MongoClient('mongodb://localhost:27017/')
db = client['ami']  # Database name: ami
users_collection = db['users']  # Collection name: users

# Google OAuth configuration
GOOGLE_CLIENT_ID = "342705599978-fhfc6ekia64q8vs6ov56qq3nee58ph4k.apps.googleusercontent.com"

@app.route('/')
def home():
    return 'AMI Flask backend is running!'

# Regular signup endpoint
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not name or not email or not password:
            return jsonify({'message': 'Name, email, and password are required'}), 400
        
        # Check if user already exists with this email
        existing_user = users_collection.find_one({'email': email})
        
        if existing_user:
            return jsonify({'message': 'An account with this email already exists'}), 409
        
        # Hash the password before storing
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create new user
        new_user = {
            'name': name,
            'email': email,
            'password': hashed_password,  # Store hashed password
            'auth_method': 'email'
        }
        result = users_collection.insert_one(new_user)
        
        return jsonify({
            'message': 'Account created successfully',
            'user': {
                'id': str(result.inserted_id),
                'name': name,
                'email': email
            }
        }), 201
        
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({'message': f'Signup failed: {str(e)}'}), 500

# Example endpoint to get all users
@app.route('/api/users', methods=['GET'])
def get_users():
    users = list(users_collection.find({}, {'_id': 0}))
    return jsonify(users)

# Google OAuth login endpoint (for existing users only)
@app.route('/api/auth/google/login', methods=['POST'])
def google_login():
    try:
        data = request.json
        token = data.get('credential')
        
        print(f"Google Login - Received token: {token[:50] if token else 'None'}...")
        
        if not token:
            return jsonify({'message': 'No credential provided'}), 400
            
        # Verify the Google token with clock skew tolerance
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=300  # Allow 5 minutes clock skew
            )
        except ValueError as clock_error:
            print(f"Clock error: {str(clock_error)}")
            # Try again with even more tolerance
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=600  # Allow 10 minutes clock skew
            )
        
        print(f"Token verified successfully. User info: {idinfo.get('email')}")
        
        # Get user info from Google
        google_user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']
        
        # Check if user already exists (LOGIN - must exist)
        existing_user = users_collection.find_one({'google_id': google_user_id})
        
        if existing_user:
            # User exists, login successful
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': str(existing_user.get('_id')),
                    'name': existing_user.get('name'),
                    'email': existing_user.get('email')
                }
            }), 200
        else:
            # User doesn't exist, cannot login
            return jsonify({'message': 'No account found. Please sign up first.'}), 404
            
    except ValueError as e:
        print(f"Token validation error: {str(e)}")
        return jsonify({'message': 'Invalid Google token'}), 401
    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

# Google OAuth signup endpoint (for new users only)
@app.route('/api/auth/google/signup', methods=['POST'])
def google_signup():
    try:
        data = request.json
        token = data.get('credential')
        
        print(f"Google Signup - Received token: {token[:50] if token else 'None'}...")
        
        if not token:
            return jsonify({'message': 'No credential provided'}), 400
            
        # Verify the Google token with clock skew tolerance
        try:
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=300
            )
        except ValueError as clock_error:
            print(f"Clock error: {str(clock_error)}")
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                GOOGLE_CLIENT_ID,
                clock_skew_in_seconds=600
            )
        
        print(f"Token verified successfully. User info: {idinfo.get('email')}")
        
        # Get user info from Google
        google_user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']
        
        # Check if user already exists (SIGNUP - must not exist)
        existing_user = users_collection.find_one({'google_id': google_user_id})
        
        if existing_user:
            # User already exists, cannot signup again
            return jsonify({'message': 'Account already exists. Please login instead.'}), 409
        else:
            # New user, create account
            new_user = {
                'google_id': google_user_id,
                'name': name,
                'email': email,
                'auth_method': 'google'
            }
            result = users_collection.insert_one(new_user)
            
            return jsonify({
                'message': 'Account created successfully',
                'user': {
                    'id': str(result.inserted_id),
                    'name': name,
                    'email': email
                }
            }), 201
            
    except ValueError as e:
        print(f"Token validation error: {str(e)}")
        return jsonify({'message': 'Invalid Google token'}), 401
    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({'message': f'Signup failed: {str(e)}'}), 500

# Password reset request endpoint
@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    """
    Handle password reset request:
    1. Validate email exists in database
    2. Use userid as token for reset link
    3. Send email with reset link containing userid
    """
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'message': 'Email is required'}), 400
        
        # Find user by email (only for email-based accounts)
        user = users_collection.find_one({
            'email': email,
            'auth_method': 'email'  # Only allow password reset for email accounts
        })
        
        if not user:
            # Return error if email doesn't exist
            return jsonify({'message': 'Invalid email!'}), 404
        
        # Use the user's MongoDB ObjectId as the token
        userid = str(user['_id'])
        
        # Create reset link using userid as token
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/reset-password?token={userid}"
        
        # Send password reset email
        try:
            msg = Message(
                subject='Password Reset Request - AMI',
                recipients=[email],
                body=f'''
Hello {user.get('name', '')},

You requested a password reset for your AMI account.

Click the link below to reset your password:
{reset_link}

If you didn't request this reset, please ignore this email.

Best regards,
AMI Team
                ''',
                html=f'''
<html>
<body>
    <h2>Password Reset Request</h2>
    <p>Hello {user.get('name', '')},</p>
    <p>You requested a password reset for your AMI account.</p>
    <p><a href="{reset_link}" style="background-color: #4B9CD3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
    <p>If you didn't request this reset, please ignore this email.</p>
    <br>
    <p>Best regards,<br>AMI Team</p>
</body>
</html>
                '''
            )
            mail.send(msg)
            print(f"✅ Password reset email sent successfully to {email}")
            
            return jsonify({'message': 'If an account with this email exists, you will receive a password reset email shortly.'}), 200
            
        except Exception as email_error:
            print(f"❌ Email sending failed: {str(email_error)}")
            print(f"🔗 Reset link for testing: {reset_link}")
            
            # Still return success for security, but log the link for testing
            return jsonify({'message': 'If an account with this email exists, you will receive a password reset email shortly.'}), 200
        
    except Exception as e:
        print(f"Forgot password error: {str(e)}")
        return jsonify({'message': 'Error processing request'}), 500

# Password reset endpoint (handle the reset link)
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    """
    Handle password reset:
    1. Validate userid token exists
    2. Update user's password with new hashed password
    """
    try:
        data = request.json
        token = data.get('token')  # This is actually the userid
        new_password = data.get('password')
        
        if not token or not new_password:
            return jsonify({'message': 'Token and new password are required'}), 400
        
        if len(new_password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters long'}), 400
        
        # Find user with this userid (token is actually userid)
        from bson import ObjectId
        try:
            user_id = ObjectId(token)
        except:
            return jsonify({'message': 'Invalid reset token'}), 400
            
        user = users_collection.find_one({
            '_id': user_id,
            'auth_method': 'email'
        })
        
        if not user:
            return jsonify({'message': 'Invalid or expired reset token'}), 400
        
        # Hash the new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        
        # Update password
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {'password': hashed_password}}
        )
        
        print(f"Password reset successful for user: {user.get('email')}")
        return jsonify({'message': 'Password reset successful. You can now login with your new password.'}), 200
        
    except Exception as e:
        print(f"Reset password error: {str(e)}")
        return jsonify({'message': 'Error resetting password'}), 500

# Regular login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Find user by email
        user = users_collection.find_one({'email': email})
        
        if not user:
            return jsonify({'message': 'No account found with this email'}), 404
        
        # Check if user has a password (not Google-only account)
        if user.get('auth_method') == 'google' and 'password' not in user:
            return jsonify({'message': 'This account uses Google sign-in. Please use Google login.'}), 400
        
        # Verify password using bcrypt
        stored_password = user.get('password')
        if not bcrypt.checkpw(password.encode('utf-8'), stored_password):
            return jsonify({'message': 'Invalid password'}), 401
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': str(user.get('_id')),
                'name': user.get('name'),
                'email': user.get('email')
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': f'Login failed: {str(e)}'}), 500

if __name__ == '__main__':
    # Run without the auto-reloader on Windows to avoid socket errors
    app.run(debug=True, use_reloader=False)
