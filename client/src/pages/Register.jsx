import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, UserCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'SEEKER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/verify-otp', { state: { email: formData.email } });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
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
        <div style={{ marginBottom: '32px' }}>
          <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
            Join Lunar
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Start your journey with us today.
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

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min. 6 characters"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px' }}>
              I am a
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ 
                flex: 1, 
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: formData.role === 'SEEKER' ? 'var(--primary-color)' : 'var(--glass-border)',
                backgroundColor: formData.role === 'SEEKER' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: formData.role === 'SEEKER' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}>
                <input 
                  type="radio" 
                  name="role" 
                  value="SEEKER" 
                  checked={formData.role === 'SEEKER'} 
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                Job Seeker
              </label>
              <label style={{ 
                flex: 1, 
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: formData.role === 'COMPANY' ? 'var(--primary-color)' : 'var(--glass-border)',
                backgroundColor: formData.role === 'COMPANY' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: formData.role === 'COMPANY' ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}>
                <input 
                  type="radio" 
                  name="role" 
                  value="COMPANY" 
                  checked={formData.role === 'COMPANY'} 
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                Company
              </label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
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
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating account...' : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
