'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { FaUsers, FaTrashAlt, FaExclamationTriangle, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

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
    <div className="text-left bg-white p-2 font-sans">
      
      {/* Title Header */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight font-heading flex items-center gap-2.5">
          <FaUsers className="text-primary" /> Manage Users
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Review user accounts, update security clearances, or delete profiles from the server.
        </p>
      </div>

      {success && !deleteUserId && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaCheckCircle className="text-base shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && !deleteUserId && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaExclamationCircle className="text-base shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">User</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Email</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Credits</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Modify Role</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-center tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors last:border-b-0">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      {u.photoUrl && 
                       u.photoUrl !== 'null' && 
                       u.photoUrl !== 'undefined' && 
                       u.photoUrl.trim() !== '' && 
                       (u.photoUrl.startsWith('http') || u.photoUrl.startsWith('/')) ? (
                        <img
                          src={u.photoUrl}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-zinc-200 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-bold text-zinc-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm text-zinc-750 font-medium">{u.email}</td>
                  <td className="px-5 py-5 text-sm font-bold text-zinc-850 font-numbers">{u.credits} cr</td>
                  <td className="px-5 py-5">
                    <select
                      value={u.role}
                      disabled={updatingId === u._id || u.email === currentUser?.email}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs bg-white text-zinc-800 outline-none focus:border-primary font-bold cursor-pointer"
                    >
                      <option value="Supporter">Supporter</option>
                      <option value="Creator">Creator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-5 text-center">
                    <button
                      onClick={() => setDeleteUserId(u._id)}
                      disabled={u.email === currentUser?.email}
                      className="w-8 h-8 rounded-xl bg-red-50 text-red-650 hover:bg-red-500 hover:text-white border border-red-100 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 mx-auto"
                      title="Remove User"
                    >
                      <FaTrashAlt className="text-sm" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="text-red-500 text-4xl mb-4.5 flex justify-center">
              <FaExclamationTriangle />
            </div>

            <h4 className="m-0 mb-2 font-bold text-zinc-900 text-base font-heading">
              Remove User Profile
            </h4>

            <p className="text-xs text-zinc-500 leading-relaxed m-0 mb-6 font-semibold">
              Are you sure you want to permanently delete this user account? They will lose all database records and platform access.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteUserId('')}
                className="w-1/2 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-650 py-3 rounded-xl border-none cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="w-1/2 bg-red-500 hover:bg-red-650 text-xs font-bold text-white py-3 rounded-xl border-none cursor-pointer transition-colors"
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
