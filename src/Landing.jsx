import React from 'react';

function Landing({ onLogin, onSignup }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ color: '#4B9CD3' }}>Welcome to AMI</h1>
      <p style={{ fontSize: '1.2rem' }}>Your Emotionally Adaptive AI Productivity Assistant</p>
      <div style={{ marginTop: '2rem' }}>
        <button style={{ margin: '0 1rem', padding: '0.5rem 2rem', fontSize: '1rem', background: '#4B9CD3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={onLogin}>Login</button>
        <button style={{ margin: '0 1rem', padding: '0.5rem 2rem', fontSize: '1rem', background: '#6FCF97', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={onSignup}>Sign Up</button>
      </div>
    </div>
  );
}

export default Landing;
