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
      <div className="text-center" style={{ padding: '60px 0' }}>
        <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
        <p style={{ marginTop: '10px', color: '#656b60', fontSize: '13px', fontWeight: 'bold' }}>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left', background: '#ffffff', padding: '10px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '35px', borderBottom: '1px solid #eef2eb', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e211c', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Admin Console
        </h2>
        <p style={{ fontSize: '14px', color: '#656b60', marginTop: '6px', fontWeight: '500' }}>
          Review system growth, available credits volume, and transaction processing.
        </p>
      </div>

      {/* Admin Stats Grid */}
      {stats && (
        <div className="row" style={{ marginBottom: '35px' }}>
          
          {/* Supporters */}
          <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ background: '#7cb032', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <FaUsers />
              </div>
              <div>
                <p style={{ fontSize: '26px', fontWeight: '800', color: '#1e211c', margin: 0, lineHeight: '1.2' }}>{stats.supporters}</p>
                <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Total Supporters</p>
              </div>
            </div>
          </div>

          {/* Creators */}
          <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ background: '#0284c7', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <FaUserCheck />
              </div>
              <div>
                <p style={{ fontSize: '26px', fontWeight: '800', color: '#1e211c', margin: 0, lineHeight: '1.2' }}>{stats.creators}</p>
                <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Total Creators</p>
              </div>
            </div>
          </div>

          {/* Credits Volume */}
          <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ background: '#eab308', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <FaCoins />
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#1e211c', margin: 0, lineHeight: '1.2' }}>{stats.totalCredits} cr</p>
                <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Available Credits</p>
              </div>
            </div>
          </div>

          {/* Total Payments Processed */}
          <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ background: '#7cb032', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <FaUniversity />
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#1e211c', margin: 0, lineHeight: '1.2' }}>${stats.totalPaymentsProcessed.toFixed(2)}</p>
                <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Stripe Volume</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Security alert for admins */}
      <div style={{ 
        background: '#fef3c7', 
        borderLeft: '4px solid #d97706', 
        padding: '20px', 
        borderRadius: '12px', 
        color: '#92400e', 
        fontSize: '13px', 
        lineHeight: '1.6', 
        maxWidth: '700px',
        display: 'flex',
        gap: '15px',
        alignItems: 'flex-start'
      }}>
        <FaShieldAlt style={{ fontSize: '24px', flexShrink: 0, color: '#d97706', marginTop: '3px' }} />
        <div>
          <strong style={{ fontSize: '14px', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Security Clearance Authorization</strong>
          You have access to User Role modification, Campaign Suspensions, Creator Payout confirmations, and Supporter report moderations. Ensure thorough validations before processing transactions.
        </div>
      </div>

    </div>
  );
}
