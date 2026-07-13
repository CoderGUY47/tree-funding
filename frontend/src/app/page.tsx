'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/utils/api';
import { 
  FaInfoCircle, 
  FaHeart, 
  FaUsers, 
  FaBriefcase, 
  FaExclamationTriangle, 
  FaBullseye, 
  FaCoins, 
  FaLeaf, 
  FaArrowRight, 
  FaCalendarAlt, 
  FaAngleDoubleRight, 
  FaHandPeace, 
  FaTrophy,
  FaFileAlt
} from 'react-icons/fa';

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
    _id: 'fallback_1',
    title: 'Support Stray Children & Local Orphanages',
    story: 'This campaign is designed to support stray children and local orphanages who have no one. Contributions will provide fresh meals, warm clothes, textbooks, and shelter infrastructure to help kids build a safe, hopeful future.',
    fundingGoal: 15000,
    amountRaised: 4200,
    imageUrl: '/images/cause_1.jpg',
    category: 'Humanitarian',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_2',
    title: 'Feed the Hungry: Community Food Shelter',
    story: 'Help us keep local food shelters and community kitchens stocked. This campaign supplies healthy ingredients, warm meals, and basic hygienic products directly to shelterless individuals and families in need.',
    fundingGoal: 8000,
    amountRaised: 6000,
    imageUrl: '/images/cause_2.jpg',
    category: 'Social Care',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_3',
    title: 'Care and Support for Shelterless Elderly',
    story: 'Empower our community workers to provide medical checkups, nutritious food packages, warm blankets, and housing support for abandoned elder citizens who have no families to look after them.',
    fundingGoal: 12000,
    amountRaised: 8900,
    imageUrl: '/images/cause_3.jpg',
    category: 'Humanitarian',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_4',
    title: 'Clean Water Tube Wells for Arid Villages',
    story: 'Help construct deep-water tube wells to provide clean, arsenic-free drinking water to remote agrarian villages, protecting thousands of families from waterborne diseases.',
    fundingGoal: 9500,
    amountRaised: 5300,
    imageUrl: '/images/event_1.jpg',
    category: 'Other',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_5',
    title: 'Empower Orphan Education & Textbooks',
    story: 'Provide primary school textbooks, bags, tuition support, and uniform materials to orphan students attending local community schools in rural areas.',
    fundingGoal: 6500,
    amountRaised: 3900,
    imageUrl: '/images/event_2.jpg',
    category: 'Humanitarian',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_6',
    title: 'Mobile Medical Health Clinics',
    story: 'Deploy a fully equipped mobile medical clinic van offering free standard diagnostic checks, basic checkups, and necessary medicines to low-income farming families.',
    fundingGoal: 14000,
    amountRaised: 7200,
    imageUrl: '/images/event_3.jpg',
    category: 'Other',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_7',
    title: 'Emergency Aid: Flood Rations & Kits',
    story: 'Provide urgent food packages (rice, lentils, oil), water purification tablets, and clean shelter kits to rural families displaced by recent river floods.',
    fundingGoal: 10000,
    amountRaised: 9400,
    imageUrl: '/images/cause_2.jpg',
    category: 'Social Care',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_8',
    title: 'Protect Coastal Wildlife & Nesting Grounds',
    story: 'Fund coastal patrols to clean plastic debris and protect endangered marine turtle nesting grounds along sandy coastal tourist regions.',
    fundingGoal: 7000,
    amountRaised: 3400,
    imageUrl: '/images/cause_1.jpg',
    category: 'Forestry',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_9',
    title: 'Reforest Dryland Community Lands',
    story: 'Support planting 10,000 native and fruit-bearing trees on drylands to mitigate soil degradation, improve air quality, and provide sustainable income sources for local residents.',
    fundingGoal: 11000,
    amountRaised: 8100,
    imageUrl: '/images/cause_3.jpg',
    category: 'Reforestation',
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fallback_10',
    title: 'Clean Solar Microgrids for Rural Classrooms',
    story: 'Provide off-grid rural schools with clean solar energy panel installations to power basic lighting, fans, and digital learning devices.',
    fundingGoal: 8500,
    amountRaised: 6200,
    imageUrl: '/images/event_1.jpg',
    category: 'Solar',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  }
];

