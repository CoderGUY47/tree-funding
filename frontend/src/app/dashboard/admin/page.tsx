'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Users2, UserCheck, ShieldAlert, BadgeDollarSign, Landmark, Coins } from 'lucide-react';

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h2 id="admin-dashboard-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Admin Console</h2>
        <p className="text-xs text-zinc-550 mt-1">Review system growth, available credits volume, and transaction processing.</p>
      </div>

      {/* Admin Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Supporters */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-900 text-emerald-400">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.supporters}</p>
              <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Total Supporters</p>
            </div>
          </div>

          {/* Creators */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-950 border border-teal-900 text-teal-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.creators}</p>
              <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Total Creators</p>
            </div>
          </div>

          {/* Credits Volume */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-950/40 border border-amber-900/30 text-amber-400">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalCredits} cr</p>
              <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Available Credits</p>
            </div>
          </div>

          {/* Total Payments Processed */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-900 text-emerald-400">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${stats.totalPaymentsProcessed.toFixed(2)}</p>
              <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Stripe Volume</p>
            </div>
          </div>
        </div>
      )}

      {/* Security alert for admins */}
      <div className="rounded-2xl border border-amber-900/30 bg-amber-950/10 p-6 flex gap-4 max-w-2xl">
        <ShieldAlert className="h-7 w-7 text-amber-500 shrink-0" />
        <div className="text-xs leading-relaxed text-zinc-450">
          <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-[10px]">Security Clearance Authorization</h4>
          You have access to User Role modification, Campaign Suspensions, Creator Payout confirmations, and Supporter report moderations. Ensure thorough validations before processing transactions.
        </div>
      </div>

    </div>
  );
}
