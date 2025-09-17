import React, { useState } from 'react';

function Reset({ onBack }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('If an account with this email exists, you will receive a password reset email shortly.');
        setIsError(false);
      } else {
        setMessage(data.message || 'An error occurred');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error connecting to server. Please try again.');
      setIsError(true);
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 8px #eee' }}>
      <h2 style={{ color: '#4B9CD3', textAlign: 'center', marginBottom: '2rem' }}>Reset Your Password</h2>
      
      {message && (
        <div style={{ 
          padding: '0.75rem', 
          marginBottom: '1rem', 
          borderRadius: '5px', 
          backgroundColor: isError ? '#f8d7da' : '#d4edda',
          color: isError ? '#721c24' : '#155724',
          border: `1px solid ${isError ? '#f5c6cb' : '#c3e6cb'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #dadce0',
              borderRadius: '5px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4B9CD3'}
            onBlur={(e) => e.target.style.borderColor = '#dadce0'}
            placeholder="Enter your email address"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: isLoading ? '#ccc' : '#4B9CD3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '1rem',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => {
            if (!isLoading) e.target.style.backgroundColor = '#3a7ca8';
          }}
          onMouseOut={(e) => {
            if (!isLoading) e.target.style.backgroundColor = '#4B9CD3';
          }}
        >
          {isLoading ? 'Sending...' : 'Send Reset Email'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#4B9CD3',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default Reset;