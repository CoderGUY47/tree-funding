'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaAward, FaLayerGroup, FaEye, FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
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

export default function CreatorHome() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

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
      const campaignsRes = await api.get('/campaigns?status=all');
      const userCampaigns = campaignsRes.data.campaigns.filter((c: any) => c.creatorEmail === user?.email);

      let currentCampaigns = userCampaigns;
      if (!currentCampaigns || currentCampaigns.length === 0) {
        currentCampaigns = dummyCampaigns;
      }
      setCampaigns(currentCampaigns);

      const totalCount = currentCampaigns.length;
      const activeCount = currentCampaigns.filter((c: Campaign) => new Date(c.deadline) > new Date()).length;
      const sumRaised = currentCampaigns.reduce((sum: number, c: Campaign) => sum + c.amountRaised, 0);

      setStats({ totalCampaigns: totalCount, activeCampaigns: activeCount, totalRaised: sumRaised });

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

  const getPieData = () =>
    campaigns.map(c => ({
      name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
      value: c.amountRaised
    }));

  const COLORS = ['#7cb032', '#0284c7', '#d97706', '#ef4444'];

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
          Creator Dashboard
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Manage campaigns, review backers contributions, and withdraw earnings.
        </p>
      </div>

      {/* Creator Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-9">
        <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
            <FaClipboardList />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-zinc-900 m-0 leading-none">{stats.totalCampaigns}</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Total Campaigns</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-amber-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
            <FaHourglassHalf />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-zinc-900 m-0 leading-none">{stats.activeCampaigns}</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Active Campaigns</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-600 m-0 leading-none">{stats.totalRaised} cr</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Total Raised Credits</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-9">

          {/* Bar Chart */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 h-[380px] shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
                <FaAward className="text-emerald-500" /> Campaign Funding Progress (Credits)
              </h3>
              <div className="w-full h-[280px]">
                <ResponsiveContainer>
                  <BarChart
                    data={campaigns.map(c => ({
                      name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
                      Goal: c.fundingGoal,
                      Raised: c.amountRaised
                    }))}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
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
          <div className="lg:col-span-5">
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 h-[380px] shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
                <FaAward className="text-sky-500" /> Campaigns Funding Share
              </h3>
              <div className="w-full h-[280px] relative">
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
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Pending Contributions to review */}
      <div className="mt-3">
        <h3 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
          <FaLayerGroup className="text-emerald-500" /> Contributions to Review
        </h3>

        {contributions.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-2xl text-center text-zinc-500 text-sm font-medium">
            No pending contributions to review at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions.map((c) => (
              <Card key={c._id} className="border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between rounded-2xl bg-white overflow-hidden">
                <CardHeader className="pb-3 text-left">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-zinc-800 text-sm leading-tight truncate">
                        {c.supporterName}
                      </h4>
                      <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-1 font-semibold truncate">
                        <FaEnvelope className="text-zinc-400 shrink-0" /> {c.supporterEmail}
                      </p>
                    </div>
                    <span className="shrink-0 bg-emerald-50 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-100">
                      {c.contributionAmount} cr
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-2 text-left">
                  <p className="text-[10px] text-zinc-400 uppercase font-black tracking-wide mb-1">Target Campaign</p>
                  <p className="text-xs font-bold text-zinc-700 line-clamp-2 h-8 leading-snug" title={c.campaignTitle}>
                    {c.campaignTitle}
                  </p>
                </CardContent>
                <CardFooter className="pt-3 pb-4 border-t border-zinc-50 flex gap-2 justify-end px-4">
                  <Button
                    onClick={() => setSelectedContribution(c)}
                    variant="outline"
                    className="h-8 text-[10px] font-bold border-zinc-200 hover:bg-zinc-50 px-2.5 cursor-pointer rounded-lg inline-flex items-center gap-1"
                  >
                    <FaEye /> View
                  </Button>
                  <Button
                    onClick={() => handleReject(c._id)}
                    disabled={processingId !== ''}
                    variant="destructive"
                    className="h-8 text-[10px] font-bold bg-red-500 hover:bg-red-600 text-white border-none px-2.5 cursor-pointer rounded-lg inline-flex items-center gap-1"
                  >
                    <FaTimes /> Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(c._id)}
                    disabled={processingId !== ''}
                    className="h-8 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white border-none px-2.5 cursor-pointer rounded-lg inline-flex items-center gap-1"
                  >
                    <FaCheck /> Approve
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Contribution Inspect Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
              <FaAward className="text-emerald-500" /> Contribution Details
            </h3>

            <div className="border-t border-b border-zinc-100 py-4 flex flex-col gap-4 text-left mb-5">
              <div>
                <span className="text-xs text-zinc-500 block mb-1 font-bold uppercase tracking-wide">Campaign Name</span>
                <span className="text-base font-bold text-zinc-900">{selectedContribution.campaignTitle}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-zinc-500 block mb-1 font-bold uppercase tracking-wide">Supporter Name</span>
                  <span className="text-sm font-bold text-zinc-900">{selectedContribution.supporterName}</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500 block mb-1 font-bold uppercase tracking-wide">Supporter Email</span>
                  <span className="text-sm font-bold text-zinc-900">{selectedContribution.supporterEmail}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1 font-bold uppercase tracking-wide">Credits Contributed</span>
                <span className="text-xl font-extrabold text-emerald-600">{selectedContribution.contributionAmount} Credits</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleReject(selectedContribution._id)}
                disabled={processingId !== ''}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-none rounded-xl py-3 text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedContribution._id)}
                disabled={processingId !== ''}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl py-3 text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
              >
                Approve
              </button>
              <button
                onClick={() => setSelectedContribution(null)}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-xl py-3 text-xs font-bold text-zinc-800 cursor-pointer transition-colors"
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
