'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { 
  FaFileAlt, 
  FaTrashAlt, 
  FaExclamationCircle, 
  FaEye, 
  FaCheckCircle, 
  FaUndoAlt 
} from 'react-icons/fa';
import Link from 'next/link';

interface Campaign {
  _id: string;
  title: string;
  creatorName: string;
  creatorEmail: string;
  fundingGoal: number;
  amountRaised: number;
  category: string;
  status: string;
}

export default function ManageCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete campaign confirmation
  const [deleteId, setDeleteId] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns?status=all');
      setCampaigns(res.data.campaigns);
    } catch (err) {
      console.error('Error fetching campaigns directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/campaigns/${deleteId}`);
      setSuccess('Campaign successfully deleted and backers refunded.');
      setCampaigns(prev => prev.filter(c => c._id !== deleteId));
      setDeleteId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting campaign.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-100">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center bg-amber-50 text-amber-750 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-amber-100">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="text-left bg-white p-2 font-sans">
      
      {/* Title Header */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight font-heading flex items-center gap-2.5">
          <FaFileAlt className="text-primary" /> Manage Campaigns
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Monitor all campaigns created on the platform. Deleting a campaign initiates automatic backer refunds.
        </p>
      </div>

      {success && !deleteId && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaCheckCircle className="text-base shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && !deleteId && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaExclamationCircle className="text-base shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-zinc-200 rounded-[24px] text-center bg-zinc-50">
          <FaExclamationCircle className="text-4xl text-zinc-400 mx-auto mb-4" />
          <h4 className="text-base font-bold text-zinc-900 m-0 font-heading">No Campaigns Found</h4>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Campaign Name</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Creator</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Goal / Raised</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Status</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-center tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors last:border-b-0">
                  <td className="px-5 py-5 text-sm font-bold text-zinc-900 max-w-[200px] truncate" title={c.title}>
                    {c.title}
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-zinc-800">
                    <p className="m-0 leading-tight">{c.creatorName}</p>
                    <p className="m-0 text-[10px] text-zinc-400 font-semibold mt-1">{c.creatorEmail}</p>
                  </td>
                  <td className="px-5 py-5 text-xs text-zinc-500">
                    Goal: <strong className="text-zinc-800">{c.fundingGoal} cr</strong> / Raised: <strong className="text-primary font-bold">{c.amountRaised} cr</strong>
                  </td>
                  <td className="px-5 py-5">{getStatusLabel(c.status)}</td>
                  <td className="px-5 py-5 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link
                        href={`/campaign/${c._id}`}
                        className="h-9 px-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-650 flex items-center justify-center transition-colors no-underline text-sm"
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => setDeleteId(c._id)}
                        className="h-9 w-9 rounded-xl bg-red-50 text-red-650 hover:bg-red-500 hover:text-white border border-red-100 flex items-center justify-center transition-all cursor-pointer"
                        title="Delete & Refund"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Campaign Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] w-full max-w-sm p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="text-red-500 text-4xl mb-4.5 flex justify-center">
              <FaUndoAlt />
            </div>

            <h4 className="m-0 mb-2 font-bold text-zinc-900 text-base font-heading">
              Remove Campaign
            </h4>

            <p className="text-xs text-zinc-500 leading-relaxed m-0 mb-6 font-semibold">
              Are you sure you want to delete this campaign? This action is irreversible. All approved supporter contributions will be refunded to their credit accounts.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId('')}
                className="w-1/2 bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-650 py-3 rounded-xl border-none cursor-pointer transition-colors"
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="w-1/2 bg-red-500 hover:bg-red-650 text-xs font-bold text-white py-3 rounded-xl border-none cursor-pointer transition-colors"
              >
                {deleting ? 'Refunding...' : 'Yes, Delete & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
