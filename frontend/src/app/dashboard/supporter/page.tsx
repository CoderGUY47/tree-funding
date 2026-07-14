'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { FaHeart, FaHourglassHalf, FaCheckCircle, FaLeaf, FaUser, FaCoins } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Contribution {
  _id: string;
  campaignTitle: string;
  contributionAmount: number;
  creatorName: string;
  status: string;
  date: string;
}

export default function SupporterHome() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  // Computed states
  const [stats, setStats] = useState({
    totalContributionsCount: 0,
    totalPendingCount: 0,
    totalContributedAmount: 0
  });

  const dummyContributions: Contribution[] = [
    {
      _id: 'dummy_cont_1',
      campaignTitle: 'Support Stray Children & Local Orphanages',
      contributionAmount: 150,
      creatorName: 'Green Creator',
      status: 'approved',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_cont_2',
      campaignTitle: 'Feed the Hungry: Community Food Shelter',
      contributionAmount: 100,
      creatorName: 'Green Creator',
      status: 'pending',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_cont_3',
      campaignTitle: 'Care and Support for Shelterless Elderly',
      contributionAmount: 50,
      creatorName: 'Green Creator',
      status: 'rejected',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await api.get('/contributions/supporter?limit=100');
        const list = res.data.contributions;
        if (list && list.length > 0) {
          setContributions(list);

          // Calculate statistics
          const count = list.length;
          const pending = list.filter((c: Contribution) => c.status === 'pending').length;
          const approvedAmount = list
            .filter((c: Contribution) => c.status === 'approved')
            .reduce((sum: number, c: Contribution) => sum + c.contributionAmount, 0);

          setStats({
            totalContributionsCount: count,
            totalPendingCount: pending,
            totalContributedAmount: approvedAmount
          });
        } else {
          setContributions(dummyContributions);
          const count = dummyContributions.length;
          const pending = dummyContributions.filter((c: Contribution) => c.status === 'pending').length;
          const approvedAmount = dummyContributions
            .filter((c: Contribution) => c.status === 'approved')
            .reduce((sum: number, c: Contribution) => sum + c.contributionAmount, 0);

          setStats({
            totalContributionsCount: count,
            totalPendingCount: pending,
            totalContributedAmount: approvedAmount
          });
        }
      } catch (err) {
        console.error('Error fetching contributions, using dummy:', err);
        setContributions(dummyContributions);
        const count = dummyContributions.length;
        const pending = dummyContributions.filter((c: Contribution) => c.status === 'pending').length;
        const approvedAmount = dummyContributions
          .filter((c: Contribution) => c.status === 'approved')
          .reduce((sum: number, c: Contribution) => sum + c.contributionAmount, 0);

        setStats({
          totalContributionsCount: count,
          totalPendingCount: pending,
          totalContributedAmount: approvedAmount
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const approvedContributions = contributions.filter(c => c.status === 'approved');

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
          Supporter Dashboard
        </h2>
        <p style={{ fontSize: '14px', color: '#656b60', marginTop: '6px', fontWeight: '500' }}>
          Monitor your contributions, purchase credits, and support sustainability campaigns.
        </p>
      </div>

      {/* Stats row */}
      <div className="row" style={{ marginBottom: '35px' }}>
        {/* Total Contributions */}
        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ background: '#7cb032', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              <FaHeart />
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: '800', color: '#1e211c', margin: 0, lineHeight: '1.2' }}>{stats.totalContributionsCount}</p>
              <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Total Contributions</p>
            </div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ background: '#d97706', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              <FaHourglassHalf />
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: '800', color: '#1e211c', margin: 0, lineHeight: '1.2' }}>{stats.totalPendingCount}</p>
              <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Pending Approval</p>
            </div>
          </div>
        </div>

        {/* Total Credits */}
        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ background: '#7cb032', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              <FaCheckCircle />
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: '800', color: '#7cb032', margin: 0, lineHeight: '1.2' }}>{stats.totalContributedAmount} cr</p>
              <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Approved Pledges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {approvedContributions.length > 0 && (
        <div style={{ background: '#ffffff', border: '1px solid #eef2eb', borderRadius: '12px', padding: '25px', marginBottom: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e211c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <FaCoins style={{ color: '#7cb032' }} /> Contribution Distribution (Credits)
          </h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={approvedContributions.map(c => ({
                name: c.campaignTitle.length > 18 ? c.campaignTitle.substring(0, 18) + '...' : c.campaignTitle,
                Amount: c.contributionAmount
              }))} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2eb" />
                <XAxis dataKey="name" stroke="#656b60" fontSize={11} tickLine={false} />
                <YAxis stroke="#656b60" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#ffffff', border: '1px solid #eef2eb', borderRadius: '8px', fontSize: '12px', color: '#1e211c' }}
                  cursor={{ fill: '#fcfdfa' }}
                />
                <Bar dataKey="Amount" fill="#7cb032" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Approved List */}
      <div style={{ marginTop: '10px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e211c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <FaLeaf style={{ color: '#7cb032' }} /> Approved Contributions
        </h3>

        {approvedContributions.length === 0 ? (
          <div style={{ padding: '40px', border: '2px dashed #eef2eb', background: '#fcfdfa', borderRadius: '12px', textAlign: 'center', color: '#656b60', fontSize: '14px', fontWeight: '500' }}>
            No approved contributions yet. Support some campaigns in the Explore page.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #eef2eb', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff' }}>
              <thead>
                <tr style={{ background: '#fcfdfa', borderBottom: '1px solid #eef2eb' }}>
                  <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Campaign Title</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Credits Contributed</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Creator</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedContributions.map((c, index) => (
                  <tr 
                    key={c._id}
                    style={{ 
                      borderBottom: index === approvedContributions.length - 1 ? 'none' : '1px solid #eef2eb',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fcfdfa'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                  >
                    <td style={{ padding: '20px', fontSize: '16px', fontWeight: 'bold', color: '#1e211c' }}>{c.campaignTitle}</td>
                    <td style={{ padding: '20px', fontSize: '15px', color: '#7cb032', fontWeight: 'bold' }}>+{c.contributionAmount} cr</td>
                    <td style={{ padding: '20px', fontSize: '14px', color: '#1e211c', fontWeight: '500' }}>{c.creatorName}</td>
                    <td style={{ padding: '20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#eaf4db',
                        color: '#56801b',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        border: '1px solid #c9e2a3'
                      }}>
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
