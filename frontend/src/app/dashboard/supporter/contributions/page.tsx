'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, ArrowRight, ListTodo, AlertCircle } from 'lucide-react';

interface Contribution {
  _id: string;
  campaignTitle: string;
  contributionAmount: number;
  creatorName: string;
  status: string;
  date: string;
}

export default function MyContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5); // Show 5 items per page as designed

  const fetchContributions = async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/contributions/supporter?page=${page}&limit=${limit}`);
      setContributions(res.data.contributions);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
    } catch (err) {
      console.error('Error fetching contributions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(currentPage);
  }, [currentPage]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/65 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-900/30">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-950/65 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-900/30">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-950/65 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-900/30 animate-pulse">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 id="contributions-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Contributions</h2>
        <p className="text-xs text-zinc-500 mt-1">Track all your crowdfunding donations and their approval statuses.</p>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin" />
        </div>
      ) : contributions.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10">
          <AlertCircle className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-zinc-300">No contributions placed yet</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Browse active campaigns in explore page to support environmental projects.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto border border-zinc-900 rounded-xl bg-zinc-900/10">
            <table className="w-full text-sm text-left text-zinc-400">
              <thead className="text-xs uppercase bg-zinc-950/60 text-zinc-400 border-b border-zinc-900">
                <tr>
                  <th scope="col" className="px-6 py-4">Campaign Title</th>
                  <th scope="col" className="px-6 py-4">Credits Contributed</th>
                  <th scope="col" className="px-6 py-4">Creator</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {contributions.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-900/30">
                    <td className="px-6 py-4 font-bold text-white">{c.campaignTitle}</td>
                    <td className="px-6 py-4 text-zinc-200 font-semibold">{c.contributionAmount} cr</td>
                    <td className="px-6 py-4 text-zinc-300">{c.creatorName}</td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {new Date(c.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
              <span className="text-xs text-zinc-500">
                Page <span className="font-semibold text-zinc-300">{currentPage}</span> of{' '}
                <span className="font-semibold text-zinc-300">{totalPages}</span>
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 px-3 py-1.5 text-xs text-white transition disabled:opacity-50 flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 px-3 py-1.5 text-xs text-white transition disabled:opacity-50 flex items-center gap-1"
                >
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
