import React, { useState, useEffect } from 'react';
import { FaHome, FaTasks, FaEnvelope, FaCalendarAlt, FaHeart, FaBell, FaCog, FaBars, FaChevronLeft, FaTimes } from 'react-icons/fa';

const sections = [
  { name: 'Dashboard', icon: <FaHome /> },
  { name: 'Tasks', icon: <FaTasks /> },
  { name: 'Calendar', icon: <FaCalendarAlt /> },
  { name: 'Emails', icon: <FaEnvelope /> },
  { name: 'Well-being', icon: <FaHeart /> },
  { name: 'Notifications', icon: <FaBell /> },
  { name: 'Settings', icon: <FaCog /> },
];

function handleLogout() {
  // Clear user session, token, etc. Add your logic here
  window.location.href = '/login';
}

function Sidebar({ collapsed, setCollapsed }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
      
      // Close mobile menu when switching to desktop
      if (!newIsMobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [mobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e) => {
      const target = e.target;
      const sidebar = target.closest('.sidebar');
      const hamburger = target.closest('.mobile-hamburger');
      
      if (mobileMenuOpen && !sidebar && !hamburger) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, mobileMenuOpen]);

  if (isMobile) {
    return (
      <>
        {/* Mobile Hamburger Button (only when menu is closed) */}
        {!mobileMenuOpen && (
          <button
            className="mobile-hamburger"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(true);
            }}
            style={{
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              zIndex: 1001,
              background: '#2d3748',
              border: 'none',
              color: '#fff',
              fontSize: '1.2rem',
              padding: '0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
            }}
          >
            <FaBars />
          </button>
        )}

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 999,
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className="sidebar"
          style={{
            height: '100vh',
            width: '280px',
            background: '#f7fafc',
            color: '#2d3748',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
            boxShadow: '2px 0 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            transform: `translateX(${mobileMenuOpen ? '0' : '-100%'})`,
            transition: 'transform 0.3s ease',
            borderRight: '1px solid #e2e8f0'
          }}
        >
          {/* Mobile Header with close button inside sidebar */}
          <div style={{ 
            padding: '1.5rem 1.5rem 1.5rem 1.5rem', 
            borderBottom: '1px solid #e2e8f0',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#2d3748', fontWeight: '600' }}>AMI Assistant</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#718096' }}>AI-Powered Workspace</p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2d3748',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginLeft: '1rem',
                alignSelf: 'flex-start',
              }}
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div style={{ flex: 1, padding: '1.5rem 0 1rem' }}>
            {sections.map((section, index) => (
              <div
                key={index}
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  margin: '0 0.75rem 0.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  fontSize: '0.95rem',
                  color: '#4a5568',
                  borderRadius: '10px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem',
                  fontSize: '0.9rem',
                  color: '#718096',
                  transition: 'all 0.25s ease'
                }}>
                  {section.icon}
                </div>
                <span>{section.name}</span>
              </div>
            ))}
            {/* Logout for mobile */}
            <div
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                margin: '0 0.75rem 0.25rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                fontSize: '0.95rem',
                color: '#e53e3e',
                borderRadius: '10px',
                fontWeight: '500',
                borderTop: '1px solid #e2e8f0',
                marginTop: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff5f5';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(229,62,62,0.08)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#fed7d7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem',
                fontSize: '0.9rem',
                color: '#e53e3e',
                transition: 'all 0.25s ease'
              }}>
                <FaTimes />
              </div>
              <span>Logout</span>
            </div>
          </div>

          {/* Mobile Footer */}
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f7fafc'
          }}>
            <p style={{ 
              margin: 0,
              fontSize: '0.8rem',
              color: '#a0aec0'
            }}>AMI beta</p>
          </div>
        </div>
      </>
    );
  }

  // Desktop/Tablet Sidebar
  return (
    <div
      style={{
        height: '100vh',
        width: collapsed ? '72px' : '240px',
        background: '#f7fafc',
        color: '#2d3748',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e2e8f0'
      }}
    >
      {/* Desktop Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          color: '#4a5568',
          fontSize: '1rem',
          padding: '0.75rem',
          cursor: 'pointer',
          margin: '1rem',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '44px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#edf2f7';
          e.currentTarget.style.borderColor = '#cbd5e0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }}
      >
        {collapsed ? <FaBars /> : <FaChevronLeft />}
      </button>

      {/* Desktop Header */}
      {!collapsed && (
        <div style={{ 
          padding: '0 1.5rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1rem',
          background: '#fff'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.25rem', 
            color: '#2d3748',
            fontWeight: '600'
          }}>AMI Assistant</h2>
          <p style={{
            margin: '4px 0 0',
            fontSize: '0.875rem',
            color: '#718096'
          }}>AI-Powered Workspace</p>
        </div>
      )}

      {/* Desktop Navigation */}
      <div style={{ flex: 1, padding: '0 0.75rem' }}>
        {sections.map((section, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: collapsed ? '0.875rem' : '1rem 1.25rem',
              margin: '0.5rem 0',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              justifyContent: collapsed ? 'center' : 'flex-start',
              fontSize: '0.95rem',
              borderRadius: '10px',
              color: '#4a5568',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              if (!collapsed) {
                e.currentTarget.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            title={collapsed ? section.name : ''}
          >
            <div style={{
              width: collapsed ? '28px' : '32px',
              height: collapsed ? '28px' : '32px',
              borderRadius: collapsed ? '7px' : '8px',
              background: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: collapsed ? 0 : '1rem',
              fontSize: collapsed ? '0.85rem' : '0.9rem',
              color: '#718096',
              transition: 'all 0.25s ease'
            }}>
              {section.icon}
            </div>
            {!collapsed && <span>{section.name}</span>}
          </div>
        ))}
        {/* Logout for desktop/tablet, always present and aligned */}
        <div
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0.875rem' : '1rem 1.25rem',
            margin: '0.5rem 0',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            fontSize: '0.95rem',
            borderRadius: '10px',
            color: '#e53e3e',
            fontWeight: '500',
            borderTop: '1px solid #e2e8f0',
            marginTop: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fff5f5';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(229,62,62,0.08)';
            if (!collapsed) {
              e.currentTarget.style.transform = 'translateX(4px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
          title={collapsed ? 'Logout' : ''}
        >
          <div style={{
            width: collapsed ? '28px' : '32px',
            height: collapsed ? '28px' : '32px',
            borderRadius: collapsed ? '7px' : '8px',
            background: '#fed7d7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: collapsed ? 0 : '1rem',
            fontSize: collapsed ? '0.85rem' : '0.9rem',
            color: '#e53e3e',
            transition: 'all 0.25s ease'
          }}>
            <FaTimes />
          </div>
          {!collapsed && <span>Logout</span>}
        </div>
      </div>

      {/* Desktop Footer */}
      {!collapsed && (
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderTop: '1px solid #e2e8f0',
          background: '#f7fafc'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: '0.8rem',
            color: '#a0aec0'
          }}>AMI beta</p>
        </div>
      )}
    </div>
  );
}

export default Sidebar;