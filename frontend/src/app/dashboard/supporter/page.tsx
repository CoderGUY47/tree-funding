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

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await api.get('/contributions/supporter?limit=100');
        const list = res.data.contributions;
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

      } catch (err) {
        console.error('Error fetching contributions:', err);
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
        <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>Supporter Dashboard</h2>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
          Monitor your contributions, purchase credits, and support sustainability campaigns.
        </p>
      </div>

      {/* Stats row */}
      <div className="row" style={{ marginBottom: '40px' }}>
        {/* Total Contributions */}
        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#fdfdfd', border: '1px solid #eee', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#7cb032', color: '#fff', borderRadius: '4px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <FaHeart />
            </div>
            <div>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', margin: 0 }}>{stats.totalContributionsCount}</p>
              <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Total Contributions</p>
            </div>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#fdfdfd', border: '1px solid #eee', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#f0ad4e', color: '#fff', borderRadius: '4px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <FaHourglassHalf />
            </div>
            <div>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', margin: 0 }}>{stats.totalPendingCount}</p>
              <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Pending Approval</p>
            </div>
          </div>
        </div>

        {/* Total Credits */}
        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#fdfdfd', border: '1px solid #eee', padding: '20px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#7cb032', color: '#fff', borderRadius: '4px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <FaCheckCircle />
            </div>
            <div>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#333', margin: 0 }}>{stats.totalContributedAmount} cr</p>
              <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Approved Pledges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {approvedContributions.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '4px', padding: '20px', marginBottom: '30px', marginTop: '10px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaCoins style={{ color: '#7cb032' }} /> Contribution Distribution (Credits)
          </h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={approvedContributions.map(c => ({
                name: c.campaignTitle.length > 15 ? c.campaignTitle.substring(0, 15) + '...' : c.campaignTitle,
                Amount: c.contributionAmount
              }))} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" stroke="#888" fontSize={9} tickLine={false} />
                <YAxis stroke="#888" fontSize={9} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: '4px', fontSize: '11px' }}
                  cursor={{ fill: '#fbfbfb' }}
                />
                <Bar dataKey="Amount" fill="#7cb032" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Approved List */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaLeaf style={{ color: '#7cb032' }} /> Approved Contributions
        </h3>

        {approvedContributions.length === 0 ? (
          <div style={{ padding: '30px', border: '1px dashed #ddd', background: '#fafafa', borderRadius: '4px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
            No approved contributions yet. Support some campaigns in the Explore page.
          </div>
        ) : (
          <div className="table-responsive" style={{ border: '1px solid #eee', borderRadius: '4px' }}>
            <table className="table table-striped" style={{ margin: 0, fontSize: '12px', color: '#555' }}>
              <thead>
                <tr style={{ background: '#fcfcfc', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaHeart style={{ color: '#7cb032' }} /> Campaign Title
                  </th>
                  <th style={{ padding: '12px 15px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaCoins style={{ color: '#7cb032' }} /> Credits Contributed</span>
                  </th>
                  <th style={{ padding: '12px 15px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaUser style={{ color: '#7cb032' }} /> Creator</span>
                  </th>
                  <th style={{ padding: '12px 15px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle style={{ color: '#7cb032' }} /> Status</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedContributions.map((c) => (
                  <tr key={c._id}>
                    <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#333' }}>{c.campaignTitle}</td>
                    <td style={{ padding: '12px 15px', color: '#7cb032', fontWeight: 'bold' }}>+{c.contributionAmount} cr</td>
                    <td style={{ padding: '12px 15px' }}>{c.creatorName}</td>
                    <td style={{ padding: '12px 15px' }}>
                      <span className="label label-success" style={{ background: '#7cb032', textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold' }}>
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
