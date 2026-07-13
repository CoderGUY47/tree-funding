'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { FaUsers, FaTrashAlt, FaExclamationTriangle, FaCheckCircle, FaUndoAlt } from 'react-icons/fa';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: 'Supporter' | 'Creator' | 'Admin';
  credits: number;
}

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete user state
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setError('');
    setSuccess('');

    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setSuccess('User role updated successfully!');
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole as any } : u));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating user role.');
    } finally {
      setUpdatingId('');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/admin/users/${deleteUserId}`);
      setSuccess('User deleted and removed from database successfully.');
      setUsers(prev => prev.filter(u => u._id !== deleteUserId));
      setDeleteUserId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting user.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaUsers style={{ color: '#7cb032' }} /> Manage Users
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Review user accounts, update security clearances, or delete profiles from the server.
        </p>
      </div>

      {success && !deleteUserId && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '20px' }}>
          <FaCheckCircle style={{ color: '#3c763d', fontSize: '16px', flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {error && !deleteUserId && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '20px' }}>
          <FaExclamationCircle style={{ color: '#a94442', fontSize: '16px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading user profiles...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered" style={{ margin: 0, fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', color: '#333' }}>
                <th style={{ fontWeight: 'bold' }}>User</th>
                <th style={{ fontWeight: 'bold' }}>Email</th>
                <th style={{ fontWeight: 'bold' }}>Credits</th>
                <th style={{ fontWeight: 'bold' }}>Modify Role</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ verticalAlign: 'middle' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {u.photoUrl ? (
                        <img
                          src={u.photoUrl}
                          alt={u.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }}
                        />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7cb032', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontWeight: 'bold', color: '#333' }}>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td style={{ fontWeight: 'bold', color: '#333' }}>{u.credits} Credits</td>
                  <td>
                    <select
                      value={u.role}
                      disabled={updatingId === u._id || u.email === currentUser?.email}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{ padding: '5px 10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', background: '#fff' }}
                    >
                      <option value="Supporter">Supporter</option>
                      <option value="Creator">Creator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => setDeleteUserId(u._id)}
                      disabled={u.email === currentUser?.email}
                      className="btn"
                      style={{ padding: '4px 8px', fontSize: '12px', background: '#d9534f', color: '#fff' }}
                      title="Remove User"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteUserId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ background: '#fff', borderRadius: '4px', width: '100%', maxWidth: '400px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            
            <div style={{ color: '#d9534f', fontSize: '40px', marginBottom: '15px' }}>
              <FaExclamationTriangle />
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
              Remove User Profile
            </h4>

            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              Are you sure you want to permanently delete this user account? They will lose all database records and platform access.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteUserId('')}
                className="btn"
                style={{ width: '50%', background: '#eee', color: '#555', padding: '10px', fontSize: '12px', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="btn"
                style={{ width: '50%', background: '#d9534f', color: '#fff', padding: '10px', fontSize: '12px', fontWeight: 'bold' }}
              >
                {deleting ? 'Removing...' : 'Delete Account'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
