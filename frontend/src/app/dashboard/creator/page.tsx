'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaAward, FaLayerGroup, FaEye, FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

const dummyCampaigns: Campaign[] = [
  { _id: 'dc1', title: 'Shelter and Care for Old Age Homes', fundingGoal: 15000, amountRaised: 4200, deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'dc2', title: 'Hunger Relief: Food Shelter', fundingGoal: 8000, amountRaised: 6000, deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
  { _id: 'dc3', title: 'Reforest Old School Grounds', fundingGoal: 10000, amountRaised: 2500, deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString() }
];

const dummyContributions: Contribution[] = [
  { _id: 'dcr1', campaignId: 'dc2', campaignTitle: 'Hunger Relief: Food Shelter', contributionAmount: 100, supporterName: 'S.M. Hasan', supporterEmail: 'supporter@treefunding.com', status: 'pending' }
];

export default function CreatorHome() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  const [stats, setStats] = useState({ totalCampaigns: 0, activeCampaigns: 0, totalRaised: 0 });

  const fetchData = async () => {
    try {
      const campaignsRes = await api.get('/campaigns?status=all');
      const userCampaigns = campaignsRes.data.campaigns.filter((c: any) => c.creatorEmail === user?.email);

      const currentCampaigns = userCampaigns.length > 0 ? userCampaigns : dummyCampaigns;
      setCampaigns(currentCampaigns);
      setStats({
        totalCampaigns: currentCampaigns.length,
        activeCampaigns: currentCampaigns.filter((c: Campaign) => new Date(c.deadline) > new Date()).length,
        totalRaised: currentCampaigns.reduce((sum: number, c: Campaign) => sum + c.amountRaised, 0)
      });

      const contributionsRes = await api.get('/contributions/creator?status=pending');
      const serverContributions = contributionsRes.data.contributions;
      setContributions(serverContributions && serverContributions.length > 0 ? serverContributions : dummyContributions);
    } catch (err) {
      console.error(err);
      setCampaigns(dummyCampaigns);
      setStats({
        totalCampaigns: dummyCampaigns.length,
        activeCampaigns: dummyCampaigns.filter((c: Campaign) => new Date(c.deadline) > new Date()).length,
        totalRaised: dummyCampaigns.reduce((sum: number, c: Campaign) => sum + c.amountRaised, 0)
      });
      setContributions(dummyContributions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleApprove = async (id: string) => {
    if (id.startsWith('dcr') || id.startsWith('dummy')) {
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
      console.error(err);
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async (id: string) => {
    if (id.startsWith('dcr') || id.startsWith('dummy')) {
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
      console.error(err);
    } finally {
      setProcessingId('');
    }
  };

  if (loading) return (
    <div className="text-center py-16">
      <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-primary animate-spin mx-auto" />
    </div>
  );

  return (
    <div className="text-left bg-white p-2 font-sans">
      
      {/* Title */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight font-heading">
          Creator Dashboard
        </h2>
      </div>

      {/* Creator Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-9">
        {[
          { icon: <FaClipboardList />, val: stats.totalCampaigns, label: 'Total Campaigns', bg: 'bg-primary' },
          { icon: <FaHourglassHalf />, val: stats.activeCampaigns, label: 'Active Campaigns', bg: 'bg-amber-500' },
          { icon: <FaCheckCircle />, val: `${stats.totalRaised} cr`, label: 'Total Raised', bg: 'bg-emerald-500', color: 'text-emerald-600' }
        ].map((s, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-6 rounded-xl flex items-center gap-4 shadow-sm">
            <div className={`${s.bg} text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0`}>{s.icon}</div>
            <div>
              <p className={`text-3xl font-extrabold m-0 leading-none ${s.color || 'text-zinc-900'}`}>{s.val}</p>
              <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-9">
          <div className="lg:col-span-7 bg-white border border-zinc-100 rounded-xl p-6 h-[380px] shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-5 flex items-center gap-2 uppercase tracking-wider"><FaAward className="text-primary" /> Campaigns Funding</h3>
            <div className="w-full h-[280px]">
              <ResponsiveContainer>
                <BarChart data={campaigns.map(c => ({ name: c.title.substring(0, 15) + '...', Goal: c.fundingGoal, Raised: c.amountRaised }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2eb" />
                  <XAxis dataKey="name" stroke="#656b60" fontSize={11} tickLine={false} />
                  <YAxis stroke="#656b60" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Goal" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={25} />
                  <Bar dataKey="Raised" fill="#5B5FEF" radius={[6, 6, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-zinc-100 rounded-xl p-6 h-[380px] shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-5 flex items-center gap-2 uppercase tracking-wider"><FaAward className="text-sky-500" /> Share</h3>
            <div className="w-full h-[280px] relative">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={campaigns.map(c => ({ name: c.title.substring(0, 15), value: c.amountRaised }))} cx="50%" cy="45%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {campaigns.map((_, idx) => <Cell key={idx} fill={['#5B5FEF', '#7C3AED', '#00C2A8'][idx % 3]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Review list */}
      <div className="mt-3">
        <h3 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2 uppercase tracking-wider"><FaLayerGroup className="text-emerald-500" /> Review Contributions</h3>
        {contributions.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-xl text-center text-zinc-500 text-sm font-medium">No pending reviews.</div>
        ) : (
          <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Supporter</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Campaign</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Amount</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr key={c._id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors last:border-b-0">
                    <td className="px-5 py-5 text-sm font-bold text-zinc-900">{c.supporterName}</td>
                    <td className="px-5 py-5 text-sm font-bold text-zinc-700">{c.campaignTitle}</td>
                    <td className="px-5 py-5 text-sm font-bold text-emerald-600">+{c.contributionAmount} cr</td>
                    <td className="px-5 py-5 flex gap-2">
                      <Button onClick={() => setSelectedContribution(c)} size="sm" variant="outline" className="flex items-center gap-1"><FaEye /> View</Button>
                      <Button onClick={() => handleApprove(c._id)} size="sm" className="bg-emerald-650 hover:bg-emerald-600 border-none text-white"><FaCheck /> Approve</Button>
                      <Button onClick={() => handleReject(c._id)} size="sm" className="bg-red-500 hover:bg-red-650 border-none text-white"><FaTimes /> Reject</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contribution Detail Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white rounded-xl shadow-xl animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <h4 className="text-base font-extrabold text-zinc-900 m-0">Contribution Details</h4>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <span className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider block">Campaign Title</span>
                <span className="text-sm font-bold text-zinc-800 block mt-1">{selectedContribution.campaignTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider block">Contributor Name</span>
                  <span className="text-sm font-bold text-zinc-800 block mt-1">{selectedContribution.supporterName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider block">Pledge Amount</span>
                  <span className="text-sm font-extrabold text-emerald-600 block mt-1">+{selectedContribution.contributionAmount} cr</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider block flex items-center gap-1"><FaEnvelope /> Email Address</span>
                <span className="text-sm font-bold text-zinc-800 block mt-1">{selectedContribution.supporterEmail}</span>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100">
                <Button onClick={() => setSelectedContribution(null)} variant="outline">Close</Button>
                <Button onClick={() => handleApprove(selectedContribution._id)} className="bg-emerald-650 hover:bg-emerald-600 text-white">Approve</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
