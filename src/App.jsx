import React from 'react';
import Chat from './Chat';

function Welcome() {
  return <Chat />;
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
  