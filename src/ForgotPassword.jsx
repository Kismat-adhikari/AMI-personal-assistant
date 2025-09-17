import React, { useState } from 'react';

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setResetLink('');
    setIsError(false);
    
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
        setMessage(data.message);
        if (data.reset_link) {
          setResetLink(data.reset_link);
        }
        setIsError(false);
      } else {
        setMessage(data.message || 'An error occurred');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Error connecting to server. Please try again.');
      setIsError(true);
      console.error('Forgot password error:', error);
    }
  };	return (
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
			
			{resetLink && (
				<div style={{ 
					padding: '0.75rem', 
					marginBottom: '1rem', 
					borderRadius: '5px', 
					backgroundColor: '#fff3cd',
					color: '#856404',
					border: '1px solid #ffeaa7',
					fontSize: '0.875rem'
				}}>
					<strong>For Testing (Email not configured):</strong><br />
					<a 
						href={resetLink} 
						target="_blank" 
						rel="noopener noreferrer"
						style={{ 
							color: '#1a73e8', 
							textDecoration: 'underline',
							wordBreak: 'break-all' 
						}}
					>
						Click here to reset password
					</a>
				</div>
			)}
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: '1.5rem' }}>
					<label style={{ display: 'block', marginBottom: '0.5rem', color: '#202124', fontSize: '0.875rem' }}>Email</label>
					<input 
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						style={{ 
							width: '100%', 
							padding: '0.75rem', 
							borderRadius: '5px', 
							border: '1px solid #dadce0',
							fontSize: '0.875rem',
							outline: 'none',
							transition: 'border-color 0.2s'
						}}
						onFocus={e => e.target.style.borderColor = '#1a73e8'}
						onBlur={e => e.target.style.borderColor = '#dadce0'}
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
					onMouseOver={e => e.target.style.backgroundColor = '#1557b0'}
					onMouseOut={e => e.target.style.backgroundColor = '#1a73e8'}
				>
					Send
				</button>
			</form>
			<div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
					Back to Login
				</button>
			</div>
		</div>
	);
}

export default ForgotPassword;
