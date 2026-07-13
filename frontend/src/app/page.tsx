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
  FaFileAlt,
  FaChevronRight,
  FaChevronLeft
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
    amountRaised: 14200,
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
    amountRaised: 7900,
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
    amountRaised: 10900,
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
    amountRaised: 9300,
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
    amountRaised: 6100,
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
    amountRaised: 12200,
    imageUrl: '/images/event_3.jpg',
    category: 'Other',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Supporter Backer',
    photo: '/images/cause_1.jpg',
    quote: 'TreeFund allowed me to convert my spare credits directly into planting saplings. The transparency in milestone approvals is game-changing.'
  },
  {
    id: 2,
    name: 'David Atwood',
    role: 'Solar Project Lead',
    photo: '/images/cause_2.jpg',
    quote: 'As a creator, raising funds for dryland microgrids was seamless. Backers verified our progress, and we withdrew funds securely.'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Wildlife Activist',
    photo: '/images/cause_3.jpg',
    quote: 'The direct contact between supporters and creators makes this platform feel like a real community committed to environmental progress.'
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
      title: 'Back Reforestation Grids & Plant Saplings',
      subtitle: "Support local micro-forestry teams and backers. We ensure direct crowdfunding backing to restore forest coverage worldwide.",
    },
    {
      image: '/images/home_1_slider_2.jpg',
      title: 'Empower Lives and Clean Solar Communities',
      subtitle: 'From local community shelters and food banks to micro solar grid installations for off-grid agrarian classrooms.',
    },
    {
      image: '/images/volunteers.jpg',
      title: 'Protect Marine Habitats and Coastal Wildlife',
      subtitle: 'Provide funding to clean coastal debris, restore sandbanks, and save nesting grounds for local wildlife and ecological protection.',
    }
  ];

  // Testimonials Carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        const res = await api.get('/campaigns');
        const activeAndApproved = res.data.campaigns
          .filter((c: any) => c.status === 'approved')
          // Sort by amount raised descending (top campaigns)
          .sort((a: any, b: any) => b.amountRaised - a.amountRaised)
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

  // Auto slide banner effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Auto slide testimonials effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <Navbar />

      {/* HERO BANNER SLIDESHOW */}
      <section 
        className="section-banner" 
        style={{
          minHeight: '100vh',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Slides Images list using object-fit: cover */}
        {slides.map((slide, idx) => (
          <img
            key={idx}
            src={slide.image}
            alt={slide.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: currentSlide === idx ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: 0
            }}
          />
        ))}

        {/* Gradient Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65))',
            zIndex: 1
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row">
            <div className="col-md-9 col-sm-12">
              <div className="banner-content" style={{ animation: 'fadeInUp 1s', textAlign: 'left' }}>
                <h1 style={{ color: '#fff', fontSize: '54px', fontWeight: 900, lineHeight: '1.15', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                  {slides[currentSlide].title}
                </h1>
                <p style={{ color: '#f0f0f0', fontSize: '18px', marginTop: '20px', fontWeight: 300, lineHeight: '1.6', maxWidth: '700px' }}>
                  {slides[currentSlide].subtitle}
                </p>
                <div className="slider-button" style={{ marginTop: '35px', display: 'flex', gap: '15px' }}>
                  <Link href="/explore" className="hero-btn hero-btn-green">
                    Explore Projects <FaArrowRight />
                  </Link>
                  <Link href="/register" className="hero-btn hero-btn-white">
                    Start Funding <FaHeart style={{ color: '#7cb032' }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div style={{ position: 'absolute', bottom: '30px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 10 }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: currentSlide === index ? '#7cb032' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 1: HOW IT WORKS (EXTRA SECTION 1) */}
      <section className="section-content-block" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="row section-heading-wrapper" style={{ marginBottom: '50px' }}>
            <div className="col-md-12 text-center">
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                How <span>TreeFund</span> Works
              </h2>
              <p style={{ color: '#888', fontSize: '14px', maxWidth: '600px', margin: '10px auto 0 auto' }}>
                Our micro-donations ledger facilitates secure credits funding and transparent verification in three simple steps.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 col-sm-12 text-center" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '25px 20px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fafafa', minHeight: '390px', transition: 'all 0.3s' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#eaf4db', color: '#7cb032', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', margin: '0 auto 15px' }}>
                  1
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400" 
                  alt="Create or Browse"
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }}
                />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Create or Browse</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                  Creators outline environmental milestones and launch campaigns. Supporters browse verified active campaigns.
                </p>
              </div>
            </div>

            <div className="col-md-4 col-sm-12 text-center" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '25px 20px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fafafa', minHeight: '390px', transition: 'all 0.3s' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#eaf4db', color: '#7cb032', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', margin: '0 auto 15px' }}>
                  2
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400" 
                  alt="Pledge Wallet Credits"
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }}
                />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Pledge Wallet Credits</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                  Supporters purchase platform credits and pledge them directly toward environmental projects.
                </p>
              </div>
            </div>

            <div className="col-md-4 col-sm-12 text-center" style={{ marginBottom: '30px' }}>
              <div style={{ padding: '25px 20px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fafafa', minHeight: '390px', transition: 'all 0.3s' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#eaf4db', color: '#7cb032', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', margin: '0 auto 15px' }}>
                  3
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400" 
                  alt="Verify & Payout"
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '15px' }}
                />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Verify & Payout</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                  Once the community verifies milestones, the platform approves payout withdrawals to fund forestry actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP FUNDED CAMPAIGNS (KICKSTARTER CARD STYLE) */}
      <section className="section-content-block" style={{ padding: '80px 0', background: '#fdfdfd', borderTop: '1px solid #f5f5f5' }}>
        <div className="container">
          <div className="row section-heading-wrapper" style={{ marginBottom: '50px' }}>
            <div className="col-md-12 text-center">
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                Top Funded <span>Campaigns</span>
              </h2>
              <p style={{ color: '#888', fontSize: '14px', maxWidth: '600px', margin: '10px auto 0 auto' }}>
                Explore the highest backed active environmental campaigns supported by our global community.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="row text-center" style={{ padding: '60px 0' }}>
              <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
              <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading top campaigns...</p>
            </div>
          ) : (
            <div className="row">
              {topCampaigns.map(camp => {
                const progressPercent = Math.min(100, Math.round((camp.amountRaised / camp.fundingGoal) * 100));
                return (
                  <div key={camp._id} className="col-lg-4 col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: '35px' }}>
                    {/* Kickstarter Grid Card */}
                    <div className="cause-card" style={{ border: '1px solid #eee', background: '#fff', borderRadius: '6px', overflow: 'hidden', transition: 'all 0.3s ease-in-out', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      
                      {/* Image Frame */}
                      <figure style={{ height: '220px', overflow: 'hidden', position: 'relative', margin: 0 }}>
                        <img 
                          src={camp.imageUrl} 
                          alt={camp.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#7cb032', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {camp.category}
                        </span>
                      </figure>

                      {/* Progress Bar Frame */}
                      <div style={{ padding: '20px 20px 0 20px' }}>
                        <div className="progress" style={{ height: '6px', margin: 0, background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            className="progress-bar" 
                            style={{ width: `${progressPercent}%`, background: '#7cb032', height: '100%', borderRadius: '4px' }}
                          ></div>
                        </div>
                      </div>

                      {/* Content Frame */}
                      <div style={{ padding: '15px 20px 20px 20px' }}>
                        {/* Metrics Panel */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', display: 'block' }}>
                              {camp.amountRaised.toLocaleString()} cr
                            </span>
                            <span style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold' }}>Raised ({progressPercent}%)</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555', display: 'block' }}>
                              {camp.fundingGoal.toLocaleString()} cr
                            </span>
                            <span style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold' }}>Goal Target</span>
                          </div>
                        </div>

                        <h3 style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: 'bold', height: '48px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' }}>
                          <Link href={camp._id.startsWith('fallback') ? '/explore' : `/campaign/${camp._id}`} style={{ color: '#222', textDecoration: 'none', transition: 'color 0.2s' }}>
                            {camp.title}
                          </Link>
                        </h3>

                        <p style={{ fontSize: '12px', color: '#666', height: '54px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                          {camp.story}
                        </p>

                        <div style={{ borderTop: '1px solid #f5f5f5', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#888' }}>
                            By <strong style={{ color: '#333' }}>{camp.creatorName}</strong>
                          </span>
                          <Link className="btn btn-theme" href={camp._id.startsWith('fallback') ? '/explore' : `/campaign/${camp._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold', padding: '6px 15px', borderRadius: '3px', background: '#7cb032', borderColor: '#7cb032', color: '#fff' }}>
                            View Project <FaArrowRight />
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

      {/* SECTION 2: EXPLORE BY CATEGORY (EXTRA SECTION 2) */}
      <section className="section-content-block" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="row section-heading-wrapper" style={{ marginBottom: '50px' }}>
            <div className="col-md-12 text-center">
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                Explore by <span>Category</span>
              </h2>
              <p style={{ color: '#888', fontSize: '14px', maxWidth: '600px', margin: '10px auto 0 auto' }}>
                Filter green initiatives and back specific categories that match your vision for climate sustainability.
              </p>
            </div>
          </div>

          <div className="row">
            {/* Category 1 */}
            <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
              <Link href="/explore" style={{ textDecoration: 'none' }}>
                <div 
                  className="category-card" 
                  style={{ 
                    border: 'none', 
                    borderRadius: '6px', 
                    padding: '30px 20px', 
                    textAlign: 'center', 
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaLeaf style={{ fontSize: '28px', color: '#7cb032', marginBottom: '15px' }} />
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Reforestation</h4>
                  <span style={{ fontSize: '11px', color: '#eee', marginTop: '5px', display: 'block' }}>Saplings & Woodlands</span>
                </div>
              </Link>
            </div>

            {/* Category 2 */}
            <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
              <Link href="/explore" style={{ textDecoration: 'none' }}>
                <div 
                  className="category-card" 
                  style={{ 
                    border: 'none', 
                    borderRadius: '6px', 
                    padding: '30px 20px', 
                    textAlign: 'center', 
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaCoins style={{ fontSize: '28px', color: '#7cb032', marginBottom: '15px' }} />
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Solar Power</h4>
                  <span style={{ fontSize: '11px', color: '#eee', marginTop: '5px', display: 'block' }}>Microgrids & Cells</span>
                </div>
              </Link>
            </div>

            {/* Category 3 */}
            <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
              <Link href="/explore" style={{ textDecoration: 'none' }}>
                <div 
                  className="category-card" 
                  style={{ 
                    border: 'none', 
                    borderRadius: '6px', 
                    padding: '30px 20px', 
                    textAlign: 'center', 
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaUsers style={{ fontSize: '28px', color: '#7cb032', marginBottom: '15px' }} />
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Humanitarian</h4>
                  <span style={{ fontSize: '11px', color: '#eee', marginTop: '5px', display: 'block' }}>Community Rations</span>
                </div>
              </Link>
            </div>

            {/* Category 4 */}
            <div className="col-md-3 col-sm-6" style={{ marginBottom: '20px' }}>
              <Link href="/explore" style={{ textDecoration: 'none' }}>
                <div 
                  className="category-card" 
                  style={{ 
                    border: 'none', 
                    borderRadius: '6px', 
                    padding: '30px 20px', 
                    textAlign: 'center', 
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    color: '#fff',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaBriefcase style={{ fontSize: '28px', color: '#7cb032', marginBottom: '15px' }} />
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Social Forestry</h4>
                  <span style={{ fontSize: '11px', color: '#eee', marginTop: '5px', display: 'block' }}>Arid Land Grids</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: IMPACT IN NUMBERS (EXTRA SECTION 3) */}
      <section className="section-content-block section-counter section-black-bg-overlay" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200')", backgroundSize: 'cover', backgroundAttachment: 'fixed', color: '#fff', padding: '80px 0' }}>
        <div className="container">
          <div className="row section-heading-wrapper" style={{ marginBottom: '45px' }}>
            <div className="col-md-12 text-center">
              <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}>Our <span>Climate</span> Impact</h2>
              <p style={{ color: '#ccc', fontSize: '13px', marginTop: '10px' }}>Every credit contributed translates directly to active environmental outcomes.</p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ marginBottom: '20px' }}>
              <div className="counter-block-1 text-center">
                <span className="counter-icon" style={{ fontSize: '42px', color: '#7cb032', display: 'block', marginBottom: '10px' }}><FaUsers /></span>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#ddd' }}>Active Volunteers</h4>
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>2,450+</span>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ marginBottom: '20px' }}>
              <div className="counter-block-1 text-center">
                <span className="counter-icon" style={{ fontSize: '42px', color: '#7cb032', display: 'block', marginBottom: '10px' }}><FaFileAlt /></span>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#ddd' }}>Green Campaigns</h4>
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>150+</span>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ marginBottom: '20px' }}>
              <div className="counter-block-1 text-center">
                <span className="counter-icon" style={{ fontSize: '42px', color: '#7cb032', display: 'block', marginBottom: '10px' }}><FaHandPeace /></span>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#ddd' }}>Global Donors</h4>
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>5,200+</span>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" style={{ marginBottom: '20px' }}>
              <div className="counter-block-1 text-center">
                <span className="counter-icon" style={{ fontSize: '42px', color: '#7cb032', display: 'block', marginBottom: '10px' }}><FaTrophy /></span>
                <h4 style={{ margin: '10px 0 5px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#ddd' }}>Forestry Awards</h4>
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>12+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATIC TESTIMONIALS SLIDER SECTION */}
      <section className="section-content-block" style={{ padding: '80px 0', background: '#fafafa', borderBottom: '1px solid #eee' }}>
        <div className="container">
          <div className="row section-heading-wrapper" style={{ marginBottom: '50px' }}>
            <div className="col-md-12 text-center">
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                Community <span>Testimonials</span>
              </h2>
              <p style={{ color: '#888', fontSize: '14px', maxWidth: '600px', margin: '10px auto 0 auto' }}>
                Read reviews from verified creators and supporters who make a difference every day.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-sm-12 text-center">
              {/* Testimonials Frame */}
              <div style={{ background: '#fff', border: '1px solid #eee', padding: '40px 30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', position: 'relative', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                
                {/* Quote details */}
                <p style={{ fontSize: '15px', color: '#555', fontStyle: 'italic', lineHeight: '1.8', margin: '0 0 25px 0' }}>
                  "{testimonials[currentTestimonial].quote}"
                </p>

                {/* Author Frame */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <img 
                    src={testimonials[currentTestimonial].photo} 
                    alt={testimonials[currentTestimonial].name}
                    style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7cb032' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <h5 style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{testimonials[currentTestimonial].name}</h5>
                    <span style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{testimonials[currentTestimonial].role}</span>
                  </div>
                </div>

                {/* Slider Controls */}
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '-20px', right: '-20px', display: 'flex', justifyContent: 'space-between', width: 'calc(100% + 40px)', pointerEvents: 'none' }}>
                  <button 
                    onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                    style={{ pointerEvents: 'auto', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', outline: 'none' }}
                    aria-label="Previous Testimonial"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                    style={{ pointerEvents: 'auto', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', outline: 'none' }}
                    aria-label="Next Testimonial"
                  >
                    <FaChevronRight />
                  </button>
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
