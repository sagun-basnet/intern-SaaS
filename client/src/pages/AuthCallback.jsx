import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token
      localStorage.setItem('token', token);
      
      // Flash success state (optional)
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      console.error('Authentication failed: No token found');
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '24px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--glass-border)',
        borderTopColor: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
        Securing your session...
      </p>
    </div>
  );
};

export default AuthCallback;
