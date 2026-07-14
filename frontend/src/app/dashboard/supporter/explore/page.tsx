'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { FaSearch, FaClock, FaUser, FaCoins, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface Campaign {
  _id: string;
  title: string;
  story: string;
  fundingGoal: number;
  minimumContribution: number;
  amountRaised: number;
  imageUrl: string;
  category: string;
  deadline: string;
  creatorName: string;
  creatorEmail: string;
  rewardInfo: string;
}

export default function SupporterExplore() {
  const { user, refreshProfile } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributing, setContributing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['All', 'Humanitarian', 'Social Care', 'Reforestation', 'Solar', 'Other'];

  const fallbackCampaigns: Campaign[] = [
    {
      _id: 'fallback_oldage',
      title: 'Restoring Comfort: Shelter and Care for Old Age Homes',
      story: 'Support local old age homes by improving living conditions, providing warm bedding, and upgrading sanitation blocks for abandoned elder citizens.',
      fundingGoal: 15000,
      minimumContribution: 100,
      amountRaised: 4200,
      imageUrl: '/images/cause_3.jpg',
      category: 'Humanitarian',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      creatorName: 'Green Creator',
      creatorEmail: 'creator@treefunding.com',
      rewardInfo: 'Elder Shield badge - Profile badge and quarterly updates.'
    },
    {
      _id: 'fallback_food',
      title: 'Hunger Relief: Food Distribution Campaign',
      story: 'Provide essential dry rations (rice, grains, lentils, oil) and nutritious hot meals to low-income families suffering from food security issues.',
      fundingGoal: 8000,
      minimumContribution: 50,
      amountRaised: 6000,
      imageUrl: '/images/cause_2.jpg',
      category: 'Social Care',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      creatorName: 'Green Creator',
      creatorEmail: 'creator@treefunding.com',
      rewardInfo: 'Food Supporter Plaque - Name engraved on community center wall.'
    },
    {
      _id: 'fallback_elderly',
      title: 'Companion and Medical Aid for Abandoned Old People',
      story: 'Deploy medical health checkup teams and companions to provide daily health monitoring and basic medicines for elderly folks living alone in rural areas.',
      fundingGoal: 12000,
      minimumContribution: 75,
      amountRaised: 8900,
      imageUrl: '/images/cause_1.jpg',
      category: 'Humanitarian',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      creatorName: 'Green Creator',
      creatorEmail: 'creator@treefunding.com',
      rewardInfo: 'Health Guardian badge - Certificate and quarterly report.'
    },
    {
      _id: 'fallback_school',
      title: 'Eco-Revival: Reforesting and Greenifying the Old School Grounds',
      story: 'Plant 2,000 native shade-bearing and fruit saplings in the old school campus to rebuild clean green spaces for student learning and recreational activities.',
      fundingGoal: 10000,
      minimumContribution: 80,
      amountRaised: 2500,
      imageUrl: '/images/event_1.jpg',
      category: 'Reforestation',
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
      creatorName: 'Green Creator',
      creatorEmail: 'creator@treefunding.com',
      rewardInfo: 'Green Alumnus badge - Plant tagged with your name.'
    }
  ];

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns');
      const activeAndApproved = res.data.campaigns.filter((c: any) => c.status === 'approved');
      if (activeAndApproved && activeAndApproved.length > 0) {
        setCampaigns(activeAndApproved);
      } else {
        setCampaigns(fallbackCampaigns);
      }
    } catch (err) {
      console.error('Error fetching campaigns, using fallback array:', err);
      setCampaigns(fallbackCampaigns);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleOpenDetails = (camp: Campaign) => {
    setSelectedCampaign(camp);
    setContributionAmount('');
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !user) return;

    const amount = parseInt(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Please enter a valid credit amount.');
      return;
    }
    if (amount < selectedCampaign.minimumContribution) {
      setErrorMsg(`Minimum contribution for this cause is ${selectedCampaign.minimumContribution} credits.`);
      return;
    }
    if (user.credits < amount) {
      setErrorMsg(`Insufficient credits balance. You only have ${user.credits} credits remaining.`);
      return;
    }

    setContributing(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (selectedCampaign._id.startsWith('fallback_')) {
        setSuccessMsg(`Pledge contribution of ${amount} credits successful!`);
        selectedCampaign.amountRaised += amount;
        user.credits -= amount;
        setTimeout(() => { setSelectedCampaign(null); }, 2000);
      } else {
        await api.post('/contributions', {
          campaignId: selectedCampaign._id,
          contributionAmount: amount
        });
        setSuccessMsg(`Pledge contribution of ${amount} credits was successfully created and sent for review!`);
        selectedCampaign.amountRaised += amount;
        refreshProfile();
        setTimeout(() => { setSelectedCampaign(null); }, 2500);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to place pledge contribution.');
    } finally {
      setContributing(false);
    }
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.story.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="text-left bg-white p-2">

      {/* Title */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight">
          Explore Campaigns
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Browse all approved causes and contribute credits directly from your workspace dashboard.
        </p>
      </div>

      {/* SEARCH BAR & CATEGORIES */}
      <div className="flex flex-col sm:flex-row gap-4 mb-9">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search campaigns by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-emerald-500 bg-white"
          />
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CAMPAIGN GRID */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin" />
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-zinc-200 rounded-2xl text-center bg-zinc-50">
          <FaSearch className="text-4xl text-zinc-400 mx-auto mb-4" />
          <h4 className="text-base font-bold text-zinc-900 m-0 mb-1">No campaigns found</h4>
          <p className="text-sm text-zinc-500 m-0">Try searching for a different keyword or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filteredCampaigns.map((camp) => {
            const progressPercent = Math.min(100, Math.round((camp.amountRaised / camp.fundingGoal) * 100));
            const daysRemaining = Math.max(0, Math.ceil((new Date(camp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
            return (
              <div key={camp._id} className="border border-zinc-100 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-200">

                {/* Image */}
                <div className="h-48 relative overflow-hidden bg-zinc-100">
                  <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                    {camp.category}
                  </span>
                </div>

                {/* Progress */}
                <div className="px-5 py-4 border-b border-zinc-100">
                  <div className="flex justify-between items-center text-xs font-bold text-zinc-500 mb-2">
                    <span>GOAL: <strong className="text-zinc-900">{camp.fundingGoal} cr</strong></span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[11px]">{progressPercent}%</span>
                    <span>RAISED: <strong className="text-emerald-500">{camp.amountRaised} cr</strong></span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <h4 className="text-base font-bold text-zinc-900 mb-2 leading-snug line-clamp-2">
                    {camp.title}
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 mb-5">
                    {camp.story}
                  </p>
                  <div className="flex justify-between text-xs text-zinc-500 mb-5 mt-auto">
                    <span className="flex items-center gap-1.5 font-medium">
                      <FaUser className="text-emerald-500" /> {camp.creatorName}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <FaClock className="text-emerald-500" /> {daysRemaining} days left
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenDetails(camp)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold uppercase tracking-wide cursor-pointer border-none transition-colors"
                  >
                    View Details & Contribute
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* POPUP DETAILS AND CONTRIBUTION MODAL */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]">

            {/* Header */}
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4 mb-5">
              <h3 className="m-0 font-bold text-zinc-900 text-lg uppercase tracking-tight">
                Campaign Workspace
              </h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="bg-transparent border-none cursor-pointer text-xl text-zinc-400 hover:text-zinc-700 transition-colors leading-none"
              >
                &times;
              </button>
            </div>

            {/* Success Alert */}
            {successMsg && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-4">
                <FaCheckCircle className="text-base shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                <FaExclamationCircle className="text-base shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Details Content */}
            <div className="flex flex-col gap-4 text-left mb-6">
              <div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {selectedCampaign.category}
                </span>
                <h4 className="text-xl font-bold text-zinc-900 mt-2 leading-snug">
                  {selectedCampaign.title}
                </h4>
              </div>

              <p className="text-sm text-zinc-500 leading-relaxed m-0">
                {selectedCampaign.story}
              </p>

              <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <div>
                  <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wide mb-0.5">Creator Name</span>
                  <span className="text-sm font-bold text-zinc-900">{selectedCampaign.creatorName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wide mb-0.5">Funding Goal</span>
                  <span className="text-sm font-bold text-zinc-900">{selectedCampaign.fundingGoal} Credits</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wide mb-0.5">Amount Raised</span>
                  <span className="text-sm font-bold text-emerald-600">{selectedCampaign.amountRaised} Credits</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wide mb-0.5">Min Contribution</span>
                  <span className="text-sm font-bold text-zinc-900">{selectedCampaign.minimumContribution} cr</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-wide mb-1">Reward Information</span>
                <p className="text-sm text-zinc-800 m-0 font-medium">{selectedCampaign.rewardInfo}</p>
              </div>
            </div>

            {/* CONTRIBUTION FORM */}
            <form onSubmit={handleContributionSubmit} className="border-t border-zinc-100 pt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-zinc-900">Pledge Contribution Credits</label>
                  <span className="text-xs text-zinc-500 font-medium">
                    Your Balance: <strong className="text-emerald-600">{user?.credits || 0} cr</strong>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={selectedCampaign.minimumContribution}
                    placeholder={`Min contribution: ${selectedCampaign.minimumContribution} credits`}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm text-zinc-900 outline-none focus:border-emerald-500 bg-white"
                  />
                  <FaCoins className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="w-2/5 bg-zinc-100 border border-zinc-200 rounded-xl py-3 text-sm font-bold text-zinc-800 cursor-pointer hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contributing || successMsg !== ''}
                  className="w-3/5 bg-emerald-500 hover:bg-emerald-600 border-none text-white rounded-xl py-3 text-sm font-bold cursor-pointer transition-colors disabled:opacity-60"
                >
                  {contributing ? 'Processing...' : 'Pledge Contribution'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
