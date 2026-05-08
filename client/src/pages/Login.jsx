import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend initiation endpoint
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e1b4b, #0a0a0c)' 
    }}>
      <div className="glass animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '440px', 
        padding: '48px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            Lunar SaaS
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Elevate your career journey today.
          </p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'white',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '20px' }} />
          Continue with Google
        </button>

        <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
            Register now
          </Link>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
