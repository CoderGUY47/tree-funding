'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import {
  FaSignOutAlt,
  FaBell,
  FaCoins,
  FaFolderOpen,
  FaGithub,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaCompass,
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaRegClock,
  FaSearch,
} from 'react-icons/fa';
import { FaXTwitter, FaLinkedinIn } from 'react-icons/fa6';

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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setImageError(false); }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter((n: NotificationItem) => !n.read).length);
    } catch { /* noop */ }
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
    function handleOutside(e: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) setNotificationsOpen(false);
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) setProfileDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* noop */ }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch { /* noop */ }
  };

  const isNavLink = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full flex flex-col transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>

      {/* ═══════════════════════════════════════════════════════════
          TIER 1 — Thin top utility bar (email / phone / socials)
      ═══════════════════════════════════════════════════════════ */}
      <div className="w-full bg-zinc-800 border-b border-zinc-700">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-9 flex items-center justify-between">
          {/* Left: email + phone */}
          <div className="flex items-center gap-6 text-[11px] text-zinc-300 font-medium">
            <a href="mailto:hello@treefund.org" className="flex items-center gap-1.5 hover:text-white transition-colors no-underline text-zinc-300">
              <FaEnvelope className="text-primary text-[9px]" />
              hello@treefund.org
            </a>
            <a href="tel:+8808235600433" className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors no-underline text-zinc-300">
              <FaPhoneAlt className="text-primary text-[9px]" />
              (+880) 0823 560 433
            </a>
          </div>
          {/* Right: social icons */}
          <div className="flex items-center gap-3 text-zinc-400 text-xs">
            {[
              { href: 'https://facebook.com', icon: <FaFacebookF />, label: 'Facebook' },
              { href: 'https://linkedin.com', icon: <FaLinkedinIn />, label: 'LinkedIn' },
              { href: 'https://instagram.com', icon: <FaInstagram />, label: 'Instagram' },
              { href: 'https://x.com/CoderGUY47', icon: <FaXTwitter />, label: 'X' },
              { href: 'https://github.com/CoderGUY47', icon: <FaGithub />, label: 'GitHub' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-6 h-6 rounded flex items-center justify-center hover:bg-primary hover:text-white transition-all text-zinc-400">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TIER 2 — Logo + contact info blocks
      ═══════════════════════════════════════════════════════════ */}
      <div className="w-full bg-white border-b border-zinc-100">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-[76px] flex items-center justify-between gap-8">
          
          {/* Logo */}
          <a href="/" className="flex items-center no-underline shrink-0 group">
            <Image
              src="/images/tree-fund-logo.png"
              alt="TreeFund Logo"
              width={150}
              height={50}
              className="h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
          </a>

          {/* Contact info blocks — hidden on mobile */}
          <div className="hidden lg:flex items-center gap-8 ml-auto mr-6">
            {[
              {
                icon: <FaRegClock className="text-primary text-xl" />,
                title: 'Opening Hours',
                detail: 'Mon – Sat: 9:00 to 18:00',
              },
              {
                icon: <FaMapMarkerAlt className="text-primary text-xl" />,
                title: 'Our Address',
                detail: 'Road-2, East Shibgonj, Sylhet',
              },
              {
                icon: <FaPhoneAlt className="text-primary text-xl" />,
                title: 'Contact Us',
                detail: '(+880) 0823 560 433',
              },
            ].map((block, i) => (
              <div key={i} className="flex items-center gap-3 border-l border-zinc-100 pl-8 first:border-0 first:pl-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {block.icon}
                </div>
                <div>
                  <p className="text-[11px] font-black text-zinc-800 uppercase tracking-wider m-0">{block.title}</p>
                  <p className="text-[11px] text-zinc-500 font-medium m-0 mt-0.5">{block.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Donate / Auth buttons (tier 2 right side) */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                <FaCoins className="text-amber-500" />
                {user.credits} Cr
              </div>
            ) : (
              <a href="/register" className="hidden sm:inline-flex h-10 px-5 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-wider items-center justify-center no-underline hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                Join Free
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TIER 3 — Dark navigation bar with links + Donate button
      ═══════════════════════════════════════════════════════════ */}
      <div className="w-full bg-[#1a3c34]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-[58px] flex items-center justify-between">

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/explore', label: 'Explore Campaigns', icon: <FaCompass className="text-[10px]" /> },
              { href: '/developer', label: 'Developer', icon: <FaGithub className="text-[10px]" /> },
              ...(user ? [{ href: '/dashboard', label: 'Dashboard', icon: <FaFolderOpen className="text-[10px]" /> }] : []),
            ].map(link => {
              const active = isNavLink(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-4 h-[58px] text-[13px] font-semibold no-underline transition-all duration-200 ${
                    active
                      ? 'text-white bg-primary/30 border-b-2 border-primary'
                      : 'text-zinc-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon} {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right side: search + notifications + user + donate btn */}
          <div className="flex items-center gap-3 ml-auto">

            {/* Search icon */}
            <button className="text-zinc-300 hover:text-white p-2 transition-colors cursor-pointer bg-transparent border-none" aria-label="Search">
              <FaSearch className="text-sm" />
            </button>

            {/* Notifications (logged in only) */}
            {user && (
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(o => !o)}
                  aria-label="Notifications"
                  className="relative p-2 text-zinc-300 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                >
                  <FaBell className="text-sm" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-zinc-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50">
                      <span className="text-xs font-black text-zinc-800 uppercase tracking-wider">Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} className="text-[10px] text-primary font-bold cursor-pointer bg-transparent border-none hover:text-primary/70">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-zinc-400 font-medium">No notifications yet.</div>
                      ) : notifications.map(notif => (
                        <div key={notif._id} onClick={() => { if (!notif.read) handleMarkAsRead(notif._id); }}
                          className={`px-4 py-3 cursor-pointer hover:bg-zinc-50 transition-colors ${notif.read ? '' : 'bg-primary/[0.03]'}`}>
                          <a href={notif.actionRoute} onClick={() => setNotificationsOpen(false)} className="no-underline block">
                            <p className={`text-[11px] m-0 leading-relaxed ${notif.read ? 'text-zinc-600 font-medium' : 'text-zinc-900 font-bold'}`}>
                              {notif.message}
                            </p>
                            <span className="text-[9px] text-zinc-400 mt-1 block">{new Date(notif.time).toLocaleString()}</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User avatar dropdown / Sign In link */}
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(o => !o)}
                  className="flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0 outline-none"
                >
                  {user.photoUrl && user.photoUrl !== 'null' && user.photoUrl !== 'undefined' && user.photoUrl.trim() !== '' && (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('/')) && !imageError ? (
                    <img src={user.photoUrl} alt="Avatar" onError={() => setImageError(true)} className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs border-2 border-white/30">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <FaChevronDown className="text-[9px] text-zinc-300" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-zinc-100 shadow-2xl z-50 overflow-hidden py-1.5 animate-in fade-in duration-150">
                    <div className="px-4 pt-3 pb-3 border-b border-zinc-50">
                      <p className="text-xs font-black text-zinc-900 m-0 truncate">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 m-0 mt-0.5 truncate">{user.role}</p>
                    </div>
                    <a href="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 no-underline flex items-center gap-2.5 transition-colors">
                      <FaFolderOpen className="text-primary" /> Workspace
                    </a>
                    <a href="/dashboard/profile" onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 no-underline flex items-center gap-2.5 transition-colors">
                      <FaUser className="text-primary" /> My Profile
                    </a>
                    <button onClick={logout} className="w-full text-left px-4 py-2.5 text-[11px] font-semibold text-red-500 hover:bg-zinc-50 flex items-center gap-2.5 bg-transparent border-none cursor-pointer transition-colors">
                      <FaSignOutAlt /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a href="/login" className="text-zinc-300 hover:text-white text-[13px] font-semibold no-underline transition-colors">
                Sign In
              </a>
            )}

            {/* DONATE NOW — prominent CTA button */}
            <a
              href="/register"
              className="h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[11px] uppercase tracking-widest no-underline flex items-center justify-center transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] ml-1"
            >
              Donate Now
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden p-2 text-white cursor-pointer bg-transparent border-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1a3c34] border-t border-white/10 px-6 py-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
          {[
            { href: '/', label: 'Home' },
            { href: '/explore', label: 'Explore Campaigns' },
            { href: '/developer', label: 'Developer' },
            ...(user ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
          ].map(link => (
            <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
              className="py-3 text-sm font-semibold text-zinc-200 hover:text-white no-underline border-b border-white/10 last:border-0 transition-colors">
              {link.label}
            </a>
          ))}
          {!user && (
            <div className="flex gap-3 pt-3">
              <a href="/login" className="flex-1 h-10 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center no-underline border border-white/20">Sign In</a>
              <a href="/register" className="flex-1 h-10 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center no-underline">Donate Now</a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
