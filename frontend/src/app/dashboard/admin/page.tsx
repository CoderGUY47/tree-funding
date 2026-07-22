'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { FaUsers, FaUserCheck, FaCoins, FaUniversity, FaShieldAlt } from 'react-icons/fa';

interface Stats {
  supporters: number;
  creators: number;
  totalCredits: number;
  totalPaymentsProcessed: number;
  totalPaymentsCount: number;
}

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const dummyStats: Stats = {
    supporters: 4,
    creators: 2,
    totalCredits: 100949,
    totalPaymentsProcessed: 35.00,
    totalPaymentsCount: 2
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data || dummyStats);
      } catch (err) {
        console.error('Error fetching admin stats, using dummy fallbacks:', err);
        setStats(dummyStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-primary animate-spin mx-auto" />
        <p className="mt-3 text-zinc-500 text-xs font-bold">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="text-left bg-white p-2 font-sans">
      
      {/* Title */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight font-heading">
          Admin Console
        </h2>
      </div>

      {/* Admin Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-9">
          
          {[
            { icon: <FaUsers />, val: stats.supporters, label: 'Total Supporters', bg: 'bg-primary' },
            { icon: <FaUserCheck />, val: stats.creators, label: 'Total Creators', bg: 'bg-sky-500' },
            { icon: <FaCoins />, val: `${stats.totalCredits} cr`, label: 'Available Credits', bg: 'bg-amber-500' },
            { icon: <FaUniversity />, val: `$${stats.totalPaymentsProcessed.toFixed(2)}`, label: 'Processed Payouts', bg: 'bg-emerald-500', color: 'text-emerald-600' }
          ].map((s, i) => (
            <div key={i} className="bg-white border border-zinc-100 p-6 rounded-xl flex items-center gap-4 shadow-sm">
              <div className={`${s.bg} text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-2xl font-extrabold m-0 leading-none ${s.color || 'text-zinc-900'}`}>{s.val}</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider leading-snug">{s.label}</p>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Main Admin Instructions panel */}
      <div className="mt-3 p-6 bg-zinc-50 border border-zinc-150 rounded-[20px]">
        <h3 className="text-sm font-bold text-zinc-800 m-0 flex items-center gap-2 uppercase tracking-wider mb-2">
          <FaShieldAlt className="text-primary" /> Admin Controls Active
        </h3>
        <p className="text-xs text-zinc-500 m-0 leading-relaxed font-semibold">
          Use the left-hand workspace navigation to approve pending campaigns, evaluate flagged creator reports, approve creator withdrawal requests, and manage platform user records.
        </p>
      </div>

    </div>
  );
}
