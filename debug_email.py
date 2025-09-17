import os
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_mail import Mail, Message
from flask import Flask

load_dotenv()

# Test MongoDB connection
try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['ami']
    users_collection = db['users']
    
    # Check if user exists
    email = "kismatadhikari62@gmail.com"
    user = users_collection.find_one({
        'email': email,
        'auth_method': 'email'
    })
    
    print(f"User found: {user is not None}")
    if user:
        print(f"User ID: {user['_id']}")
        print(f"User name: {user.get('name', 'N/A')}")
    else:
        print("No user found with email auth_method")
        # Check if user exists with any auth method
        any_user = users_collection.find_one({'email': email})
        if any_user:
            print(f"User exists but with auth_method: {any_user.get('auth_method', 'unknown')}")
        
except Exception as e:
    print(f"Database error: {e}")

# Test email configuration
try:
    app = Flask(__name__)
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', '587'))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
    
    print(f"Mail server: {app.config['MAIL_SERVER']}")
    print(f"Mail port: {app.config['MAIL_PORT']}")
    print(f"Mail username: {app.config['MAIL_USERNAME']}")
    print(f"Mail password: {'*' * len(app.config['MAIL_PASSWORD']) if app.config['MAIL_PASSWORD'] else 'None'}")
    
    mail = Mail(app)
    
    with app.app_context():
        msg = Message(
            subject='Test Email - AMI Debug',
            recipients=[email],
            body='This is a test email from AMI debug script.',
            html='<p>This is a test email from AMI debug script.</p>'
        )
        mail.send(msg)
        print("✅ Test email sent successfully!")
        
except Exception as e:
    print(f"❌ Email error: {e}")