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
  const { user, refreshUser } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal inspection & contribution states
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
        // Offline preview mock submission success
        setSuccessMsg(`Pledge contribution of ${amount} credits successful!`);
        selectedCampaign.amountRaised += amount;
        
        // Subtract mock credits from local state
        user.credits -= amount;
        
        setTimeout(() => {
          setSelectedCampaign(null);
        }, 2000);
      } else {
        // Live server API call
        await api.post('/contributions', {
          campaignId: selectedCampaign._id,
          contributionAmount: amount
        });

        setSuccessMsg(`Pledge contribution of ${amount} credits was successfully created and sent for review!`);
        selectedCampaign.amountRaised += amount;

        // Refresh user context credits
        refreshUser();

        setTimeout(() => {
          setSelectedCampaign(null);
        }, 2500);
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
    <div style={{ textAlign: 'left', background: '#ffffff', padding: '10px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '35px', borderBottom: '1px solid #eef2eb', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e211c', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Explore Campaigns
        </h2>
        <p style={{ fontSize: '14px', color: '#656b60', marginTop: '6px', fontWeight: '500' }}>
          Browse all approved causes and contribute credits directly from your workspace dashboard.
        </p>
      </div>

      {/* SEARCH BAR & CATEGORIES */}
      <div className="row" style={{ marginBottom: '35px', gap: '15px' }}>
        <div className="col-md-5" style={{ marginBottom: '15px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search campaigns by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '8px',
                border: '1px solid #dcdfd8',
                fontSize: '14px',
                outline: 'none',
                color: '#1e211c'
              }}
            />
            <FaSearch style={{ position: 'absolute', right: '15px', top: '16px', color: '#656b60' }} />
          </div>
        </div>

        <div className="col-md-7 text-right" style={{ marginBottom: '15px' }}>
          <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderRadius: '6px',
                  border: '1px solid #dcdfd8',
                  background: selectedCategory === cat ? '#7cb032' : '#ffffff',
                  color: selectedCategory === cat ? '#ffffff' : '#1e211c',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CAMPAIGN GRID */}
      {loading ? (
        <div style={{ display: 'flex', height: '240px', alignItems: 'center', justifyContent: 'center' }}>
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin" />
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div style={{ padding: '60px 20px', border: '2px dashed #eef2eb', borderRadius: '12px', textAlign: 'center', background: '#fcfdfa' }}>
          <FaSearch style={{ fontSize: '42px', color: '#656b60', display: 'block', margin: '0 auto 15px' }} />
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 5px 0' }}>No campaigns found</h4>
          <p style={{ fontSize: '13px', color: '#656b60', margin: 0 }}>Try searching for a different keyword or category.</p>
        </div>
      ) : (
        <div className="row">
          {filteredCampaigns.map((camp) => {
            const progressPercent = Math.min(100, Math.round((camp.amountRaised / camp.fundingGoal) * 100));
            const daysRemaining = Math.max(0, Math.ceil((new Date(camp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
            
            return (
              <div key={camp._id} className="col-md-6 col-lg-6 col-sm-12" style={{ marginBottom: '30px' }}>
                <div style={{ border: '1px solid #eef2eb', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  {/* Category Tag Overlay image */}
                  <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: '#f5f7f3' }}>
                    <img 
                      src={camp.imageUrl} 
                      alt={camp.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <span style={{ position: 'absolute', top: '15px', left: '15px', background: '#7cb032', color: '#ffffff', fontSize: '10px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {camp.category}
                    </span>
                  </div>

                  {/* Fund Raised info */}
                  <div style={{ padding: '20px', borderBottom: '1px solid #eef2eb' }}>
                    <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', color: '#656b60' }}>
                      <span>GOAL: <strong style={{ color: '#1e211c' }}>{camp.fundingGoal} cr</strong></span>
                      <span style={{ background: '#eaf4db', color: '#56801b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{progressPercent}%</span>
                      <span>RAISED: <strong style={{ color: '#7cb032' }}>{camp.amountRaised} cr</strong></span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ height: '8px', marginTop: '12px', background: '#eef2eb', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: '#7cb032', borderRadius: '10px' }} />
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h4 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 10px 0', lineHeight: '1.4', height: '48px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {camp.title}
                    </h4>
                    
                    <p style={{ fontSize: '13px', color: '#656b60', lineHeight: '1.6', height: '58px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', margin: '0 0 20px 0' }}>
                      {camp.story}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#656b60', marginBottom: '20px', marginTop: 'auto' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                        <FaUser style={{ color: '#7cb032' }} /> {camp.creatorName}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                        <FaClock style={{ color: '#7cb032' }} /> {daysRemaining} days left
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenDetails(camp)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: '#7cb032',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        letterSpacing: '0.5px'
                      }}
                    >
                      View Details & Contribute
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POPUP DETAILS AND CONTRIBUTION MODAL */}
      {selectedCampaign && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '100%', maxWidth: '550px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', overflowY: 'auto', maxHeight: '90vh' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2eb', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 'bold', color: '#1e211c', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                Campaign workspace
              </h3>
              <button 
                onClick={() => setSelectedCampaign(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#888' }}
              >
                &times;
              </button>
            </div>

            {/* Success Alert */}
            {successMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#eaf4db', border: '1px solid #c9e2a3', color: '#56801b', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px' }}>
                <FaCheckCircle style={{ fontSize: '16px', flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fde8e8', border: '1px solid #f8b4b4', color: '#c81e1e', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px' }}>
                <FaExclamationCircle style={{ fontSize: '16px', flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Details Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left', marginBottom: '25px' }}>
              <div>
                <span style={{ fontSize: '10px', background: '#eaf4db', color: '#56801b', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {selectedCampaign.category}
                </span>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e211c', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  {selectedCampaign.title}
                </h4>
              </div>

              <p style={{ fontSize: '14px', color: '#656b60', lineHeight: '1.6', margin: 0 }}>
                {selectedCampaign.story}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: '#fcfdfa', padding: '15px', borderRadius: '8px', border: '1px solid #eef2eb' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#656b60', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Creator Name</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c' }}>{selectedCampaign.creatorName}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#656b60', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Funding Goal</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c' }}>{selectedCampaign.fundingGoal} Credits</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#656b60', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Amount Raised</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#7cb032' }}>{selectedCampaign.amountRaised} Credits</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#656b60', display: 'block', fontWeight: 'bold', textTransform: 'uppercase' }}>Min Contribution</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c' }}>{selectedCampaign.minimumContribution} cr</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#656b60', display: 'block', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Reward Information</span>
                <p style={{ fontSize: '13px', color: '#1e211c', margin: 0, fontWeight: '500' }}>{selectedCampaign.rewardInfo}</p>
              </div>
            </div>

            {/* CONTRIBUTION FORM */}
            <form onSubmit={handleContributionSubmit} style={{ borderTop: '1px solid #eef2eb', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c' }}>Pledge Contribution Credits</label>
                  <span style={{ fontSize: '12px', color: '#656b60', fontWeight: '500' }}>
                    Your Balance: <strong style={{ color: '#7cb032' }}>{user?.credits || 0} cr</strong>
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min={selectedCampaign.minimumContribution}
                    placeholder={`Min contribution: ${selectedCampaign.minimumContribution} credits`}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      border: '1px solid #dcdfd8',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#1e211c'
                    }}
                  />
                  <FaCoins style={{ position: 'absolute', right: '15px', top: '16px', color: '#7cb032' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  style={{
                    width: '35%',
                    background: '#f5f7f3',
                    border: '1px solid #dcdfd8',
                    borderRadius: '8px',
                    padding: '12px 0',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    color: '#1e211c',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contributing || successMsg !== ''}
                  style={{
                    width: '65%',
                    background: '#7cb032',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '12px 0',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    opacity: (contributing || successMsg !== '') ? 0.6 : 1
                  }}
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
