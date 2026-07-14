'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaAward, FaLayers, FaEye, FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  const dummyCampaigns: Campaign[] = [
    {
      _id: 'dummy_camp_1',
      title: 'Restoring Comfort: Shelter and Care for Old Age Homes',
      fundingGoal: 15000,
      amountRaised: 4200,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_camp_2',
      title: 'Hunger Relief: Food Distribution Campaign',
      fundingGoal: 8000,
      amountRaised: 6000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_camp_3',
      title: 'Eco-Revival: Reforesting and Greenifying the Old School Grounds',
      fundingGoal: 10000,
      amountRaised: 2500,
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const dummyContributions: Contribution[] = [
    {
      _id: 'dummy_review_1',
      campaignId: 'dummy_camp_2',
      campaignTitle: 'Hunger Relief: Food Distribution Campaign',
      contributionAmount: 100,
      supporterName: 'S.M. Hasan',
      supporterEmail: 'supporter@treefunding.com',
      status: 'pending'
    }
  ];

  const fetchData = async () => {
    try {
      // Fetch all campaigns created by user
      const campaignsRes = await api.get('/campaigns?status=all');
      const userCampaigns = campaignsRes.data.campaigns.filter((c: any) => c.creatorEmail === user?.email);
      
      let currentCampaigns = userCampaigns;
      if (!currentCampaigns || currentCampaigns.length === 0) {
        currentCampaigns = dummyCampaigns;
      }
      setCampaigns(currentCampaigns);

      // Calculate stats
      const totalCount = currentCampaigns.length;
      const activeCount = currentCampaigns.filter((c: Campaign) => new Date(c.deadline) > new Date()).length;
      const sumRaised = currentCampaigns.reduce((sum: number, c: Campaign) => sum + c.amountRaised, 0);
      
      setStats({
        totalCampaigns: totalCount,
        activeCampaigns: activeCount,
        totalRaised: sumRaised
      });

      // Fetch pending contributions for creator's campaigns
      const contributionsRes = await api.get('/contributions/creator?status=pending');
      const serverContributions = contributionsRes.data.contributions;
      if (serverContributions && serverContributions.length > 0) {
        setContributions(serverContributions);
      } else {
        setContributions(dummyContributions);
      }

    } catch (err) {
      console.error('Error fetching creator dashboard data, using fallback dummy:', err);
      setCampaigns(dummyCampaigns);
      setStats({
        totalCampaigns: dummyCampaigns.length,
        activeCampaigns: dummyCampaigns.filter((c: Campaign) => new Date(c.deadline) > new Date()).length,
        totalRaised: dummyCampaigns.reduce((sum: number, c: Campaign) => sum + c.amountRaised, 0);
      });
      setContributions(dummyContributions);
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
    if (id.startsWith('dummy_')) {
      setContributions(prev => prev.filter(c => c._id !== id));
      setSelectedContribution(null);
      setStats(prev => ({ ...prev, totalRaised: prev.totalRaised + 100 }));
      return;
    }

    setProcessingId(id);
    try {
      await api.patch(`/contributions/${id}/approve`);
      setContributions(prev => prev.filter(c => c._id !== id));
      setSelectedContribution(null);
      fetchData();
    } catch (err) {
      console.error('Error approving contribution:', err);
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async (id: string) => {
    if (id.startsWith('dummy_')) {
      setContributions(prev => prev.filter(c => c._id !== id));
      setSelectedContribution(null);
      return;
    }

    setProcessingId(id);
    try {
      await api.patch(`/contributions/${id}/reject`);
      setContributions(prev => prev.filter(c => c._id !== id));
      setSelectedContribution(null);
      fetchData();
    } catch (err) {
      console.error('Error rejecting contribution:', err);
    } finally {
      setProcessingId('');
    }
  };

  const getPieData = () => {
    return campaigns.map(c => ({
      name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
      value: c.amountRaised
    }));
  };

  const COLORS = ['#7cb032', '#0284c7', '#d97706', '#ef4444'];

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
          Creator Dashboard
        </h2>
        <p style={{ fontSize: '14px', color: '#656b60', marginTop: '6px', fontWeight: '500' }}>
          Manage campaigns, review backers contributions, and withdraw earnings.
        </p>
      </div>

      {/* Creator Stats */}
      <div className="row" style={{ marginBottom: '35px' }}>
        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ background: '#7cb032', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              <FaClipboardList />
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: '800', color: '#1e211c', margin: 0, lineHeight: '1.2' }}>{stats.totalCampaigns}</p>
              <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Total Campaigns</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ background: '#d97706', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              <FaHourglassHalf />
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: '800', color: '#1e211c', margin: 0, lineHeight: '1.2' }}>{stats.activeCampaigns}</p>
              <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Active Campaigns</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 col-sm-6" style={{ marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #eef2eb', padding: '25px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ background: '#7cb032', color: '#fff', borderRadius: '8px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              <FaCheckCircle />
            </div>
            <div>
              <p style={{ fontSize: '26px', fontWeight: '800', color: '#7cb032', margin: 0, lineHeight: '1.2' }}>{stats.totalRaised} cr</p>
              <p style={{ fontSize: '11px', color: '#656b60', textTransform: 'uppercase', fontWeight: 'bold', margin: '4px 0 0 0', letterSpacing: '0.5px' }}>Total Raised Credits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {campaigns.length > 0 && (
        <div className="row" style={{ marginBottom: '35px' }}>
          
          {/* Bar Chart */}
          <div className="col-md-7" style={{ marginBottom: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #eef2eb', borderRadius: '12px', padding: '25px', height: '380px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e211c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <FaAward style={{ color: '#7cb032' }} /> Campaign Funding Progress (Credits)
              </h3>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={campaigns.map(c => ({
                    name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
                    Goal: c.fundingGoal,
                    Raised: c.amountRaised
                  }))} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2eb" />
                    <XAxis dataKey="name" stroke="#656b60" fontSize={11} tickLine={false} />
                    <YAxis stroke="#656b60" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#ffffff', border: '1px solid #eef2eb', borderRadius: '8px', fontSize: '12px', color: '#1e211c' }}
                      cursor={{ fill: '#fcfdfa' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="Goal" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={25} />
                    <Bar dataKey="Raised" fill="#7cb032" radius={[6, 6, 0, 0]} barSize={25} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="col-md-5" style={{ marginBottom: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #eef2eb', borderRadius: '12px', padding: '25px', height: '380px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e211c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <FaAward style={{ color: '#0284c7' }} /> Campaigns Funding Share
              </h3>
              <div style={{ width: '100%', height: 280, position: 'relative' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={getPieData()}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getPieData().map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#ffffff', border: '1px solid #eef2eb', borderRadius: '8px', fontSize: '12px', color: '#1e211c' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', bottom: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Pending Contributions to review */}
      <div style={{ marginTop: '10px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e211c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <FaLayers style={{ color: '#7cb032' }} /> Contributions to Review
        </h3>

        {contributions.length === 0 ? (
          <div style={{ padding: '40px', border: '2px dashed #eef2eb', background: '#fcfdfa', borderRadius: '12px', textAlign: 'center', color: '#656b60', fontSize: '14px', fontWeight: '500' }}>
            No pending contributions to review at this moment.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #eef2eb', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff' }}>
              <thead>
                <tr style={{ background: '#fcfdfa', borderBottom: '1px solid #eef2eb' }}>
                  <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Supporter</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Campaign Title</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Amount Pledged</th>
                  <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'center', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c, index) => (
                  <tr 
                    key={c._id}
                    style={{ 
                      borderBottom: index === contributions.length - 1 ? 'none' : '1px solid #eef2eb',
                      transition: 'background 0.2s',
                      verticalAlign: 'middle'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fcfdfa'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                  >
                    <td style={{ padding: '20px' }}>
                      <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e211c', margin: 0 }}>{c.supporterName}</p>
                      <p style={{ fontSize: '12px', color: '#656b60', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}><FaEnvelope /> {c.supporterEmail}</p>
                    </td>
                    <td style={{ padding: '20px', fontSize: '15px', fontWeight: 'bold', color: '#1e211c', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.campaignTitle}>
                      {c.campaignTitle}
                    </td>
                    <td style={{ padding: '20px', fontSize: '15px', fontWeight: 'bold', color: '#7cb032' }}>{c.contributionAmount} cr</td>
                    <td style={{ padding: '20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => setSelectedContribution(c)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            background: '#f5f7f3',
                            border: '1px solid #dcdfd8',
                            color: '#1e211c',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                          title="View Details"
                        >
                          <FaEye /> View
                        </button>
                        <button
                          onClick={() => handleApprove(c._id)}
                          disabled={processingId !== ''}
                          style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            background: '#7cb032',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(c._id)}
                          disabled={processingId !== ''}
                          style={{
                            padding: '6px 12px',
                            fontSize: '13px',
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
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

      {/* Contribution Inspect Modal */}
      {selectedContribution && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '450px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e211c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaAward style={{ color: '#7cb032' }} /> Contribution Details
            </h3>
            
            <div style={{ borderTop: '1px solid #eef2eb', borderBottom: '1px solid #eef2eb', padding: '15px 0', display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#656b60', display: 'block', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>Campaign Name</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e211c' }}>{selectedContribution.campaignTitle}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#656b60', display: 'block', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>Supporter Name</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e211c' }}>{selectedContribution.supporterName}</span>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#656b60', display: 'block', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>Supporter Email</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e211c' }}>{selectedContribution.supporterEmail}</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#656b60', display: 'block', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>Credits Contributed</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#7cb032' }}>{selectedContribution.contributionAmount} Credits</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleReject(selectedContribution._id)}
                disabled={processingId !== ''}
                style={{ width: '33%', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 0', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedContribution._id)}
                disabled={processingId !== ''}
                style={{ width: '33%', background: '#7cb032', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 0', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Approve
              </button>
              <button
                onClick={() => setSelectedContribution(null)}
                style={{ width: '34%', background: '#f5f7f3', border: '1px solid #dcdfd8', borderRadius: '8px', padding: '10px 0', fontSize: '12px', fontWeight: 'bold', color: '#1e211c', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
