import requests
import json

# Test the forgot password flow
base_url = "http://localhost:5000"

print("=== TESTING FORGOT PASSWORD FLOW ===\n")

# Step 1: Create a test user
print("1. Creating test user...")
signup_data = {
    "name": "Test User",
    "email": "test@example.com", 
    "password": "oldpassword123"
}

try:
    response = requests.post(f"{base_url}/api/signup", json=signup_data)
    if response.status_code in [200, 201]:
        print("✅ Test user created successfully")
    elif response.status_code == 409:
        print("✅ Test user already exists") 
    else:
        print(f"❌ Error creating user: {response.json()}")
except Exception as e:
    print(f"❌ Connection error: {e}")
    exit()

# Step 2: Request password reset
print("\n2. Requesting password reset...")
forgot_data = {"email": "test@example.com"}

try:
    response = requests.post(f"{base_url}/api/forgot-password", json=forgot_data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Password reset email sent (check Flask console for reset link)")
    else:
        print("❌ Error requesting reset")
except Exception as e:
    print(f"❌ Connection error: {e}")

print("\n=== CHECK THE FLASK CONSOLE FOR THE RESET LINK ===")
print("Since email is not configured, the reset link will be printed in the Flask server console.")
print("Copy that link and paste it in your browser to test the password reset form.")