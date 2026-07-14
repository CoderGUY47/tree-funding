'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  FaGithub,
  FaBars,
  FaTimes
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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);

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
    <header className="w-full bg-white border-b border-zinc-100 font-sans z-40 relative">
      
      {/* TOP SOCIAL & INFO BAR */}
      <div className="bg-zinc-900 text-zinc-300 py-2.5 text-xs">
        <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <a href="https://github.com/CoderGUY47" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="GitHub"><FaGithub className="text-sm" /></a>
            <a href="https://x.com/CoderGUY47" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="Twitter / X"><FaXTwitter className="text-sm" /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="Facebook"><FaFacebookF className="text-sm" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="Instagram"><FaInstagram className="text-sm" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors" aria-label="YouTube"><FaYoutube className="text-sm" /></a>
          </div>
          <div>
            {user ? (
              <span className="flex items-center gap-1.5 text-zinc-400">
                <FaUserAlt className="text-zinc-500" />
                Logged in: <strong className="text-zinc-200">{user.email}</strong> ({user.role})
              </span>
            ) : (
              <div className="flex gap-4 font-semibold">
                <a href="/login" className="hover:text-emerald-500 transition-colors">Email Support</a>
                <span>|</span>
                <a href="/explore" className="hover:text-emerald-500 transition-colors">Community</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOGO & ADDRESS BOXES */}
      <div className="py-6 border-b border-zinc-50">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 no-underline shrink-0">
            <FaTree className="text-emerald-600 text-3xl" />
            <span className="text-2xl font-black text-zinc-900 tracking-tight">
              Tree<span className="text-emerald-600">Fund</span>
            </span>
          </a>

          {/* Contact Details (Hidden on small viewports) */}
          <div className="hidden md:flex items-center gap-8 text-left">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                <FaPhoneAlt />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-wider m-0">Get In Touch</p>
                <p className="text-xs font-bold text-zinc-700 m-0 mt-0.5">example@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                <FaHome />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-wider m-0">Office Address</p>
                <p className="text-xs font-bold text-zinc-700 m-0 mt-0.5">Sylhet, Bangladesh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                <FaRegClock />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-wider m-0">Opening Hour</p>
                <p className="text-xs font-bold text-zinc-700 m-0 mt-0.5">10.00 - 18.00 UTC+06</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* NAVIGATION BAR (EMERALD BACKGROUND) */}
      <nav className="bg-emerald-600 text-white shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center relative">
          
          {/* Mobile hamburger button */}
          <div className="flex md:hidden py-3">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-emerald-700 text-white border-none p-2 rounded-lg cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>

          {/* Main Desktop Links */}
          <div className={`absolute md:relative top-full left-0 right-0 bg-emerald-700 md:bg-transparent flex-col md:flex-row flex md:items-center gap-0 md:gap-1.5 transition-all duration-200 z-30 ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
            <a 
              href="/" 
              className={`px-5 py-4 font-bold text-xs uppercase tracking-wide no-underline flex items-center gap-2 hover:bg-emerald-700 transition-colors ${
                pathname === '/' ? 'bg-emerald-800 text-white' : 'text-emerald-50'
              }`}
            >
              <FaHome /> Home
            </a>
            <a 
              href="/explore" 
              className={`px-5 py-4 font-bold text-xs uppercase tracking-wide no-underline flex items-center gap-2 hover:bg-emerald-700 transition-colors ${
                pathname === '/explore' ? 'bg-emerald-800 text-white' : 'text-emerald-50'
              }`}
            >
              <FaCompass /> Explore Campaigns
            </a>
            <a 
              href="https://github.com/CoderGUY47/tree-funding" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-4 font-bold text-xs uppercase tracking-wide no-underline flex items-center gap-2 hover:bg-emerald-700 text-emerald-50 transition-colors"
            >
              <FaGithub /> Join as Developer
            </a>
            
            {user && (
              <a 
                href="/dashboard" 
                className={`px-5 py-4 font-bold text-xs uppercase tracking-wide no-underline flex items-center gap-2 hover:bg-emerald-700 transition-colors ${
                  pathname.startsWith('/dashboard') ? 'bg-emerald-800 text-white' : 'text-emerald-50'
                }`}
              >
                <FaFolderOpen /> Dashboard
              </a>
            )}
          </div>

          {/* Logged in Badges & Profile (Right side) */}
          <div className="flex items-center gap-4 py-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3.5">
                
                {/* Credits Badge */}
                <div className="bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm border border-emerald-700/50">
                  <FaCoins className="text-amber-400" />
                  <span>{user.credits} Credits</span>
                </div>

                {/* Notifications Popover */}
                <div className="relative flex items-center" ref={notificationsRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="bg-transparent border-none text-white hover:text-emerald-200 text-lg cursor-pointer relative p-1 outline-none"
                    aria-label="Notifications"
                  >
                    <FaBell />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown popup */}
                  {notificationsOpen && (
                    <div className="absolute right-0 top-10 w-80 bg-white border border-zinc-150 rounded-2xl shadow-xl z-50 overflow-hidden text-zinc-800 text-left">
                      <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                        <strong className="text-xs text-zinc-800 uppercase font-black tracking-wide">Alert Notifications</strong>
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllAsRead} 
                            className="bg-transparent border-none text-[10px] font-black text-emerald-600 hover:text-emerald-700 cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-xs text-zinc-400 font-medium">
                            No notifications to display.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id}
                              onClick={() => { if (!notif.read) handleMarkAsRead(notif._id); }}
                              className={`p-3.5 border-b border-zinc-50 cursor-pointer hover:bg-zinc-50 transition-colors ${
                                notif.read ? 'bg-white' : 'bg-emerald-50/40'
                              }`}
                            >
                              <a href={notif.actionRoute} onClick={() => setNotificationsOpen(false)} className="no-underline text-zinc-700 block">
                                <p className={`text-xs m-0 leading-relaxed ${notif.read ? 'font-normal' : 'font-bold text-zinc-900'}`}>
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
                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-700">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}

                {/* Logout Button */}
                <button 
                  onClick={logout}
                  className="h-8 px-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wide border-none cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
                </button>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a 
                  href="/login" 
                  className="h-8 px-4 rounded-lg bg-emerald-850 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wide no-underline flex items-center justify-center gap-1.5 transition-colors border border-emerald-800/30"
                >
                  <FaSignInAlt /> Login
                </a>
                <a 
                  href="/register" 
                  className="h-8 px-4 rounded-lg bg-white hover:bg-zinc-100 text-emerald-600 font-bold text-xs uppercase tracking-wide no-underline flex items-center justify-center gap-1.5 transition-colors border-none"
                >
                  <FaUserPlus /> Register
                </a>
              </div>
            )}
          </div>

        </div>
      </nav>

    </header>
  );
}
