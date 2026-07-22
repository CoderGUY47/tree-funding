'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { FaUser, FaEnvelope, FaCoins, FaIdBadge, FaImage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhotoUrl(user.photoUrl || '');
      setImageError(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-primary animate-spin mx-auto" />
        <p className="mt-4 text-zinc-500 text-xs font-bold">Loading profile...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await updateProfile(name, photoUrl);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred during update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-left flex flex-col gap-8">
      
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-black text-zinc-900 m-0 font-heading">Profile Settings</h2>
        <p className="text-xs text-zinc-500 mt-1.5 font-bold leading-relaxed">
          Manage your account profile metadata, avatar photo, and monitor credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Card View */}
        <div className="lg:col-span-4 bg-white border border-zinc-200 p-6 rounded-[24px] shadow-sm text-center">
          {/* Avatar Container */}
          <div className="relative inline-block mb-4">
            {photoUrl && 
             photoUrl !== 'null' && 
             photoUrl !== 'undefined' && 
             photoUrl.trim() !== '' && 
             (photoUrl.startsWith('http') || photoUrl.startsWith('/')) && 
             !imageError ? (
              <img 
                src={photoUrl} 
                alt={name}
                onError={() => setImageError(true)}
                className="w-28 h-28 rounded-full object-cover border-4 border-primary shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-black shrink-0 shadow-sm">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <h3 className="text-lg font-black text-zinc-900 m-0">{user.name}</h3>
          <span className="inline-block mt-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full tracking-wider">
            {user.role}
          </span>

          {/* Profile Statistics List */}
          <div className="border-t border-zinc-150 pt-5 mt-5 flex flex-col gap-3.5 text-xs font-semibold text-zinc-650">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <FaEnvelope className="text-primary text-sm shrink-0" /> Email
              </span>
              <span className="text-zinc-800 truncate max-w-[150px]">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <FaCoins className="text-primary text-sm shrink-0" /> Wallet Credits
              </span>
              <span className="text-primary font-bold">{user.credits} CR</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <FaIdBadge className="text-primary text-sm shrink-0" /> ID Token
              </span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wide">
                {user.id.substring(0, 8)}...{user.id.substring(user.id.length - 8)}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Editing Form */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 p-6 md:p-8 rounded-[24px] shadow-sm">
          <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wider border-b border-zinc-105 pb-3 mb-6 font-heading">
            Edit Account Metadata
          </h4>

          {message && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-[7px] text-xs font-bold flex items-center gap-2 mb-6 animate-in fade-in">
              <FaCheckCircle className="shrink-0" /> {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-[7px] text-xs font-bold flex items-center gap-2 mb-6 animate-in fade-in">
              <FaExclamationTriangle className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5 text-left">
              <Label htmlFor="nameInput" className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                Full Name
              </Label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-3.5 text-zinc-400 text-sm shrink-0" />
                <input
                  id="nameInput"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 w-full rounded-[7px] border border-zinc-200 bg-white text-zinc-950 placeholder-zinc-400 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Email Address (Read-only) */}
            <div className="flex flex-col gap-1.5 text-left">
              <Label htmlFor="emailInput" className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                Email Address (Verified)
              </Label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-3.5 text-zinc-300 text-sm shrink-0" />
                <input
                  id="emailInput"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-11 w-full rounded-[7px] border border-zinc-200 bg-zinc-50/50 text-zinc-400 pl-10 pr-4 text-xs font-semibold cursor-not-allowed outline-none"
                />
              </div>
              <small className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                Account emails cannot be altered after verification.
              </small>
            </div>

            {/* Profile Image URL */}
            <div className="flex flex-col gap-1.5 text-left">
              <Label htmlFor="photoInput" className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                Profile Image URL (Avatar)
              </Label>
              <div className="relative">
                <FaImage className="absolute left-3.5 top-3.5 text-zinc-400 text-sm shrink-0" />
                <input
                  id="photoInput"
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={photoUrl}
                  onChange={(e) => { setPhotoUrl(e.target.value); setImageError(false); }}
                  className="h-11 w-full rounded-[7px] border border-zinc-200 bg-white text-zinc-950 placeholder-zinc-400 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <small className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                Provide an absolute web URL link to your custom JPEG/PNG/WebP profile picture.
              </small>
            </div>

            {/* Actions */}
            <div className="border-t border-zinc-150 pt-5 mt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/95 text-white font-bold h-11 px-8 rounded-[7px] border-none cursor-pointer flex items-center justify-center min-w-[140px] text-xs transition-colors"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}
