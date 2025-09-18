"""
Test script to verify the authentication conflict prevention
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_email_signup():
    """Test creating an account with email/password"""
    data = {
        "name": "Test User",
        "email": "test@example.com", 
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/api/signup", json=data)
    print(f"Email Signup Response: {response.status_code}")
    print(f"Message: {response.json()}")
    return response.status_code == 201

def test_duplicate_email_signup():
    """Test trying to create another account with same email"""
    data = {
        "name": "Another User",
        "email": "test@example.com", 
        "password": "differentpass456"
    }
    
    response = requests.post(f"{BASE_URL}/api/signup", json=data)
    print(f"\nDuplicate Email Signup Response: {response.status_code}")
    print(f"Message: {response.json()}")
    return response.status_code == 409

def get_users():
    """Check all users in database"""
    response = requests.get(f"{BASE_URL}/api/users")
    print(f"\nCurrent Users: {response.status_code}")
    if response.status_code == 200:
        users = response.json()
        for user in users:
            print(f"- {user.get('email')} ({user.get('auth_method')})")
    return response.status_code == 200

if __name__ == "__main__":
    print("=== Testing Authentication Conflict Prevention ===")
    
    # Test 1: Create email account
    print("\n1. Creating email account...")
    test_email_signup()
    
    # Check users
    print("\n2. Current users:")
    get_users()
    
    # Test 2: Try to create duplicate
    print("\n3. Trying to create duplicate email account...")
    test_duplicate_email_signup()
    
    print("\n=== Test Complete ===")