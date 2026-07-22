'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { 
  FaCheckSquare, 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaExclamationCircle, 
  FaCheckCircle 
} from 'react-icons/fa';
import Link from 'next/link';

interface Campaign {
  _id: string;
  title: string;
  creatorName: string;
  creatorEmail: string;
  fundingGoal: number;
  minimumContribution: number;
  category: string;
  imageUrl: string;
}

export default function CampaignApprovals() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPendingCampaigns = async () => {
    try {
      const res = await api.get('/campaigns?status=pending');
      setCampaigns(res.data.campaigns);
    } catch (err) {
      console.error('Error fetching pending campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/campaigns/${id}/approve`);
      setSuccess('Campaign approved successfully! It is now live to supporters.');
      setCampaigns(prev => prev.filter(c => c._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error approving campaign.');
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/campaigns/${id}/reject`);
      setSuccess('Campaign rejected and creator notified.');
      setCampaigns(prev => prev.filter(c => c._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error rejecting campaign.');
    } finally {
      setProcessingId('');
    }
  };

  return (
    <div className="text-left bg-white p-2 font-sans">
      
      {/* Title Header */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight font-heading flex items-center gap-2.5">
          <FaCheckSquare className="text-primary" /> Campaign Approvals
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Review new campaign submissions and decide to Approve or Reject them.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaCheckCircle className="text-base shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
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
          <h4 className="text-base font-bold text-zinc-900 m-0 mb-1 font-heading">No Pending Campaigns</h4>
          <p className="text-sm text-zinc-500 m-0 font-medium">
            When creators launch new campaigns, they will be listed here for approval.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Campaign Details</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Creator</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Target (Credits)</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-center tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors last:border-b-0">
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="w-16 h-12 object-cover rounded-xl border border-zinc-200 shrink-0"
                      />
                      <div className="min-w-0 max-w-[240px]">
                        <p className="m-0 font-bold text-zinc-900 truncate" title={c.title}>{c.title}</p>
                        <span className="inline-block bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider mt-1.5">
                          {c.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-zinc-800">
                    <p className="m-0 leading-tight">{c.creatorName}</p>
                    <p className="m-0 text-[10px] text-zinc-400 font-semibold mt-1">{c.creatorEmail}</p>
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-zinc-900 font-numbers">{c.fundingGoal} cr</td>
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
                        onClick={() => handleApprove(c._id)}
                        disabled={processingId !== ''}
                        className="h-9 px-4.5 rounded-xl bg-emerald-650 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-none cursor-pointer disabled:opacity-50"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(c._id)}
                        disabled={processingId !== ''}
                        className="h-9 px-4.5 rounded-xl bg-red-500 hover:bg-red-650 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-none cursor-pointer disabled:opacity-50"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
