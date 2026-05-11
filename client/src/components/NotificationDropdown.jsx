import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Bell, Check, X, Clock } from 'lucide-react';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
        onClick={onClose} 
      />
      <div className="glass animate-fade-in" style={{ 
        position: 'absolute', 
        top: '60px', 
        right: '0', 
        width: '380px', 
        maxHeight: '500px', 
        zIndex: 50, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Notifications</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--accent-primary)', 
                  fontSize: '12px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Check size={14} /> Mark all read
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Bell size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                style={{ 
                  padding: '16px 20px', 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: notification.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                  position: 'relative'
                }}
                className="hover-bright"
              >
                {!notification.isRead && (
                  <div style={{ 
                    position: 'absolute', 
                    left: '8px', 
                    top: '22px', 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent-primary)' 
                  }} />
                )}
                <div style={{ marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
                  {notification.title}
                </div>
                <p style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)', 
                  margin: 0, 
                  lineHeight: '1.4',
                  marginBottom: '8px'
                }}>
                  {notification.message}
                </p>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'rgba(255, 255, 255, 0.3)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}>
                  <Clock size={10} />
                  {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div style={{ 
            padding: '12px', 
            textAlign: 'center', 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '13px', 
              cursor: 'pointer' 
            }}>
              View all notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;
