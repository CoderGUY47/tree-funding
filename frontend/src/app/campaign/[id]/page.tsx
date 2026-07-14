'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { 
  FaFlag, 
  FaHeart, 
  FaRegChartBar, 
  FaUser, 
  FaTag, 
  FaCalendarAlt, 
  FaGift, 
  FaRegCalendarCheck, 
  FaCoins, 
  FaRegUserCircle, 
  FaEnvelope, 
  FaExclamationTriangle,
  FaArrowLeft
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Campaign {
  _id: string;
  title: string;
  story: string;
  rewardInfo: string;
  fundingGoal: number;
  amountRaised: number;
  imageUrl: string;
  category: string;
  deadline: string;
  minimumContribution: number;
  creatorName: string;
  creatorEmail: string;
  status: string;
}

export default function CampaignDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Contribution form state
  const [amount, setAmount] = useState<number | ''>('');
  const [contributing, setContributing] = useState(false);
  const [contribSuccess, setContribSuccess] = useState('');
  const [contribError, setContribError] = useState('');

  // Flag report state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState('');
  const [reportError, setReportError] = useState('');

  const fetchCampaignDetails = async () => {
    try {
      const res = await api.get(`/campaigns/${id}`);
      setCampaign(res.data.campaign);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading campaign details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCampaignDetails();
    }
  }, [id]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!campaign || !amount) return;

    setContributing(true);
    setContribError('');
    setContribSuccess('');

    try {
      await api.post('/contributions', {
        campaignId: campaign._id,
        contributionAmount: Number(amount),
      });

      setContribSuccess('Contribution submitted successfully! Locked pending creator approval.');
      setAmount('');
      fetchCampaignDetails();
      refreshProfile();
      
      setTimeout(() => {
        setContribSuccess('');
      }, 5000);
    } catch (err: any) {
      setContribError(err.response?.data?.message || 'Failed to make contribution.');
    } finally {
      setContributing(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!campaign || !reason) return;

    setReporting(true);
    setReportError('');
    setReportSuccess('');

    try {
      await api.post('/admin/reports', {
        campaignId: campaign._id,
        reason,
      });

      setReportSuccess('Campaign flagged successfully. Admins will review this.');
      setReason('');
      
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSuccess('');
      }, 3000);
    } catch (err: any) {
      setReportError(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-50 min-h-screen flex flex-col font-sans">
        <Navbar />
        <div className="container mx-auto px-4 max-w-6xl py-32 text-center flex-grow flex flex-col justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-500 text-sm font-bold">Loading campaign details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="bg-zinc-50 min-h-screen flex flex-col font-sans">
        <Navbar />
        <div className="container mx-auto px-4 max-w-lg py-32 flex-grow flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center w-full shadow-sm">
            <h4 className="flex items-center justify-center gap-2 font-black text-base uppercase mb-2">
              <FaExclamationTriangle /> Error Loading Campaign
            </h4>
            <p className="text-xs leading-relaxed mb-4">{error || 'The requested campaign could not be found.'}</p>
            <Link href="/explore" className="inline-flex h-9 px-4 items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase no-underline transition-colors">
              Back to Explore
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((campaign.amountRaised / campaign.fundingGoal) * 100));
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-zinc-50 min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* PAGE HEADER */}
      <section 
        className="relative py-20 text-white text-center bg-cover bg-center shrink-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.55)), url('/images/home_1_slider_1.jpg')`
        }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <h3 className="text-white text-3xl font-black uppercase tracking-tight m-0 truncate">
            {campaign.title}
          </h3>
          <p className="text-xs text-zinc-300 mt-2 font-medium">
            <Link href="/" className="text-zinc-300 hover:text-white no-underline">Home</Link> / <Link href="/explore" className="text-zinc-300 hover:text-white no-underline">Causes</Link> / Single Cause
          </p>
        </div>
      </section>

      {/* MAIN SINGLE CAUSE CONTENT */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            
            {/* LEFT COLUMN: Main Post Details */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <article className="bg-white border border-zinc-150 rounded-2xl overflow-hidden shadow-sm">
                
                {/* Banner Image */}
                <div className="h-96 w-full bg-zinc-100 overflow-hidden">
                  <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                </div>

                {/* Statistics Box */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-zinc-100 bg-zinc-50 py-5">
                  <div className="text-center border-r border-zinc-150 py-2">
                    <FaFlag className="text-emerald-500 text-lg mx-auto mb-1" />
                    <span className="text-[10px] text-zinc-450 uppercase font-black tracking-wider block">Goal Target</span>
                    <strong className="text-sm font-black text-zinc-800 block mt-0.5">{campaign.fundingGoal} cr</strong>
                  </div>
                  <div className="text-center border-r border-zinc-150 py-2">
                    <FaHeart className="text-emerald-500 text-lg mx-auto mb-1" />
                    <span className="text-[10px] text-zinc-450 uppercase font-black tracking-wider block">Raised Amount</span>
                    <strong className="text-sm font-black text-zinc-800 block mt-0.5">{campaign.amountRaised} cr</strong>
                  </div>
                  <div className="text-center border-r border-zinc-150 py-2">
                    <FaRegChartBar className="text-emerald-500 text-lg mx-auto mb-1" />
                    <span className="text-[10px] text-zinc-450 uppercase font-black tracking-wider block">Progress Percent</span>
                    <strong className="text-sm font-black text-zinc-800 block mt-0.5">{progressPercentage}%</strong>
                  </div>
                  <div className="text-center flex items-center justify-center px-4 py-2">
                    <a className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider text-center no-underline transition-colors" href="#pledge-form">Donate Now</a>
                  </div>
                </div>

                {/* Story and Text */}
                <div className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-zinc-900 leading-snug m-0">{campaign.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3.5 text-xs text-zinc-400 font-medium">
                      <span className="flex items-center gap-1">
                        <FaUser className="text-emerald-500 shrink-0" /> Launched by: <strong className="text-zinc-700">{campaign.creatorName}</strong>
                      </span>
                      <span>|</span>
                      <span className="flex items-center gap-1">
                        <FaTag className="text-emerald-500 shrink-0" /> Category: <strong className="text-zinc-700">{campaign.category}</strong>
                      </span>
                      <span>|</span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-emerald-500 shrink-0" /> Deadline: <strong className="text-zinc-700">{new Date(campaign.deadline).toLocaleDateString()}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-zinc-650 leading-relaxed white-space-pre-wrap">
                    {campaign.story}
                  </div>

                  {/* Reward Pledge details */}
                  <div className="mt-8 p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 m-0 mb-2">
                      <FaGift /> Creator's Promised Reward
                    </h4>
                    <p className="text-xs text-zinc-600 m-0 leading-relaxed">
                      {campaign.rewardInfo || 'No specific reward has been specified for this campaign.'}
                    </p>
                  </div>
                </div>

              </article>

              {/* PLEDGE CONTRIBUTION FORM */}
              <div id="pledge-form" className="bg-white border border-zinc-150 rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-black text-zinc-900 m-0">Make a <span className="text-emerald-600">Pledge Contribution</span></h3>
                <hr className="w-12 border-t-2 border-emerald-500 m-0 mt-2 mb-6" />
                
                {contribSuccess && (
                  <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-xl text-xs font-bold mb-4">
                    {contribSuccess}
                  </div>
                )}
                {contribError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold mb-4">
                    {contribError}
                  </div>
                )}

                <form onSubmit={handleContribute} className="flex flex-col gap-4 max-w-md">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-xs font-bold text-zinc-700">Credits Amount to Pledge</label>
                    <div className="relative">
                      <Input
                        type="number"
                        required
                        min={campaign.minimumContribution}
                        placeholder={`Min pledge: ${campaign.minimumContribution} credits`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value !== '' ? Number(e.target.value) : '')}
                        className="h-11 rounded-xl border border-zinc-250 px-4 text-sm focus-visible:ring-emerald-500 pr-10"
                      />
                      <FaCoins className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      type="submit"
                      disabled={contributing || campaign.status !== 'approved'}
                      className="h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 rounded-xl border-none cursor-pointer flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
                    >
                      {contributing ? 'Processing...' : 'Confirm Pledge'}
                    </Button>
                    {user && user.credits < (amount || 0) && (
                      <span className="text-[11px] text-red-600 font-bold leading-normal">
                        ⚠️ Insufficient credits! Please visit your dashboard to top up.
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar stats / Actions */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Campaign details card */}
              <Card className="bg-white border border-zinc-150 rounded-2xl shadow-sm p-6">
                <CardHeader className="p-0 pb-4 border-b border-zinc-100 text-left">
                  <CardTitle className="text-sm font-extrabold text-zinc-800 uppercase tracking-wider m-0">
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-4 text-left">
                  <ul className="list-none p-0 m-0 space-y-4 text-xs font-semibold text-zinc-650">
                    <li className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                      <FaRegCalendarCheck className="text-emerald-500 text-sm shrink-0" /> 
                      <span>Days Remaining: <strong className="text-zinc-900">{daysLeft} days</strong></span>
                    </li>
                    <li className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                      <FaCoins className="text-emerald-500 text-sm shrink-0" /> 
                      <span>Min Pledge: <strong className="text-zinc-900">{campaign.minimumContribution} credits</strong></span>
                    </li>
                    <li className="flex items-center gap-2 border-b border-zinc-50 pb-2">
                      <FaRegUserCircle className="text-emerald-500 text-sm shrink-0" /> 
                      <span>Creator: <strong className="text-zinc-900">{campaign.creatorName}</strong></span>
                    </li>
                    <li className="flex items-center gap-2 pb-1">
                      <FaEnvelope className="text-emerald-500 text-sm shrink-0" /> 
                      <span className="truncate">Contact Email: <strong className="text-zinc-900 truncate">{campaign.creatorEmail}</strong></span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Flag report card */}
              <Card className="bg-white border border-zinc-155 rounded-2xl shadow-sm p-6">
                <CardHeader className="p-0 pb-3 border-b border-zinc-100 text-left">
                  <CardTitle className="text-sm font-extrabold text-red-700 uppercase tracking-wider flex items-center gap-1.5 m-0">
                    <FaExclamationTriangle /> Flag Campaign
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-4 text-left">
                  <p className="text-[11px] text-zinc-450 leading-relaxed m-0 mb-4">
                    If you believe this campaign violates terms of service, contains fraudulent details, or has copied content, report it to the admin team immediately.
                  </p>
                  
                  {!reportModalOpen ? (
                    <Button
                      onClick={() => setReportModalOpen(true)}
                      className="h-8 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wide border-none px-4 rounded-lg cursor-pointer transition-colors"
                    >
                      Report Campaign
                    </Button>
                  ) : (
                    <form onSubmit={handleReport} className="bg-red-50/50 p-4 rounded-xl border border-red-100 flex flex-col gap-3">
                      {reportSuccess && <div className="bg-emerald-50 border border-emerald-250 text-emerald-700 px-3 py-2 rounded-lg text-[10px] font-bold">{reportSuccess}</div>}
                      {reportError && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-[10px] font-bold">{reportError}</div>}
                      
                      <div className="flex flex-col gap-1">
                        <textarea
                          required
                          rows={3}
                          placeholder="Reason for flag (mandatory)..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full bg-white border border-zinc-250 rounded-lg p-2.5 text-xs text-zinc-800 focus:outline-none focus:border-red-500 resize-none"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setReportModalOpen(false)}
                          className="h-7 px-3 rounded-md bg-zinc-100 hover:bg-zinc-200 text-[10px] font-bold text-zinc-700 border-none cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={reporting}
                          className="h-7 px-3 rounded-md bg-red-500 hover:bg-red-600 text-[10px] font-bold text-white border-none cursor-pointer disabled:opacity-60"
                        >
                          {reporting ? 'Submitting...' : 'Submit Report'}
                        </button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
