import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Briefcase, Bell } from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import NotificationDropdown from '../components/NotificationDropdown';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { unreadCount } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch user', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      {/* Navbar */}
      <nav className="glass" style={{ 
        padding: '16px 32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px',
        position: 'relative'
      }}>
        <h2 className="gradient-text" style={{ fontWeight: '800' }}>Lunar SaaS</h2>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Bell 
              size={20} 
              style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--accent-primary)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '10px',
                border: '2px solid var(--bg-primary)'
              }}>
                {unreadCount}
              </span>
            )}
            <NotificationDropdown 
              isOpen={isNotifOpen} 
              onClose={() => setIsNotifOpen(false)} 
            />
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <main className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>
            Welcome back, <span className="gradient-text">{userData?.email?.split('@')[0] || 'Seeker'}</span>!
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your job search today.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px' }}>
                <Briefcase style={{ color: 'var(--accent-primary)' }} />
              </div>
              <h3 style={{ fontSize: '20px' }}>Active Applications</h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: '700' }}>12</p>
          </div>

          <div className="glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                <User style={{ color: 'var(--success)' }} />
              </div>
              <h3 style={{ fontSize: '20px' }}>Profile Views</h3>
            </div>
            <p style={{ fontSize: '32px', fontWeight: '700' }}>84</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
