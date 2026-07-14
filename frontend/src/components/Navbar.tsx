'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaPhoneAlt, 
  FaHome, 
  FaRegClock, 
  FaSignOutAlt, 
  FaBell, 
  FaCoins, 
  FaUserAlt,
  FaTree,
  FaCompass,
  FaFolderOpen,
  FaUserPlus,
  FaSignInAlt,
  FaGithub
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

interface NotificationItem {
  _id: string;
  message: string;
  toEmail: string;
  actionRoute: string;
  time: string;
  read: boolean;
}

export default function Navbar() {
  const { user, logout, refreshProfile } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImageError(false);
  }, [user]);

  const githubRepoUrl = 'https://github.com/coderguy/tree-funding-client';

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter((n: NotificationItem) => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      refreshProfile();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  return (
    <header className="main-header clearfix" data-sticky_header="true">
      <section className="header-wrapper navgiation-wrapper">
        
        {/* TOP SOCIAL & INFO BAR */}
        <div className="main-top-header clearfix">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 text-left hidden-sm hidden-xs">
                <div className="top-bar-social" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a href="https://github.com/CoderGUY47" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
                  <a href="https://x.com/CoderGUY47" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"><FaXTwitter /></a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
                </div>
              </div>  
              
              <div className="col-lg-6 col-md-6 text-right hidden-sm hidden-xs">
                <div className="top-bar-link">
                  {user ? (
                    <span style={{ color: '#ccc', marginRight: '15px', fontSize: '12px' }}>
                      <FaUserAlt style={{ marginRight: '5px', display: 'inline-block', verticalAlign: 'middle' }} />
                      Logged in: <strong>{user.email}</strong> ({user.role})
                    </span>
                  ) : (
                    <>
                      <a href="">Email</a>
                      <a href="">Community</a>
                      <a href="">Support</a>
                    </>
                  )}
                </div>
              </div>
            </div>   
          </div>
        </div>

        {/* LOGO & ADDRESS BOXES */}
        <div className="header-top">
          <div className="container">
            <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="col-md-4 col-sm-12 header-col-logo">
                <div className="header-logo logo" style={{ display: 'flex', alignItems: 'center', height: '52px' }}>
                  <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <FaTree style={{ color: '#7cb032', fontSize: '32px' }} />
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', letterSpacing: '-0.5px' }}>
                      Tree<span style={{ color: '#7cb032' }}>Fund</span>
                    </span>
                  </a>
                </div>
              </div>
              <div className="col-md-8 hidden-xs">
                <div className="row">
                  <div className="col-md-4 col-sm-4 info-separotor">
                    <div className="header-icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaPhoneAlt />
                      </div>
                      <div className="text" style={{ marginLeft: '10px' }}>
                        <span className="head-heading">Get In Touch</span>                                                
                        <span className="head-content">example@gmail.com</span>
                      </div>
                    </div>   
                  </div>

                  <div className="col-md-4 col-sm-4 info-separotor">
                    <div className="header-icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaHome />
                      </div>
                      <div className="text" style={{ marginLeft: '10px' }}>
                        <span className="head-heading">Office Address</span>                                                
                        <span className="head-content">Sylhet, Bangladesh</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-4 info-separotor">
                    <div className="header-icon-box" style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="icon-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaRegClock />
                      </div>
                      <div className="text" style={{ marginLeft: '10px' }}>
                        <span className="head-heading">Opening Hour</span>                                                
                        <span className="head-content">10.00 - 18.00 UTC+06</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION MENUS */}
        <div className="navbar navbar-default">			
          <div className="container clearfix">
            <div className="navbar-header">
              <button 
                type="button" 
                className="navbar-toggle" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ background: '#7cb032', borderColor: '#7cb032' }}
              >
                <span className="icon-bar" style={{ background: '#fff' }}></span>
                <span className="icon-bar" style={{ background: '#fff' }}></span>
                <span className="icon-bar" style={{ background: '#fff' }}></span>
              </button>
            </div>

            <div className={`navbar-collapse my-navbar-menu pull-left ${mobileMenuOpen ? 'in' : ''}`}>
              <ul className="nav navbar-nav">
                <li style={pathname === '/' ? { background: '#7cb032' } : undefined}>
                  <a href="/" className={pathname === '/' ? 'link-active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: pathname === '/' ? '#000000' : 'var(--nav-link-color, #ffffff)' }}>
                    <FaHome style={{ color: pathname === '/' ? '#000000' : 'inherit' }} /> HOME
                  </a>
                </li>
                <li style={pathname === '/explore' ? { background: '#7cb032' } : undefined}>
                  <a href="/explore" className={pathname === '/explore' ? 'link-active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: pathname === '/explore' ? '#000000' : 'var(--nav-link-color, #ffffff)' }}>
                    <FaCompass style={{ color: pathname === '/explore' ? '#000000' : 'inherit' }} /> EXPLORE CAMPAIGNS
                  </a>
                </li>
                <li style={pathname === '/developer' ? { background: '#7cb032' } : undefined}>
                  <a href="/developer" className={pathname === '/developer' ? 'link-active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: pathname === '/developer' ? '#000000' : 'var(--nav-link-color, #ffffff)' }}>
                    <FaGithub style={{ color: pathname === '/developer' ? '#000000' : 'inherit' }} /> JOIN AS DEVELOPER
                  </a>
                </li>
                
                {user ? (
                  <>
                    <li style={pathname.startsWith('/dashboard') ? { background: '#7cb032' } : undefined}>
                      <a href="/dashboard" className={pathname.startsWith('/dashboard') ? 'link-active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: pathname.startsWith('/dashboard') ? '#000000' : 'var(--nav-link-color, #ffffff)' }}>
                        <FaFolderOpen style={{ color: pathname.startsWith('/dashboard') ? '#000000' : 'inherit' }} /> DASHBOARD
                      </a>
                    </li>
                    {/* On Mobile only: show Avatar and Logout inside menu */}
                    <li className="visible-xs hidden-sm hidden-md hidden-lg" style={{ display: 'flex', alignItems: 'center', padding: '10px 15px', gap: '10px' }}>
                      {user.photoUrl && 
                       user.photoUrl !== 'null' && 
                       user.photoUrl !== 'undefined' && 
                       user.photoUrl.trim() !== '' && 
                       (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('/')) && 
                       !imageError ? (
                        <img 
                          src={user.photoUrl} 
                          alt="Avatar" 
                          onError={() => setImageError(true)}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7cb032' }}
                        />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7cb032', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <span style={{ color: '#fff', fontSize: '13px' }}>{user.email}</span>
                    </li>
                    <li className="visible-xs hidden-sm hidden-md hidden-lg" style={{ cursor: 'pointer' }}>
                      <a onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: 'var(--nav-link-color, #ffffff)' }}>
                        <FaSignOutAlt /> LOGOUT
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li style={{ background: '#7cb032' }}>
                      <a href="/login" className={pathname === '/login' ? 'link-active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        <FaSignInAlt style={{ color: '#ffffff' }} /> LOGIN
                      </a>
                    </li>
                    <li>
                      <a href="/register" className={pathname === '/register' ? 'link-active' : ''} style={{ display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', color: pathname === '/register' ? '#7cb032' : 'var(--nav-link-color, #ffffff)' }}>
                        <FaUserPlus /> REGISTER
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* ACTION ITEMS (CREDITS, NOTIFICATIONS) */}
            <div className="navbar-header pull-right hidden-xs" style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {/* Credits Badge */}
                  <span className="btn btn-theme" style={{ cursor: 'default', background: '#2e3033', color: '#fff', border: 'none', pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaCoins style={{ color: '#7cb032' }} />
                    {user.credits} Credits
                  </span>

                  {/* Notifications Icon & Pop-up */}
                  <div className="relative" ref={notificationsRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      style={{ background: 'none', border: 'none', color: '#333', fontSize: '18px', cursor: 'pointer', position: 'relative', outline: 'none' }}
                      aria-label="Notifications"
                    >
                      <FaBell style={{ display: 'block' }} />
                      {unreadCount > 0 && (
                        <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#7cb032', color: '#fff', fontSize: '9px', borderRadius: '50%', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="notification-popup-container" style={{ position: 'absolute', right: 0, top: '35px', width: '320px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, overflow: 'hidden' }}>
                        <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', background: '#fcfcfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '12px', color: '#333' }}>Alert Notifications</strong>
                          {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} style={{ background: 'none', border: 'none', color: '#7cb032', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          {notifications.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: '#777' }}>
                              No notifications.
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div 
                                key={notif._id}
                                onClick={() => { if (!notif.read) handleMarkAsRead(notif._id); }}
                                style={{ padding: '10px 15px', borderBottom: '1px solid #f5f5f5', background: notif.read ? '#fff' : '#f9fff0', cursor: 'pointer', textAlign: 'left' }}
                              >
                                <a href={notif.actionRoute} onClick={() => setNotificationsOpen(false)} style={{ textDecoration: 'none', color: '#444', display: 'block' }}>
                                  <p style={{ fontSize: '11px', margin: 0, lineHeight: '1.4', fontWeight: notif.read ? 'normal' : 'bold' }}>
                                    {notif.message}
                                  </p>
                                  <span style={{ fontSize: '9px', color: '#999', display: 'block', marginTop: '4px' }}>
                                    {new Date(notif.time).toLocaleString()}
                                  </span>
                                </a>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Avatar */}
                  {user.photoUrl && 
                   user.photoUrl !== 'null' && 
                   user.photoUrl !== 'undefined' && 
                   user.photoUrl.trim() !== '' && 
                   (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('/')) && 
                   !imageError ? (
                    <img 
                      src={user.photoUrl} 
                      alt="Avatar" 
                      onError={() => setImageError(true)}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7cb032' }}
                    />
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#7cb032', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}

                  {/* Logout Button */}
                  <button 
                    onClick={logout}
                    className="btn btn-theme"
                    style={{ 
                      background: '#7cb032', 
                      color: '#ffffff', 
                      border: 'none', 
                      height: '36px', 
                      padding: '0 15px', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <FaSignOutAlt /> LOGOUT
                  </button>
                </div>
              )}
              {!user && (
                <a 
                  className="btn btn-theme" 
                  href="/login" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: 0, 
                    height: '44px', 
                    padding: '0 20px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase' 
                  }}
                >
                  DONATE NOW
                </a>
              )}
            </div>
          </div>
        </div>

      </section>
    </header>
  );
}
