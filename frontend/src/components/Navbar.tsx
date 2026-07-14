'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { 
  FaSignOutAlt, 
  FaBell, 
  FaCoins, 
  FaUserAlt,
  FaTree,
  FaCompass,
  FaFolderOpen,
  FaGithub,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser
} from 'react-icons/fa';

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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImageError(false);
  }, [user]);

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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-xs font-sans">
      <div className="container mx-auto px-6 max-w-6xl h-20 flex justify-between items-center">
        
        {/* Left Side: Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <FaTree className="text-2xl" />
          </div>
          <span className="text-xl font-black text-zinc-900 tracking-tight">
            Tree<span className="text-emerald-600">Fund</span>
          </span>
        </a>

        {/* Center: Main Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <a 
            href="/" 
            className={`no-underline transition-colors relative py-2 ${
              pathname === '/' ? 'text-emerald-650' : 'text-zinc-550 hover:text-zinc-800'
            }`}
          >
            Home
            {pathname === '/' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </a>
          <a 
            href="/explore" 
            className={`no-underline transition-colors relative py-2 flex items-center gap-1.5 ${
              pathname === '/explore' ? 'text-emerald-650' : 'text-zinc-550 hover:text-zinc-800'
            }`}
          >
            <FaCompass className="text-xs" /> Explore
            {pathname === '/explore' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </a>
          <a 
            href="https://github.com/CoderGUY47/tree-funding" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-555 hover:text-zinc-800 no-underline transition-colors flex items-center gap-1.5"
          >
            <FaGithub className="text-xs" /> Join as Developer
          </a>
          
          {user && (
            <a 
              href="/dashboard" 
              className={`no-underline transition-colors relative py-2 flex items-center gap-1.5 ${
                pathname.startsWith('/dashboard') ? 'text-emerald-650' : 'text-zinc-550 hover:text-zinc-800'
              }`}
            >
              <FaFolderOpen className="text-xs" /> Dashboard
              {pathname.startsWith('/dashboard') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </a>
          )}
        </nav>

        {/* Right Side: User Actions */}
        <div className="flex items-center gap-4 shrink-0">
          
          {user ? (
            <div className="flex items-center gap-4">
              
              {/* Credits Counter badge */}
              <div className="bg-emerald-50/65 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border border-emerald-100/50">
                <FaCoins className="text-amber-500 text-sm" />
                <span>{user.credits} Credits</span>
              </div>

              {/* Notifications bell dropdown */}
              <div className="relative flex items-center" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="bg-transparent border-none text-zinc-600 hover:text-zinc-900 text-lg cursor-pointer relative p-1.5 outline-none hover:bg-zinc-50 rounded-xl transition-colors"
                  aria-label="Notifications"
                >
                  <FaBell />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-amber-500 text-zinc-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown list */}
                {notificationsOpen && (
                  <div className="absolute right-0 top-11 w-80 bg-white border border-zinc-150 rounded-2xl shadow-xl z-50 overflow-hidden text-zinc-800 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/60 flex justify-between items-center">
                      <strong className="text-xs text-zinc-800 uppercase font-black tracking-wider">Notifications</strong>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead} 
                          className="bg-transparent border-none text-[10px] font-black text-emerald-600 hover:text-emerald-700 cursor-pointer uppercase tracking-wider"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-xs text-zinc-400 font-bold">
                          No alerts or notifications.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id}
                            onClick={() => { if (!notif.read) handleMarkAsRead(notif._id); }}
                            className={`p-3.5 border-b border-zinc-50 cursor-pointer hover:bg-zinc-50/80 transition-colors ${
                              notif.read ? 'bg-white' : 'bg-emerald-50/20'
                            }`}
                          >
                            <a href={notif.actionRoute} onClick={() => setNotificationsOpen(false)} className="no-underline text-zinc-700 block">
                              <p className={`text-xs m-0 leading-relaxed ${notif.read ? 'font-medium text-zinc-650' : 'font-extrabold text-zinc-900'}`}>
                                {notif.message}
                              </p>
                              <span className="text-[9px] text-zinc-400 block mt-1">
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

              {/* Profile dropdown selector */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="bg-transparent border-none flex items-center gap-1.5 cursor-pointer p-0.5 outline-none"
                >
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
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 border border-emerald-400">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <FaChevronDown className="text-[10px] text-zinc-400 mt-0.5" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-11 w-48 bg-white border border-zinc-150 rounded-2xl shadow-xl z-50 overflow-hidden text-zinc-800 text-left py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-zinc-50 pb-2 mb-1.5">
                      <p className="text-xs font-black text-zinc-800 m-0 truncate">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 m-0 mt-0.5 truncate">{user.role}</p>
                    </div>
                    <a href="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 no-underline flex items-center gap-2">
                      <FaFolderOpen className="text-emerald-500" /> Workspace
                    </a>
                    <a href="/dashboard/profile" onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 no-underline flex items-center gap-2">
                      <FaUser className="text-emerald-500" /> My Profile
                    </a>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-zinc-50 no-underline flex items-center gap-2 bg-transparent border-none cursor-pointer"
                    >
                      <FaSignOutAlt /> Log Out
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-4">
              <a 
                href="/login" 
                className="text-xs font-bold text-zinc-600 hover:text-zinc-900 no-underline transition-colors"
              >
                Sign In
              </a>
              <a 
                href="/register" 
                className="h-10 px-5 rounded-full bg-emerald-600 hover:bg-emerald-555 text-white font-bold text-xs uppercase tracking-wide no-underline flex items-center justify-center transition-colors shadow-md shadow-emerald-600/10"
              >
                Get Started
              </a>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-transparent border-none text-zinc-600 hover:text-zinc-950 p-2 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-50 border-t border-zinc-100 py-4 flex flex-col gap-1 px-6 shadow-inner text-left">
          <a href="/" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-bold text-zinc-700 hover:text-emerald-650 no-underline flex items-center gap-2">Home</a>
          <a href="/explore" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-bold text-zinc-700 hover:text-emerald-650 no-underline flex items-center gap-2">Explore Campaigns</a>
          <a href="https://github.com/CoderGUY47/tree-funding" target="_blank" rel="noopener noreferrer" className="py-2.5 text-sm font-bold text-zinc-700 hover:text-emerald-650 no-underline flex items-center gap-2">Join as Developer</a>
          {user && (
            <a href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-sm font-bold text-zinc-700 hover:text-emerald-650 no-underline flex items-center gap-2">Dashboard</a>
          )}
        </div>
      )}

    </header>
  );
}
