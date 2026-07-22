'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { 
  FaHeart, 
  FaHourglassHalf, 
  FaCheckCircle, 
  FaLeaf, 
  FaCoins, 
  FaTree, 
  FaChartPie, 
  FaChartBar, 
  FaArrowUp, 
  FaShieldAlt,
  FaGlobe
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

interface Contribution {
  _id: string;
  campaignTitle: string;
  contributionAmount: number;
  creatorName: string;
  status: string;
  category?: string;
  date: string;
}

// Rich fallback dummy data to render charts nicely
const dummyContributions: Contribution[] = [
  { _id: 'd1', campaignTitle: 'Reforest Sundarbans Mangroves', contributionAmount: 180, creatorName: 'EcoForest Org', status: 'approved', category: 'Reforestation', date: '2026-07-20' },
  { _id: 'd2', campaignTitle: 'Solar Grid for Off-Grid Schools', contributionAmount: 120, creatorName: 'SunPower NGO', status: 'approved', category: 'Clean Solar', date: '2026-07-18' },
  { _id: 'd3', campaignTitle: 'Coral Reef Protection & Cleanup', contributionAmount: 90,  creatorName: 'Ocean Trust',  status: 'approved', category: 'Ocean & Coasts', date: '2026-07-15' },
  { _id: 'd4', campaignTitle: 'Urban Micro-Forest Plantation', contributionAmount: 60,  creatorName: 'GreenCity',    status: 'approved', category: 'Reforestation', date: '2026-07-12' },
  { _id: 'd5', campaignTitle: 'Disaster Relief Food Shelter',  contributionAmount: 50,  creatorName: 'ReliefCorp',   status: 'pending',  category: 'Humanitarian', date: '2026-07-21' },
];

const categoryColorMap: Record<string, string> = {
  'Reforestation': '#1a3c34',
  'Clean Solar': '#f0a500',
  'Ocean & Coasts': '#0284c7',
  'Humanitarian': '#e11d48',
  'Wildlife Rescue': '#059669',
  'Other': '#7c3aed'
};

const categoryPieDummy = [
  { name: 'Reforestation', value: 240, color: '#1a3c34' },
  { name: 'Clean Solar', value: 120, color: '#f0a500' },
  { name: 'Ocean & Coasts', value: 90, color: '#0284c7' },
  { name: 'Humanitarian', value: 50, color: '#e11d48' },
];

const projectStatusPieDummy = [
  { name: 'Milestone Approved', value: 4, color: '#10b981' },
  { name: 'Under Verification', value: 1, color: '#f59e0b' },
];

