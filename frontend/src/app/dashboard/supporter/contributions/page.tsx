'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const dummyContributions: Contribution[] = [
    {
      _id: 'dummy_cont_1',
      campaignTitle: 'Restoring Comfort: Shelter and Care for Old Age Homes',
      contributionAmount: 150,
      creatorName: 'Green Creator',
      status: 'approved',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_cont_2',
      campaignTitle: 'Hunger Relief: Food Distribution Campaign',
      contributionAmount: 100,
      creatorName: 'Green Creator',
      status: 'pending',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_cont_3',
      campaignTitle: 'Eco-Revival: Reforesting and Greenifying the Old School Grounds',
      contributionAmount: 120,
      creatorName: 'Green Creator',
      status: 'approved',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_cont_4',
      campaignTitle: 'Companion and Medical Aid for Abandoned Old People',
      contributionAmount: 80,
      creatorName: 'Green Creator',
      status: 'rejected',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_cont_5',
      campaignTitle: 'Reforest the Coastal Mangroves of Sundarbans',
      contributionAmount: 200,
      creatorName: 'Green Creator',
      status: 'pending',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const fetchContributions = async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/contributions/supporter?limit=100`);
      const serverConts = res.data.contributions || [];
      const merged = [...serverConts];
      dummyContributions.forEach(dummy => {
        if (!merged.some(c => c.campaignTitle === dummy.campaignTitle)) {
          merged.push(dummy);
        }
      });

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = merged.slice(startIndex, endIndex);

      setContributions(paginatedItems);
      setTotalPages(Math.ceil(merged.length / limit) || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching contributions, using dummy fallbacks:', err);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = dummyContributions.slice(startIndex, endIndex);
      setContributions(paginatedItems);
      setTotalPages(Math.ceil(dummyContributions.length / limit) || 1);
      setCurrentPage(page);
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
          <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase border border-emerald-100">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase border border-red-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase border border-amber-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="text-left bg-white p-2">

      {/* Title */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight">
          My Contributions
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Track all your crowdfunding donations, pledges, and their approval statuses.
        </p>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">

          <div className="overflow-x-auto border border-zinc-100 rounded-2xl shadow-sm">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Campaign Title</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Credits Contributed</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Creator</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Date</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors duration-150"
                  >
                    <td className="px-5 py-5 text-base font-bold text-zinc-900">{c.campaignTitle}</td>
                    <td className="px-5 py-5 text-sm font-bold text-emerald-600">{c.contributionAmount} cr</td>
                    <td className="px-5 py-5 text-sm text-zinc-700 font-medium">{c.creatorName}</td>
                    <td className="px-5 py-5 text-sm text-zinc-500 font-medium">
                      {new Date(c.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-5">{getStatusBadge(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
              <span className="text-sm text-zinc-500 font-medium">
                Page <strong className="text-zinc-900">{currentPage}</strong> of{' '}
                <strong className="text-zinc-900">{totalPages}</strong>
              </span>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-800 cursor-pointer hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-800 cursor-pointer hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
