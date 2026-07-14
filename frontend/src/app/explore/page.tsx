'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/utils/api';
import { FaSearch, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

interface Campaign {
  _id: string;
  title: string;
  story: string;
  fundingGoal: number;
  amountRaised: number;
  imageUrl: string;
  category: string;
  deadline: string;
  creatorName: string;
}

const defaultFallbackCampaigns: Campaign[] = [
  {
    _id: 'fallback_oldage',
    title: 'Restoring Comfort: Shelter and Care for Old Age Homes',
    story: 'Support local old age homes by improving living conditions, providing warm bedding, and upgrading sanitation blocks for abandoned elder citizens.',
    fundingGoal: 15000,
    amountRaised: 4200,
    imageUrl: '/images/cause_3.jpg',
    category: 'Humanitarian',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_food',
    title: 'Hunger Relief: Food Distribution Campaign',
    story: 'Provide essential dry rations (rice, grains, lentils, oil) and nutritious hot meals to low-income families suffering from food security issues.',
    fundingGoal: 8000,
    amountRaised: 6000,
    imageUrl: '/images/cause_2.jpg',
    category: 'Social Care',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_elderly',
    title: 'Companion and Medical Aid for Abandoned Old People',
    story: 'Deploy medical health checkup teams and companions to provide daily health monitoring and basic medicines for elderly folks living alone in rural areas.',
    fundingGoal: 12000,
    amountRaised: 8900,
    imageUrl: '/images/cause_1.jpg',
    category: 'Humanitarian',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_school',
    title: 'Eco-Revival: Reforesting and Greenifying the Old School Grounds',
    story: 'Plant 2,000 native shade-bearing and fruit saplings in the old school campus to rebuild clean green spaces for student learning and recreational activities.',
    fundingGoal: 10000,
    amountRaised: 2500,
    imageUrl: '/images/event_1.jpg',
    category: 'Reforestation',
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  }
];

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Forestry', 'Solar', 'Gardening', 'Reforestation', 'Other'];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns');
        const activeAndApproved = res.data.campaigns.filter((c: any) => c.status === 'approved');
        
        if (activeAndApproved.length > 0) {
          setCampaigns(activeAndApproved);
        } else {
          setCampaigns(defaultFallbackCampaigns);
        }
      } catch (err) {
        console.error('Error fetching campaigns in explore, using local fallback data:', err);
        setCampaigns(defaultFallbackCampaigns);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <h3 style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Explore Campaigns
              </h3>
              <p className="page-breadcrumb" style={{ fontSize: '12px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#ccc' }}>Home</Link> / All Causes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="section-content-block">
        <div className="container">
          
          {/* SEARCH BAR & CATEGORIES */}
          <div className="row" style={{ marginBottom: '40px' }}>
            <div className="col-md-5">
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search campaigns by keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <FaSearch style={{ position: 'absolute', right: '15px', top: '15px', color: '#888' }} />
              </div>
            </div>

            <div className="col-md-7 text-right" style={{ marginTop: '5px' }}>
              <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn ${selectedCategory === cat ? 'btn-theme' : 'btn-pure-dark-bg'}`}
                    style={{
                      padding: '6px 16px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      borderRadius: '4px',
                      marginRight: '5px'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row section-heading-wrapper" style={{ marginBottom: '30px' }}>
            <div className="col-md-12 text-left">
              <h2>Our <span>Causes</span></h2>
              <hr style={{ display: 'inline-block', margin: '10px 0', width: '60px', borderColor: '#7cb032', borderWidth: '2px' }} />
              <h4>Find campaigns and fund tree plantation initiatives.</h4>
            </div>
          </div>

          {loading ? (
            <div className="row text-center" style={{ padding: '80px 0' }}>
              <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
              <p style={{ marginTop: '10px', color: '#888' }}>Loading causes...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="row text-center" style={{ padding: '80px 0' }}>
              <FaSearch style={{ fontSize: '42px', color: '#ccc', display: 'block', margin: '0 auto 15px' }} />
              <h3 style={{ fontSize: '18px', color: '#555' }}>No campaigns found</h3>
              <p style={{ color: '#888' }}>No active campaigns matched your filters.</p>
            </div>
          ) : (
            <div className="row">
              {filteredCampaigns.map((camp) => {
                const progressPercent = Math.min(100, Math.round((camp.amountRaised / camp.fundingGoal) * 100));
                const daysRemaining = Math.max(0, Math.ceil((new Date(camp.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                
                return (
                  <div key={camp._id} className="col-lg-4 col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: '40px' }}>
                    <div className="cause-layout-1" style={{ border: '1px solid #eee', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                      
                      <figure className="cause-img" style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                        <img 
                          src={camp.imageUrl} 
                          alt={camp.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#7cb032', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '2px', textTransform: 'uppercase' }}>
                          {camp.category}
                        </span>
                      </figure>

                      <div className="fund-info" style={{ padding: '15px 20px', borderBottom: '1px solid #f9f9f9' }}>
                        <div className="fund-item-text" style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="fund-goal-text"><strong>GOAL:</strong> {camp.fundingGoal} cr</span>
                          <span style={{ background: '#7cb032', color: '#fff', padding: '2px 6px', fontSize: '9px', fontWeight: 'bold', borderRadius: '2px' }}>{progressPercent}%</span>
                          <span className="fund-raised-text"><strong>RAISED:</strong> {camp.amountRaised} cr</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="progress" style={{ height: '6px', margin: '10px 0 0 0', background: '#e0e0e0' }}>
                          <div 
                            className="progress-bar" 
                            style={{ width: `${progressPercent}%`, background: '#7cb032' }}
                          ></div>
                        </div>
                      </div>

                      <div className="cause-content text-center" style={{ padding: '20px' }}>
                        <h5 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                          <Link href={camp._id.startsWith('fallback') ? '/explore' : `/campaign/${camp._id}`} style={{ color: '#333' }}>{camp.title}</Link>
                        </h5>
                        <p style={{ fontSize: '12px', color: '#777', height: '54px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                          {camp.story}
                        </p>
                        
                        <div style={{ fontSize: '11px', color: '#999', display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaUser style={{ color: '#7cb032' }} /> By {camp.creatorName}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FaClock style={{ color: '#7cb032' }} /> {daysRemaining} days left
                          </span>
                        </div>

                        <div className="clearfix">
                          <Link className="btn btn-theme text-uppercase" href={camp._id.startsWith('fallback') ? '/explore' : `/campaign/${camp._id}`} style={{ width: '100%', display: 'block' }}>
                            View details
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
