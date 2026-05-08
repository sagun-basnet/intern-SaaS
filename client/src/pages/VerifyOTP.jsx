import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setMessage('Verification successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('A new code has been sent to your email.');
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('Connection error.');
    } finally {
      setResending(false);
    }
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
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          backgroundColor: 'rgba(99, 102, 241, 0.1)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: 'var(--primary-color)'
        }}>
          <Mail size={32} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h1 className="gradient-text" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
            Verify Email
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            We've sent a 6-digit code to <br />
            <span style={{ color: 'white', fontWeight: '600' }}>{email}</span>
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ 
            backgroundColor: 'rgba(34, 197, 94, 0.1)', 
            color: '#22c55e', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="0 0 0 0 0 0"
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '24px',
                fontWeight: '700',
                textAlign: 'center',
                letterSpacing: '8px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          <button 
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: (loading || otp.length !== 6) ? 0.7 : 1
            }}
          >
            {loading ? 'Verifying...' : (
              <>
                Verify Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              margin: '0 auto',
              opacity: resending ? 0.6 : 1
            }}
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Resending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