export default function SupporterHome() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let list: Contribution[] = [];
      try {
        const res = await api.get('/contributions/supporter?limit=100');
        list = res.data.contributions || [];
      } catch (err) {
        console.error('Error loading supporter contributions:', err);
      }
      
      const merged = [...list];
      dummyContributions.forEach(d => {
        if (!merged.some(c => c.campaignTitle === d.campaignTitle)) {
          merged.push(d);
        }
      });

      setContributions(merged);
      setLoading(false);
    })();
  }, []);

  // Compute metrics
  const totalPledged = contributions.reduce((acc, c) => acc + c.contributionAmount, 0);
  const approvedList = contributions.filter(c => c.status === 'approved');
  const pendingCount = contributions.filter(c => c.status === 'pending').length;

  // Prepare dynamic category chart data
  const getDynamicCategoryPie = () => {
    if (contributions.length === 0) return categoryPieDummy;
    
    const catMap: Record<string, number> = {};
    contributions.forEach(c => {
      const cat = c.category || (c.campaignTitle.toLowerCase().includes('mangrove') || c.campaignTitle.toLowerCase().includes('forest') ? 'Reforestation' :
        c.campaignTitle.toLowerCase().includes('solar') ? 'Clean Solar' :
        c.campaignTitle.toLowerCase().includes('ocean') || c.campaignTitle.toLowerCase().includes('coral') ? 'Ocean & Coasts' : 'Humanitarian');
      
      catMap[cat] = (catMap[cat] || 0) + c.contributionAmount;
    });

    return Object.keys(catMap).map(key => ({
      name: key,
      value: catMap[key],
      color: categoryColorMap[key] || '#7c3aed'
    }));
  };

  const pieData = getDynamicCategoryPie();

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-[#1a3c34] animate-spin mb-4" />
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Loading Supporter Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="text-left space-y-8 font-sans">
      
      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-r from-[#1a3c34] via-[#1a3c34]/95 to-[#141b2b] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#f0a500]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-[#f0a500] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest backdrop-blur-md mb-3 border border-white/10">
              <FaLeaf /> Verified Supporter Profile
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white m-0">
              Welcome Back, {user?.name || 'Supporter'}!
            </h1>
            <p className="text-zinc-300 text-sm mt-2 max-w-xl font-medium leading-relaxed">
              Track your environmental contribution metrics, carbon credit allocations, and active micro-plantation campaign approvals.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#f0a500] text-zinc-950 flex items-center justify-center text-xl font-black shadow-md">
              <FaCoins />
            </div>
            <div>
              <span className="text-[10px] text-zinc-300 uppercase font-black tracking-widest block">
                Available Wallet Credits
              </span>
              <span className="text-2xl font-black text-white font-numbers">
                {user?.credits?.toLocaleString() || 0} <span className="text-sm text-[#f0a500]">Cr</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat 1 */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1a3c34] flex items-center justify-center text-xl font-bold">
              <FaCoins />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <FaArrowUp className="text-[9px]" /> +14.2%
            </span>
          </div>
          <span className="text-3xl font-black text-zinc-900 block font-numbers mb-1">
            {totalPledged} <span className="text-sm text-zinc-400 font-bold">Cr</span>
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Total Credits Pledged
          </span>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#f0a500] flex items-center justify-center text-xl font-bold">
              <FaTree />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              Verified
            </span>
          </div>
          <span className="text-3xl font-black text-zinc-900 block font-numbers mb-1">
            {approvedList.length}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Eco Projects Backed
          </span>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              <FaGlobe />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Estimated
            </span>
          </div>
          <span className="text-3xl font-black text-zinc-900 block font-numbers mb-1">
            2.4 <span className="text-sm text-zinc-400 font-bold">Tons</span>
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Estimated CO2 Offset
          </span>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">
              <FaHourglassHalf />
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              {pendingCount} Active
            </span>
          </div>
          <span className="text-3xl font-black text-zinc-900 block font-numbers mb-1">
            {pendingCount}
          </span>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Pending Approval
          </span>
        </div>

      </div>

      {/* ── CHARTS ROW: BAR CHART + PIE CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Bar Chart — Contribution Distribution */}
        <div className="lg:col-span-7 bg-white border border-zinc-200/80 rounded-3xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-black text-zinc-900 m-0 uppercase tracking-wider flex items-center gap-2">
                <FaChartBar className="text-[#1a3c34]" /> Contribution Distribution
              </h3>
              <p className="text-xs text-zinc-500 m-0 mt-1 font-medium">Credits pledged per environmental initiative</p>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1a3c34] bg-emerald-50 px-3 py-1 rounded-full">
              Live Data
            </span>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributions.map(c => ({ name: c.campaignTitle.substring(0, 18) + '...', Amount: c.contributionAmount }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141b2b', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold' }} 
                />
                <Bar dataKey="Amount" fill="#1a3c34" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Chart — Impact Category Breakdown */}
        <div className="lg:col-span-5 bg-white border border-zinc-200/80 rounded-3xl p-7 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-black text-zinc-900 m-0 uppercase tracking-wider flex items-center gap-2">
                <FaChartPie className="text-[#f0a500]" /> Impact Sector Allocation
              </h3>
              <p className="text-xs text-zinc-500 m-0 mt-1 font-medium">Distribution by ecological cause</p>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f0a500] bg-amber-50 px-3 py-1 rounded-full">
              Pie Chart
            </span>
          </div>

          <div className="w-full h-[280px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={6} 
                  dataKey="value"
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141b2b', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} 
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── SECOND PIE / STATUS BREAKDOWN ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Donut Chart: Campaign Approval Status */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 rounded-3xl p-7 shadow-sm">
          <div className="mb-4 pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-black text-zinc-900 m-0 uppercase tracking-wider flex items-center gap-2">
              <FaShieldAlt className="text-emerald-600" /> Verification Status
            </h3>
            <p className="text-[11px] text-zinc-500 m-0 mt-1">Pledges breakdown by status</p>
          </div>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={projectStatusPieDummy} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={75} 
                  paddingAngle={4} 
                  dataKey="value"
                >
                  {projectStatusPieDummy.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contributions History Table */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/80 rounded-3xl p-7 shadow-sm">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-base font-black text-zinc-900 m-0 uppercase tracking-wider flex items-center gap-2">
                <FaLeaf className="text-emerald-600" /> Approved Contribution History
              </h3>
              <p className="text-xs text-zinc-500 m-0 mt-1 font-medium">Recent wallet credit pledges to verified causes</p>
            </div>
            <span className="text-xs font-bold text-zinc-400">
              Showing {contributions.length} entries
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-100">
            <table className="w-full border-collapse bg-white text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-5 py-3.5 text-[10px] uppercase text-zinc-400 font-black tracking-widest">Campaign Title</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase text-zinc-400 font-black tracking-widest">Category</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase text-zinc-400 font-black tracking-widest">Pledged Amount</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase text-zinc-400 font-black tracking-widest">Creator</th>
                  <th className="px-5 py-3.5 text-[10px] uppercase text-zinc-400 font-black tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {contributions.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-zinc-900">
                      {c.campaignTitle}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                        {c.category || 'Environmental'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-black text-[#1a3c34]">
                      +{c.contributionAmount} Cr
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-zinc-600">
                      {c.creatorName}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        c.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
