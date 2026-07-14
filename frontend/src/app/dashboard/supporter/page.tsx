'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { FaHeart, FaHourglassHalf, FaCheckCircle, FaLeaf, FaCoins } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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

  const [stats, setStats] = useState({
    totalContributionsCount: 0,
    totalPendingCount: 0,
    totalContributedAmount: 0
  });

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

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await api.get('/contributions/supporter?limit=100');
        const list = res.data.contributions || [];
        const merged = [...list];
        dummyContributions.forEach(dummy => {
          if (!merged.some(c => c.campaignTitle === dummy.campaignTitle)) {
            merged.push(dummy);
          }
        });
        setContributions(merged);

        const count = merged.length;
        const pending = merged.filter((c: Contribution) => c.status === 'pending').length;
        const approvedAmount = merged
          .filter((c: Contribution) => c.status === 'approved')
          .reduce((sum: number, c: Contribution) => sum + c.contributionAmount, 0);

        setStats({ totalContributionsCount: count, totalPendingCount: pending, totalContributedAmount: approvedAmount });
      } catch (err) {
        console.error('Error fetching contributions, using dummy:', err);
        setContributions(dummyContributions);
        const count = dummyContributions.length;
        const pending = dummyContributions.filter((c: Contribution) => c.status === 'pending').length;
        const approvedAmount = dummyContributions
          .filter((c: Contribution) => c.status === 'approved')
          .reduce((sum: number, c: Contribution) => sum + c.contributionAmount, 0);

        setStats({ totalContributionsCount: count, totalPendingCount: pending, totalContributedAmount: approvedAmount });
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const approvedContributions = contributions.filter(c => c.status === 'approved');

  const approvedContributionsForCharts = approvedContributions.length > 0
    ? approvedContributions
    : dummyContributions.filter(c => c.status === 'approved');

  const getPieData = () => {
    const grouped = approvedContributionsForCharts.reduce((acc: any[], curr) => {
      const titleLower = curr.campaignTitle.toLowerCase();
      const category = titleLower.includes('old age') || titleLower.includes('elderly') || titleLower.includes('people') ? 'Humanitarian' :
                       titleLower.includes('food') || titleLower.includes('hunger') ? 'Social Care' : 'Reforestation';
      const existing = acc.find(item => item.name === category);
      if (existing) {
        existing.value += curr.contributionAmount;
      } else {
        acc.push({ name: category, value: curr.contributionAmount });
      }
      return acc;
    }, []);
    return grouped;
  };

  const COLORS = ['#7cb032', '#0284c7', '#d97706', '#ef4444'];

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
        <p className="mt-3 text-zinc-500 text-xs font-bold">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="text-left bg-white p-2">

      {/* Title */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight">
          Supporter Dashboard
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Monitor your contributions, purchase credits, and support sustainability campaigns.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-9">
        {/* Total Contributions */}
        <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
            <FaHeart />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-zinc-900 m-0 leading-none">{stats.totalContributionsCount}</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Total Contributions</p>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-amber-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
            <FaHourglassHalf />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-zinc-900 m-0 leading-none">{stats.totalPendingCount}</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Pending Approval</p>
          </div>
        </div>

        {/* Total Credits */}
        <div className="bg-white border border-zinc-100 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shrink-0">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-600 m-0 leading-none">{stats.totalContributedAmount} cr</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold m-0 mt-1.5 tracking-wider">Approved Pledges</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-9">

        {/* Bar Chart */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 h-[380px] shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
              <FaCoins className="text-emerald-500" /> Contribution Distribution (Credits)
            </h3>
            <div className="w-full h-[280px]">
              <ResponsiveContainer>
                <BarChart
                  data={approvedContributionsForCharts.map(c => ({
                    name: c.campaignTitle.length > 18 ? c.campaignTitle.substring(0, 18) + '...' : c.campaignTitle,
                    Amount: c.contributionAmount
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
                  <Bar dataKey="Amount" fill="#7cb032" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-zinc-100 rounded-2xl p-6 h-[380px] shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
              <FaCoins className="text-sky-500" /> Contributions by Category
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
                  <Legend wrapperStyle={{ fontSize: '11px', bottom: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Approved List */}
      <div className="mt-3">
        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-zinc-900 uppercase tracking-wider">
          <FaLeaf className="text-emerald-500" /> Approved Contributions
        </h3>

        {approvedContributions.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-2xl text-center text-zinc-500 text-sm font-medium">
            No approved contributions yet. Support some campaigns in the Explore page.
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-100 rounded-2xl shadow-sm">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Campaign Title</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Credits Contributed</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Creator</th>
                  <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedContributions.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors duration-150 last:border-b-0"
                  >
                    <td className="px-5 py-5 text-base font-bold text-zinc-900">{c.campaignTitle}</td>
                    <td className="px-5 py-5 text-sm font-bold text-emerald-600">+{c.contributionAmount} cr</td>
                    <td className="px-5 py-5 text-sm text-zinc-700 font-medium">{c.creatorName}</td>
                    <td className="px-5 py-5">
                      <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-emerald-100">
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
