import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeGoogleSignupButton } from './utils/googleAuth';

function Signup({ onBack }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Initialize Google OAuth signup button after component mounts
    initializeGoogleSignupButton(
      'google-signup-button',
      (data) => {
        setMessage(data.message);
        console.log('Google signup successful:', data);
        setTimeout(() => {
          navigate('/ami');
        }, 1500);
      },
      (error) => {
        setMessage(error);
        console.error('Google signup failed:', error);
      }
    );
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Signup successful!');
        setForm({ name: '', email: '', password: '' });
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          navigate('/ami');
        }, 1500); // Give user time to see success message
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 8px #eee' }}>
      <h2 style={{ color: '#6FCF97', textAlign: 'center', marginBottom: '2rem' }}>Sign Up for AMI</h2>
      
      {message && (
        <div style={{ 
          padding: '0.75rem', 
          marginBottom: '1rem', 
          borderRadius: '5px', 
          backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
          color: message.includes('successful') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}
      
      {/* Google Signup Button Container */}
      <div id="google-signup-button" style={{ marginBottom: '1.5rem', minHeight: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: '#dadce0' }}></div>
        <span style={{ padding: '0 1rem', color: '#5f6368', fontSize: '0.875rem' }}>or</span>
        <div style={{ flex: 1, height: '1px', background: '#dadce0' }}></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#202124', fontSize: '0.875rem' }}>Name</label>
          <input 
            name="name" 
            type="text" 
            value={form.name} 
            onChange={handleChange} 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '5px', 
              border: '1px solid #dadce0',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }} 
            onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
            onBlur={(e) => e.target.style.borderColor = '#dadce0'}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#202124', fontSize: '0.875rem' }}>Email</label>
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '5px', 
              border: '1px solid #dadce0',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }} 
            onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
            onBlur={(e) => e.target.style.borderColor = '#dadce0'}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#202124', fontSize: '0.875rem' }}>Password</label>
          <input 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '5px', 
              border: '1px solid #dadce0',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }} 
            onFocus={(e) => e.target.style.borderColor = '#1a73e8'}
            onBlur={(e) => e.target.style.borderColor = '#dadce0'}
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: '#1a73e8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1557b0'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1a73e8'}
        >
          Sign Up
        </button>
      </form>
      
      {/* Sign In Link */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <span style={{ color: '#5f6368', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <a 
            href="#" 
            style={{ 
              color: '#1a73e8', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Sign in
          </a>
        </span>
      </div>
      
      {/* Back to Landing Button */}
      {onBack && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#5f6368', 
              cursor: 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'underline'
            }}
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default Signup;