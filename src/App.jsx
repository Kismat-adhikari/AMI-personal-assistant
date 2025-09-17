import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

function Welcome() {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{
        transition: 'margin-left 0.2s',
        marginLeft: isMobile ? '0' : (collapsed ? '60px' : '220px'),
        padding: isMobile ? '4rem 1rem 2rem' : '2rem',
        paddingTop: isMobile ? '5rem' : '2rem',
        flex: 1,
        background: '#f6f8fa',
        minHeight: '100vh',
      }}>
        <h1>Welcome to AMI!</h1>
      </div>
    </div>
  );
}
// ...existing code...
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Signup from './Signup';
import Reset from './Reset';
import ResetPassword from './ResetPassword';

function ResetWithNav() {
  const navigate = useNavigate();
  return <Reset onBack={() => navigate('/login')} />;
}

function ResetPasswordWithNav() {
  const navigate = useNavigate();
  return <ResetPassword />;
}

function LandingWithNav() {
  const navigate = useNavigate();
  return <Landing onLogin={() => navigate('/login')} onSignup={() => navigate('/signup')} />;
}

function LoginWithNav() {
  const navigate = useNavigate();
  return <Login onBack={() => navigate('/')} />;
}

function SignupWithNav() {
  const navigate = useNavigate();
  return <Signup onBack={() => navigate('/')} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingWithNav />} />
        <Route path="/login" element={<LoginWithNav />} />
        <Route path="/signup" element={<SignupWithNav />} />
        <Route path="/ami" element={<Welcome />} />
        <Route path="/reset" element={<ResetWithNav />} />
        <Route path="/reset-password" element={<ResetPasswordWithNav />} />
      </Routes>
    </Router>
  );
}

export default App;
