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
  FaExclamationTriangle 
} from 'react-icons/fa';

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
        amount: Number(amount),
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
      <div>
        <Navbar />
        <div className="container text-center" style={{ padding: '120px 0' }}>
          <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p style={{ marginTop: '15px', color: '#888' }}>Loading campaign details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div>
        <Navbar />
        <div className="container text-center" style={{ padding: '80px 0' }}>
          <div className="alert alert-danger" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <FaExclamationTriangle /> Error Loading Campaign
            </h4>
            <p>{error || 'The requested campaign could not be found.'}</p>
            <Link href="/explore" className="btn btn-sm btn-danger" style={{ marginTop: '15px' }}>Back to Explore</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((campaign.amountRaised / campaign.fundingGoal) * 100));
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div>
      <Navbar />

      {/* PAGE HEADER */}
      <section 
        className="page-header" 
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.55)), url('/images/home_1_slider_1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0',
          color: '#fff'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h3 style={{ color: '#fff', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {campaign.title}
              </h3>
              <p className="page-breadcrumb" style={{ fontSize: '12px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#ccc' }}>Home</Link> / <Link href="/explore" style={{ color: '#ccc' }}>Causes</Link> / Single Cause
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN SINGLE CAUSE CONTENT */}
      <section className="section-content-block">
        <div className="container">
          <div className="row">
            
            {/* LEFT COLUMN: Main Post Details */}
            <div className="col-md-8 col-sm-12">
              <article className="post single-post-inner" style={{ background: '#fff', border: '1px solid #eee', padding: '0 0 30px 0', borderRadius: '4px', overflow: 'hidden' }}>
                
                {/* Banner Image */}
                <div className="post-inner-featured-content" style={{ height: '420px', overflow: 'hidden' }}>
                  <img src={campaign.imageUrl} alt={campaign.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Statistics Box */}
                <div className="cause-info-container" style={{ background: '#fcfcfc', borderBottom: '1px solid #eee', borderTop: '1px solid #eee', padding: '20px 0', margin: '0' }}>
                  <div className="row">
                    <div className="col-md-3 col-sm-6 text-center causes-info-block" style={{ borderRight: '1px solid #eee' }}>
                      <FaFlag style={{ color: '#7cb032', fontSize: '22px' }} />
                      <br /><span style={{ fontSize: '12px', color: '#666' }}>Goal</span>
                      <br /><strong style={{ fontSize: '16px', color: '#333' }}>{campaign.fundingGoal} cr</strong>
                    </div>
                    <div className="col-md-3 col-sm-6 text-center causes-info-block" style={{ borderRight: '1px solid #eee' }}>
                      <FaHeart style={{ color: '#7cb032', fontSize: '22px' }} />
                      <br /><span style={{ fontSize: '12px', color: '#666' }}>Raised</span>
                      <br /><strong style={{ fontSize: '16px', color: '#333' }}>{campaign.amountRaised} cr</strong>
                    </div>
                    <div className="col-md-3 col-sm-6 text-center causes-info-block" style={{ borderRight: '1px solid #eee' }}>
                      <FaRegChartBar style={{ color: '#7cb032', fontSize: '22px' }} />
                      <br /><span style={{ fontSize: '12px', color: '#666' }}>Progress</span>
                      <br /><strong style={{ fontSize: '16px', color: '#333' }}>{progressPercentage}%</strong>
                    </div>
                    <div className="col-md-3 col-sm-6 text-center causes-info-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <a className="btn btn-theme text-uppercase" href="#pledge-form" style={{ padding: '8px 18px', fontSize: '11px' }}>Donate Now</a>
                    </div>
                  </div>
                </div>

                {/* Story and Text */}
                <div style={{ padding: '30px' }}>
                  <div className="single-post-inner-title" style={{ marginBottom: '20px' }}>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '26px', fontWeight: 'bold' }}>{campaign.title}</h2>
                    <p className="single-post-meta" style={{ fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaUser /> Launched by: <strong>{campaign.creatorName}</strong>
                      </span>
                      <span>|</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaTag /> Category: <strong>{campaign.category}</strong>
                      </span>
                      <span>|</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaCalendarAlt /> Deadline: <strong>{new Date(campaign.deadline).toLocaleDateString()}</strong>
                      </span>
                    </p>
                  </div>

                  <div className="single-post-inner-content" style={{ fontSize: '13px', lineHeight: '1.8', color: '#555', whiteSpace: 'pre-wrap' }}>
                    <p>{campaign.story}</p>
                  </div>

                  {/* Reward Pledge details */}
                  <div style={{ marginTop: '35px', padding: '20px', background: '#f7fdf0', border: '1px solid #e1f2cc', borderRadius: '4px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: '#7cb032', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaGift /> Creator's Promised Reward
                    </h4>
                    <p style={{ fontSize: '12px', color: '#555', margin: 0, lineHeight: '1.6' }}>
                      {campaign.rewardInfo || 'No specific reward has been specified for this campaign.'}
                    </p>
                  </div>
                </div>

              </article>

              {/* PLEDGE CONTRIBUTION FORM */}
              <div id="pledge-form" style={{ marginTop: '40px', background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold' }}>Make a <span>Pledge</span></h3>
                <hr style={{ display: 'inline-block', margin: '5px 0 20px 0', width: '50px', borderColor: '#7cb032', borderWidth: '2px' }} />
                
                {contribSuccess && (
                  <div className="alert alert-success" style={{ fontSize: '12px' }}>{contribSuccess}</div>
                )}
                {contribError && (
                  <div className="alert alert-danger" style={{ fontSize: '12px' }}>{contribError}</div>
                )}

                <form onSubmit={handleContribute} className="row">
                  <div className="col-md-6 form-group">
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Credits Amount to Donate</label>
                    <input
                      type="number"
                      required
                      min={campaign.minimumContribution}
                      placeholder={`Min pledge: ${campaign.minimumContribution} credits`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value !== '' ? Number(e.target.value) : '')}
                      className="form-control"
                      style={{ padding: '10px', height: '40px', fontSize: '13px' }}
                    />
                  </div>
                  <div className="col-md-12 form-group" style={{ marginTop: '15px' }}>
                    <button
                      type="submit"
                      disabled={contributing || campaign.status !== 'approved'}
                      className="btn btn-theme text-uppercase"
                      style={{ padding: '10px 30px', fontSize: '12px' }}
                    >
                      {contributing ? 'Processing...' : 'Confirm Pledge Contribution'}
                    </button>
                    {user && user.credits < (amount || 0) && (
                      <span style={{ marginLeft: '15px', color: 'red', fontSize: '11px', fontWeight: 'bold' }}>
                        Insufficient credits! Please visit your dashboard to top up.
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* RIGHT COLUMN: Sidebar stats / Actions */}
            <div className="col-md-4 col-sm-12">
              <div className="sidebar" style={{ background: '#fff', border: '1px solid #eee', padding: '25px', borderRadius: '4px' }}>
                
                {/* Stats widget */}
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '2px solid #7cb032', paddingBottom: '5px', margin: '0 0 15px 0' }}>Campaign Details</h4>
                  
                  <ul className="list-unstyled" style={{ fontSize: '12px', color: '#555', lineHeight: '2.2', paddingLeft: 0 }}>
                    <li style={{ borderBottom: '1px solid #f9f9f9', padding: '5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaRegCalendarCheck style={{ color: '#7cb032' }} /> Days Remaining: <strong>{daysLeft} days</strong>
                    </li>
                    <li style={{ borderBottom: '1px solid #f9f9f9', padding: '5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaCoins style={{ color: '#7cb032' }} /> Min Pledge: <strong>{campaign.minimumContribution} credits</strong>
                    </li>
                    <li style={{ borderBottom: '1px solid #f9f9f9', padding: '5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaRegUserCircle style={{ color: '#7cb032' }} /> Creator: <strong>{campaign.creatorName}</strong>
                    </li>
                    <li style={{ borderBottom: '1px solid #f9f9f9', padding: '5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaEnvelope style={{ color: '#7cb032' }} /> Contact Email: <strong>{campaign.creatorEmail}</strong>
                    </li>
                  </ul>
                </div>

                {/* Flag widget */}
                <div style={{ padding: '20px 0 0 0', borderTop: '1px solid #eee' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#aa3333', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaExclamationTriangle /> Report Campaign
                  </h4>
                  <p style={{ fontSize: '11px', color: '#777', lineHeight: '1.5', marginBottom: '15px' }}>
                    If you believe this campaign violates terms of service, is fraudulent, or contains copied content, report it to the admin team immediately.
                  </p>
                  
                  {!reportModalOpen ? (
                    <button
                      onClick={() => setReportModalOpen(true)}
                      className="btn btn-danger btn-xs"
                      style={{ padding: '5px 12px', fontSize: '10px', background: '#d9534f', borderColor: '#d43f3a' }}
                    >
                      Flag this campaign
                    </button>
                  ) : (
                    <form onSubmit={handleReport} style={{ background: '#fff3f3', padding: '15px', borderRadius: '4px', border: '1px solid #ebccd1' }}>
                      {reportSuccess && <div className="alert alert-success" style={{ fontSize: '10px', padding: '5px 10px' }}>{reportSuccess}</div>}
                      {reportError && <div className="alert alert-danger" style={{ fontSize: '10px', padding: '5px 10px' }}>{reportError}</div>}
                      
                      <div className="form-group">
                        <textarea
                          required
                          rows={3}
                          placeholder="Reason for flag (mandatory)..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="form-control"
                          style={{ fontSize: '11px', padding: '6px 8px' }}
                        />
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                        <button
                          type="submit"
                          disabled={reporting}
                          className="btn btn-danger btn-xs"
                          style={{ padding: '4px 10px', fontSize: '10px' }}
                        >
                          {reporting ? 'Submitting...' : 'Submit Report'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setReportModalOpen(false)}
                          className="btn btn-default btn-xs"
                          style={{ padding: '4px 10px', fontSize: '10px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