export default function Homepage() {
  const [topCampaigns, setTopCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Carousel slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: '/images/home_1_slider_1.jpg',
      title: 'YOUR SMALL DONATION CAN BRING HUGE SMILE',
      subtitle: "Support stray kids, local orphanages, and shelterless families. We ensure direct crowdfunding backing for those who have no one.",
    },
    {
      image: '/images/home_1_slider_2.jpg',
      title: 'EMPOWER LIVES AND SUSTAIN COMMUNITIES',
      subtitle: 'From local community shelters and food banks to micro solar grids and tree planting campaigns globally.',
    }
  ];

  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        const res = await api.get('/campaigns');
        const activeAndApproved = res.data.campaigns
          .filter((c: any) => c.status === 'approved' && new Date(c.deadline) > new Date())
          .slice(0, 6);
        
        if (activeAndApproved.length > 0) {
          setTopCampaigns(activeAndApproved);
        } else {
          setTopCampaigns(defaultFallbackCampaigns);
        }
      } catch (err) {
        console.error('Error fetching campaigns on homepage, using default fallback data:', err);
        setTopCampaigns(defaultFallbackCampaigns);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCampaigns();
  }, []);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <Navbar />

      {/* HERO BANNER SLIDESHOW */}
      <section 
        className="section-banner" 
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url(${slides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.8s ease-in-out',
          minHeight: '550px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="banner-content" style={{ animation: 'fadeInUp 1s' }}>
                <h2 style={{ color: '#fff', fontSize: '42px', fontWeight: 800, lineHeight: '1.2' }}>
                  {slides[currentSlide].title}
                </h2>
                <h3 style={{ color: '#eee', fontSize: '18px', marginTop: '15px', fontWeight: 400, lineHeight: '1.6' }}>
                  {slides[currentSlide].subtitle}
                </h3>
                <div className="slider-button" style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                  <Link href="/explore" className="btn btn-custom" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FaInfoCircle /> Learn More
                  </Link>
                  <Link href="/explore" className="btn btn-custom-inverse" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FaHeart /> Donate Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / HIGHLIGHTS SECTION */}
      <section className="section-content-block">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div className="section-heading-wrapper no-padding">
                <h2>Our <span>Mission</span></h2>
                <hr />
                <p className="margin-top-20" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  TreeFund is dedicated to protecting environmental ecosystems and promoting local green solutions worldwide.
                  By linking creators with global supporters, we provide a safe ledger to raise credits for forest restoration, tree planting, solar microgrids, and local organic gardens.
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.8' }}>
                  Since our launch, we have consistent safety nets for hundreds of micro-forestry teams and backers, ensuring all funds are tracked securely.
                </p>
                <div className="info-separotor" style={{ marginTop: '20px' }}>
                  <img src="/images/signature.png" alt="Signature" />
                  <p style={{ marginTop: '10px' }}>
                    <strong>Brandon Munson</strong> <br />CEO, TreeFund Association
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <img src="/images/volunteers.jpg" alt="Volunteers" className="img-responsive" style={{ borderRadius: '4px' }} />
            </div>
          </div>

          <div className="row no-gutter margin-top-30">
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div className="about-highlight-1" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '32px', color: '#7cb032', marginTop: '5px' }}><FaUsers /></div>
                <div className="about-content">
                  <h3><Link href="/register">Join Supporters</Link></h3>
                  <p className="about-text">Convert cash into credits and support tree plantation or green projects that make an immediate climate impact.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div className="about-highlight-1 about-featured-block" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '32px', color: '#fff', marginTop: '5px' }}><FaHeart /></div>
                <div className="about-content">
                  <h3><Link href="/register">Create Campaigns</Link></h3>
                  <p className="about-text">Share your tree-planting story, outline target milestones, receive backer credits, and request secure cash payouts.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div className="about-highlight-1" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '32px', color: '#7cb032', marginTop: '5px' }}><FaBriefcase /></div>
                <div className="about-content">
                  <h3><Link href="/explore">Help & Support</Link></h3>
                  <p className="about-text">All donations are secured. Creators receive credits only when their contributions are approved, ensuring absolute transparency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* URGENT / FEATURED CAUSE SECTION */}
      <section className="section-content-block section-secondary-bg">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <figure className="urget-cause-image">
                <img src="/images/about-us.jpg" alt="Activity Banner" className="img-responsive" style={{ borderRadius: '4px' }} />
              </figure>
            </div>

            <div className="col-md-5">
              <div className="urgent-cause">
                <div className="cause-content">
                  <div className="cause-text">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaExclamationTriangle style={{ color: '#7cb032' }} /> URGENT <span>CAUSE</span>
                    </h4>
                    <hr />
                    <h2 className="margin-top-11">
                      <Link href="/explore">Save Reforestation Grids</Link>
                    </h2>
                    <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#666' }}>
                      Support our primary mission to plant 100,000 seedlings in damaged areas. This campaign serves as the flagship initiative of the current quarter.
                    </p>
                  </div>

                  <div className="row" style={{ marginTop: '20px' }}>
                    <div className="col-sm-12">
                      <div className="fund-item-text clearfix" style={{ fontSize: '11px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBullseye /> TARGET: 10,000 Credits</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaCoins /> RAISED: 7,500 Credits</span>
                      </div>
                      <div className="progress" style={{ height: '10px', marginTop: '5px', background: '#e0e0e0' }}>
                        <div 
                          style={{ width: '75%', background: '#7cb032' }} 
                          role="progressbar" 
                          className="progress-bar"
                        ></div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '11px', color: '#7cb032', fontWeight: 'bold' }}>75% Funded</div>
                    </div>
                    
                    <div className="col-sm-12 clearfix" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                      <Link className="btn btn-pure-dark-bg" href="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><FaInfoCircle /> View Details</Link>
                      <Link className="btn btn-theme pull-right" href="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><FaHeart /> Donate Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* ACTIVE CAUSES (CAMPAIGNS FROM DATABASE OR LOCAL FALLBACK) */}
      <section className="section-content-block">
        <div className="container">
          <div className="row section-heading-wrapper">
            <div className="col-md-12 col-sm-12 text-center">
              <h2>Active <span>Causes</span></h2>
              <h4>Provide integrated support for environmental campaigns.</h4>
            </div>
          </div>

          {loading ? (
            <div className="row text-center" style={{ padding: '60px 0' }}>
              <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
              <p style={{ marginTop: '10px', color: '#888' }}>Loading verified campaigns...</p>
            </div>
          ) : topCampaigns.length === 0 ? (
            <div className="row text-center" style={{ padding: '60px 0' }}>
              <FaInfoCircle style={{ fontSize: '36px', color: '#ccc', display: 'block', margin: '0 auto 15px' }} />
              <h3 style={{ fontSize: '16px', color: '#555' }}>No campaigns found</h3>
              <p style={{ color: '#888' }}>There are no active approved campaigns available at the moment.</p>
            </div>
          ) : (
            <div className="row">
              {topCampaigns.map(camp => {
                const progressPercent = Math.min(100, Math.round((camp.amountRaised / camp.fundingGoal) * 100));
                return (
                  <div key={camp._id} className="col-lg-4 col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: '30px' }}>
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
                          <span className="fund-goal-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaBullseye style={{ color: '#7cb032' }} /> <strong>GOAL:</strong> {camp.fundingGoal} cr
                          </span>
                          <span style={{ background: '#7cb032', color: '#fff', padding: '2px 6px', fontSize: '9px', fontWeight: 'bold', borderRadius: '2px' }}>{progressPercent}%</span>
                          <span className="fund-raised-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaLeaf style={{ color: '#7cb032' }} /> <strong>RAISED:</strong> {camp.amountRaised} cr
                          </span>
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
                        <div className="clearfix">
                          <Link className="btn btn-theme text-uppercase" href={camp._id.startsWith('fallback') ? '/explore' : `/campaign/${camp._id}`} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <FaArrowRight /> View details
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

      {/* STATS COUNTERS SECTION (WHITE ICONS ON GREEN BG BOXES) */}
      <section className="section-content-block section-counter section-black-bg-overlay" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.85)), url('/images/home_1_slider_1.jpg')", backgroundSize: 'cover', backgroundAttachment: 'fixed', color: '#fff', padding: '60px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="counter-block-1 text-center">
                <span className="counter-icon" style={{ fontSize: '42px', color: '#fff', display: 'block', marginBottom: '10px' }}><FaUsers /></span>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Volunteers</h4>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>2,019</span>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="counter-block-1 text-center">
                <span className="counter-icon" style={{ fontSize: '42px', color: '#fff', display: 'block', marginBottom: '10px' }}><FaFileAlt /></span>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Campaigns</h4>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>5,061</span>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="counter-block-1 text-center">
                <span className="counter-icon" style={{ fontSize: '42px', color: '#fff', display: 'block', marginBottom: '10px' }}><FaHandPeace /></span>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Donors</h4>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>3,910</span>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="counter-block-1 text-center">
                <span className="counter-icon" style={{ fontSize: '42px', color: '#fff', display: 'block', marginBottom: '10px' }}><FaTrophy /></span>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Awards</h4>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>1,910</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS WIDGET */}
      <section className="section-content-block">
        <div className="container">
          <div className="row section-heading-wrapper">
            <div className="col-md-12 col-sm-12 text-center">
              <h2>Upcoming <span>Events</span></h2>
              <h4>Reforestation events and environment community training sessions.</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div className="event-wrapper-1" style={{ border: '1px solid #eee', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                <figure className="event-img" style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img src="/images/event_1.jpg" alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="event-date" style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaCalendarAlt /> 15 Sep 2026
                  </div>
                </figure>
                <div className="event-content" style={{ padding: '20px' }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}><a href="#" style={{ color: '#333' }}>Bring Seedlings to Life</a></h5>
                  <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: '0 0 15px 0' }}>Join our group tree planting session as we plant local tree saplings in degraded river beds.</p>
                  <span className="btn-read-more"><a href="#" style={{ fontSize: '12px', fontWeight: 'bold', color: '#7cb032', display: 'flex', alignItems: 'center', gap: '3px' }}>Read More <FaAngleDoubleRight /></a></span>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div className="event-wrapper-1" style={{ border: '1px solid #eee', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                <figure className="event-img" style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img src="/images/event_2.jpg" alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="event-date" style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaCalendarAlt /> 25 Sep 2026
                  </div>
                </figure>
                <div className="event-content" style={{ padding: '20px' }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}><a href="#" style={{ color: '#333' }}>Community Solar Meeting</a></h5>
                  <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: '0 0 15px 0' }}>Learn how your community can benefit from solar microgrid power sharing options.</p>
                  <span className="btn-read-more"><a href="#" style={{ fontSize: '12px', fontWeight: 'bold', color: '#7cb032', display: 'flex', alignItems: 'center', gap: '3px' }}>Read More <FaAngleDoubleRight /></a></span>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div className="event-wrapper-1" style={{ border: '1px solid #eee', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                <figure className="event-img" style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img src="/images/event_3.jpg" alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="event-date" style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaCalendarAlt /> 20 Oct 2026
                  </div>
                </figure>
                <div className="event-content" style={{ padding: '20px' }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}><a href="#" style={{ color: '#333' }}>Sustainability Charity Concert</a></h5>
                  <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6', margin: '0 0 15px 0' }}>Support environmental awareness through live acoustic and folk music celebrations.</p>
                  <span className="btn-read-more"><a href="#" style={{ fontSize: '12px', fontWeight: 'bold', color: '#7cb032', display: 'flex', alignItems: 'center', gap: '3px' }}>Read More <FaAngleDoubleRight /></a></span>
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
