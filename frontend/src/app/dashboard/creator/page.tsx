'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { Layers, Hourglass, CheckCircle2, Eye, Award, Check, X, ClipboardList, Mail } from 'lucide-react';

interface Campaign {
  _id: string;
  title: string;
  fundingGoal: number;
  amountRaised: number;
  deadline: string;
}

interface Contribution {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  contributionAmount: number;
  supporterName: string;
  supporterEmail: string;
  status: string;
}

export default function CreatorHome() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  
  // Modal inspect state
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  // States count
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0
  });

  const fetchData = async () => {
    try {
      // Fetch all campaigns created by user
      const campaignsRes = await api.get('/campaigns?status=all'); // Admin and Creators get their list. Actually creator can query all campaigns, then we filter on client, or we can use our endpoints. Our backend getCampaigns fetches all. Let's see: `campaigns` is filtered in backend. Let's filter on client side for their own creatorEmail.
      const userCampaigns = campaignsRes.data.campaigns.filter((c: any) => c.creatorEmail === user?.email);
      setCampaigns(userCampaigns);

      // Calculate stats
      const totalCount = userCampaigns.length;
      const activeCount = userCampaigns.filter((c: Campaign) => new Date(c.deadline) > new Date()).length;
      const sumRaised = userCampaigns.reduce((sum: number, c: Campaign) => sum + c.amountRaised, 0);
      
      setStats({
        totalCampaigns: totalCount,
        activeCampaigns: activeCount,
        totalRaised: sumRaised
      });

      // Fetch pending contributions for creator's campaigns
      const contributionsRes = await api.get('/contributions/creator?status=pending');
      setContributions(contributionsRes.data.contributions);

    } catch (err) {
      console.error('Error fetching creator dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/contributions/${id}/approve`);
      // Update UI list
      setContributions(prev => prev.filter(c => c._id !== id));
      setSelectedContribution(null);
      // Re-fetch campaigns to update total raised stats
      fetchData();
    } catch (err) {
      console.error('Error approving contribution:', err);
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/contributions/${id}/reject`);
      // Update UI list
      setContributions(prev => prev.filter(c => c._id !== id));
      setSelectedContribution(null);
      fetchData();
    } catch (err) {
      console.error('Error rejecting contribution:', err);
    } finally {
      setProcessingId('');
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 id="creator-dashboard-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Creator Dashboard</h2>
        <p className="text-xs text-zinc-550 mt-1">Manage campaigns, review backers contributions, and withdraw earnings.</p>
      </div>

      {/* Creator Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-900 text-emerald-400">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalCampaigns}</p>
            <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Total Campaigns</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-950 border border-teal-900 text-teal-400">
            <Hourglass className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.activeCampaigns}</p>
            <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Active Campaigns</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-900 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalRaised} cr</p>
            <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Total Raised Credits</p>
          </div>
        </div>
      </div>

      {/* Pending Contributions to review */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
          <Layers className="h-4.5 w-4.5 text-emerald-500" /> Contributions to Review
        </h3>

        {contributions.length === 0 ? (
          <div className="p-8 border border-dashed border-zinc-850 rounded-xl text-center text-zinc-500 text-xs">
            No pending contributions to review at this moment.
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-900 rounded-xl bg-zinc-900/10">
            <table className="w-full text-sm text-left text-zinc-400">
              <thead className="text-xs uppercase bg-zinc-950/60 text-zinc-400 border-b border-zinc-900">
                <tr>
                  <th scope="col" className="px-6 py-4">Supporter</th>
                  <th scope="col" className="px-6 py-4">Campaign Title</th>
                  <th scope="col" className="px-6 py-4">Amount Pledged</th>
                  <th scope="col" className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {contributions.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-900/30">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-xs">{c.supporterName}</p>
                      <p className="text-[10px] text-zinc-550 flex items-center gap-0.5"><Mail className="h-2.5 w-2.5" /> {c.supporterEmail}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-300 max-w-[200px] truncate" title={c.campaignTitle}>
                      {c.campaignTitle}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">{c.contributionAmount} cr</td>
                    <td className="px-6 py-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedContribution(c)}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 p-2 text-zinc-400 hover:text-white transition"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleApprove(c._id)}
                        disabled={processingId !== ''}
                        className="rounded-lg bg-emerald-950 border border-emerald-900 hover:bg-emerald-900 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:text-white transition flex items-center gap-1 disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(c._id)}
                        disabled={processingId !== ''}
                        className="rounded-lg bg-red-950/20 border border-red-900/40 hover:bg-red-650 px-3 py-1.5 text-xs font-bold text-red-400 hover:text-white transition flex items-center gap-1 disabled:opacity-50"
                      >
                        <X className="h-3 w-3" /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contribution Inspect Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-850 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <Award className="h-5 w-5 text-emerald-500" /> Contribution Details
            </h3>
            
            <div className="space-y-3 text-xs leading-relaxed border-y border-zinc-800 py-4">
              <p className="text-zinc-400">
                <span className="font-bold text-zinc-550 block mb-0.5">Campaign Name</span>
                <span className="text-white text-sm font-semibold">{selectedContribution.campaignTitle}</span>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-zinc-400">
                  <span className="font-bold text-zinc-550 block mb-0.5">Supporter Name</span>
                  <span className="text-white font-medium">{selectedContribution.supporterName}</span>
                </p>
                <p className="text-zinc-400">
                  <span className="font-bold text-zinc-550 block mb-0.5">Supporter Email</span>
                  <span className="text-white font-medium">{selectedContribution.supporterEmail}</span>
                </p>
              </div>
              <p className="text-zinc-400">
                <span className="font-bold text-zinc-550 block mb-0.5">Credits Contributed</span>
                <span className="text-emerald-400 font-extrabold text-sm">{selectedContribution.contributionAmount} Credits</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selectedContribution._id)}
                disabled={processingId !== ''}
                className="w-1/3 py-2.5 rounded-lg border border-red-900/60 bg-red-950/10 hover:bg-red-650 text-xs font-semibold text-red-400 hover:text-white transition disabled:opacity-50"
              >
                Reject Contribution
              </button>
              <button
                onClick={() => handleApprove(selectedContribution._id)}
                disabled={processingId !== ''}
                className="w-1/3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition disabled:opacity-50"
              >
                Approve Pledge
              </button>
              <button
                onClick={() => setSelectedContribution(null)}
                className="w-1/3 py-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
