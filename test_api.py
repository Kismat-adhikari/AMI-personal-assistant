import requests
import json

# Test the forgot password API
def test_forgot_password():
    url = "http://localhost:5000/api/forgot-password"
    
    # Test with a non-existent email first
    test_data = {"email": "nonexistent@example.com"}
    
    try:
        response = requests.post(url, json=test_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ API is working correctly!")
        else:
            print("❌ API returned an error")
            
    except Exception as e:
        print(f"❌ Error connecting to API: {e}")

if __name__ == "__main__":
    test_forgot_password()