'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/auth-client';
import { FaUser, FaEnvelope, FaCoins, FaIdBadge, FaImage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  
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
      <div className="text-center" style={{ padding: '60px 0' }}>
        <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
        <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading profile...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Call Better Auth to update user details on client
      const res = await authClient.updateUser({
        name,
        image: photoUrl // Set standard image field
      });

      if (res.error) {
        setError(res.error.message || 'Failed to update profile settings.');
      } else {
        setMessage('Profile updated successfully!');
        // Refresh the global auth state
        await refreshProfile();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>Profile Settings</h2>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
          Manage your account profile metadata, avatar photo, and monitor credentials.
        </p>
      </div>

      <div className="row">
        {/* Profile Card View */}
        <div className="col-md-4 col-sm-12" style={{ marginBottom: '25px' }}>
          <div style={{ background: '#fff', border: '1px solid #eee', padding: '30px 20px', borderRadius: '4px', textAlign: 'center' }}>
            {/* Avatar container */}
            <div style={{ display: 'inline-block', position: 'relative', marginBottom: '20px' }}>
              {photoUrl && !imageError ? (
                <img 
                  src={photoUrl} 
                  alt={name}
                  onError={() => setImageError(true)}
                  style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #7cb032', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}
                />
              ) : (
                <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: '#7cb032', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', fontWeight: 'bold', margin: '0 auto', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>{user.name}</h3>
            <span style={{ display: 'inline-block', padding: '3px 12px', background: '#eaf4db', color: '#56801b', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px' }}>
              {user.role}
            </span>

            {/* Profile Statistics List */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaEnvelope style={{ color: '#7cb032' }} /> Email
                </span>
                <span style={{ fontWeight: 'bold', color: '#444' }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaCoins style={{ color: '#7cb032' }} /> Wallet Credits
                </span>
                <span style={{ fontWeight: 'bold', color: '#7cb032' }}>{user.credits} CR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaIdBadge style={{ color: '#7cb032' }} /> ID Token
                </span>
                <span style={{ fontSize: '10px', color: '#999', fontFamily: 'monospace' }}>
                  {user.id.substring(0, 8)}...{user.id.substring(user.id.length - 8)}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Profile Editing Form */}
        <div className="col-md-8 col-sm-12">
          <div style={{ background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>
              Edit Account Metadata
            </h4>

            {message && (
              <div className="alert alert-success" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCheckCircle /> {message}
              </div>
            )}

            {error && (
              <div className="alert alert-danger" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaExclamationTriangle /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Full Name */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); }}
                    required
                    style={{ paddingLeft: '35px', height: '40px', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Email Address (Read-only) */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Email Address (Verified)
                </label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '12px', top: '12px', color: '#ccc' }} />
                  <input
                    type="email"
                    className="form-control"
                    value={user.email}
                    disabled
                    style={{ paddingLeft: '35px', height: '40px', fontSize: '13px', background: '#fcfcfc', color: '#999', cursor: 'not-allowed' }}
                  />
                </div>
                <small style={{ color: '#aaa', fontSize: '10px', display: 'block', marginTop: '5px' }}>
                  Account emails cannot be altered after verification.
                </small>
              </div>

              {/* Profile Image URL */}
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Profile Image URL (Avatar)
                </label>
                <div style={{ position: 'relative' }}>
                  <FaImage style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                  <input
                    type="url"
                    className="form-control"
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    value={photoUrl}
                    onChange={(e) => { setPhotoUrl(e.target.value); setImageError(false); }}
                    style={{ paddingLeft: '35px', height: '40px', fontSize: '13px' }}
                  />
                </div>
                <small style={{ color: '#aaa', fontSize: '10px', display: 'block', marginTop: '5px' }}>
                  Provide an absolute web URL link to your custom JPEG/PNG/WebP profile picture.
                </small>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px', textAlign: 'right' }}>
                <button
                  type="submit"
                  className="btn btn-theme"
                  disabled={loading}
                  style={{ minWidth: '140px', height: '40px', fontSize: '13px', background: '#7cb032', borderColor: '#7cb032', color: '#fff', fontWeight: 'bold' }}
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    'Save Settings'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
}
