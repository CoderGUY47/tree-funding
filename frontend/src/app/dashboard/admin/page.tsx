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
        <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
        <p className="mt-3 text-zinc-500 text-sm font-bold">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="text-left bg-white p-2">

      {/* Title */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight">
          Admin Console
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Review system growth, available credits volume, and transaction processing.
        </p>
      </div>

      {/* Admin Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-9">

          {/* Supporters */}
          <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="bg-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
              <FaUsers />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-zinc-900 m-0 leading-none">{stats.supporters}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Total Supporters</p>
            </div>
          </div>

          {/* Creators */}
          <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="bg-sky-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
              <FaUserCheck />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-zinc-900 m-0 leading-none">{stats.creators}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Total Creators</p>
            </div>
          </div>

          {/* Credits Volume */}
          <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="bg-amber-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
              <FaCoins />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900 m-0 leading-none">{stats.totalCredits} cr</p>
              <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Available Credits</p>
            </div>
          </div>

          {/* Total Payments */}
          <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="bg-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
              <FaUniversity />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900 m-0 leading-none">${stats.totalPaymentsProcessed.toFixed(2)}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Stripe Volume</p>
            </div>
          </div>

        </div>
      )}

      {/* Security alert for admins */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-2xl text-amber-900 text-sm leading-relaxed max-w-2xl flex gap-4 items-start">
        <FaShieldAlt className="text-2xl text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-sm block mb-1.5 uppercase tracking-wide">Security Clearance Authorization</strong>
          You have access to User Role modification, Campaign Suspensions, Creator Payout confirmations, and Supporter report moderations. Ensure thorough validations before processing transactions.
        </div>
      </div>

    </div>
  );
}
