// Simple Google OAuth utility
const GOOGLE_CLIENT_ID = "342705599978-fhfc6ekia64q8vs6ov56qq3nee58ph4k.apps.googleusercontent.com";

// Google OAuth utility for Login (existing users)
export const initializeGoogleLoginButton = (elementId, onSuccess, onError) => {
  console.log('Initializing Google LOGIN button for element:', elementId);
  
  const waitForGoogle = () => {
    if (window.google && window.google.accounts) {
      console.log('Google API loaded successfully');
      
      try {
        console.log('Using Client ID:', GOOGLE_CLIENT_ID);
        
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              console.log('Google login response received:', response);
              
              // Send credential to LOGIN endpoint
              const res = await fetch('http://localhost:5000/api/auth/google/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential }),
              });
              
              const data = await res.json();
              console.log('Backend login response:', data);
              
              if (res.ok) {
                onSuccess(data);
              } else {
                onError(data.message || 'Google login failed');
              }
            } catch (err) {
              console.error('Network error:', err);
              onError('Network error during Google login');
            }
          }
        });
        
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = '';
          window.google.accounts.id.renderButton(element, {
            theme: 'outline',
            size: 'large',
            width: element.offsetWidth || 300,
            text: 'signin_with',
            shape: 'rectangular'
          });
          console.log('Google login button rendered successfully');
        } else {
          console.error('Element not found:', elementId);
          onError('Button container not found');
        }
        
      } catch (error) {
        console.error('Error initializing Google OAuth:', error);
        onError('Failed to initialize Google OAuth');
      }
    } else {
      console.log('Google API not loaded yet, retrying...');
      setTimeout(waitForGoogle, 500);
    }
  };
  
  waitForGoogle();
};

// Google OAuth utility for Signup (new users)
export const initializeGoogleSignupButton = (elementId, onSuccess, onError) => {
  console.log('Initializing Google SIGNUP button for element:', elementId);
  
  const waitForGoogle = () => {
    if (window.google && window.google.accounts) {
      console.log('Google API loaded successfully');
      
      try {
        console.log('Using Client ID:', GOOGLE_CLIENT_ID);
        
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              console.log('Google signup response received:', response);
              
              // Send credential to SIGNUP endpoint
              const res = await fetch('http://localhost:5000/api/auth/google/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential }),
              });
              
              const data = await res.json();
              console.log('Backend signup response:', data);
              
              if (res.ok) {
                onSuccess(data);
              } else {
                onError(data.message || 'Google signup failed');
              }
            } catch (err) {
              console.error('Network error:', err);
              onError('Network error during Google signup');
            }
          }
        });
        
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = '';
          window.google.accounts.id.renderButton(element, {
            theme: 'outline',
            size: 'large',
            width: element.offsetWidth || 300,
            text: 'signup_with',
            shape: 'rectangular'
          });
          console.log('Google signup button rendered successfully');
        } else {
          console.error('Element not found:', elementId);
          onError('Button container not found');
        }
        
      } catch (error) {
        console.error('Error initializing Google OAuth:', error);
        onError('Failed to initialize Google OAuth');
      }
    } else {
      console.log('Google API not loaded yet, retrying...');
      setTimeout(waitForGoogle, 500);
    }
  };
  
  waitForGoogle();
};