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
  FaChevronLeft,
  FaQuoteLeft,
  FaStar
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
        setTopCampaigns(defaultFallbackCampaigns);
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
    <div className="bg-zinc-50 font-sans min-h-screen flex flex-col">
      <Navbar />

      {/* HERO BANNER SLIDESHOW */}
      <section className="h-screen min-h-[600px] flex items-center relative overflow-hidden">
        {/* Slides Images list using object-fit: cover */}
        {slides.map((slide, idx) => (
          <img
            key={idx}
            src={slide.image}
            alt={slide.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-0 scale-105' : 'opacity-0 -z-10'
            }`}
            style={{ transitionProperty: 'opacity, transform' }}
          />
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        <div className="container mx-auto px-4 max-w-6xl relative z-20">
          <div className="max-w-3xl text-left">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight m-0 text-shadow">
              {slides[currentSlide].title}
            </h1>
            <p className="text-zinc-200 text-base sm:text-lg md:text-xl mt-6 font-light leading-relaxed max-w-2xl">
              {slides[currentSlide].subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link 
                href="/explore" 
                className="h-12 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 no-underline transition-all shadow-md shadow-emerald-600/20"
              >
                Explore Projects <FaArrowRight />
              </Link>
              <Link 
                href="/register" 
                className="h-12 px-6 rounded-lg bg-white/10 hover:bg-white text-white hover:text-emerald-600 border-2 border-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 no-underline transition-all"
              >
                Start Funding <FaHeart className="text-emerald-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2.5 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-300 ${
                currentSlide === index ? 'bg-emerald-500 w-8' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 1: HOW IT WORKS (EXTRA SECTION 1) */}
      <section className="bg-white py-24 border-b border-zinc-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight m-0">
              How <span className="text-emerald-600">TreeFund</span> Works
            </h2>
            <p className="text-zinc-400 text-sm mt-3.5 max-w-lg mx-auto font-medium">
              Our micro-donations ledger facilitates secure credits funding and transparent verification in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6.5 text-center flex flex-col items-center hover:translate-y-[-5px] transition-transform duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-black mb-5">
                1
              </div>
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400" 
                alt="Create or Browse"
                className="w-full h-40 object-cover rounded-xl mb-5 shadow-xs"
              />
              <h3 className="text-base font-bold text-zinc-900 mb-2">Create or Browse</h3>
              <p className="text-xs text-zinc-500 leading-relaxed m-0">
                Creators outline environmental milestones and launch campaigns. Supporters browse verified active campaigns.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6.5 text-center flex flex-col items-center hover:translate-y-[-5px] transition-transform duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-black mb-5">
                2
              </div>
              <img 
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400" 
                alt="Pledge Wallet Credits"
                className="w-full h-40 object-cover rounded-xl mb-5 shadow-xs"
              />
              <h3 className="text-base font-bold text-zinc-900 mb-2">Pledge Wallet Credits</h3>
              <p className="text-xs text-zinc-500 leading-relaxed m-0">
                Supporters purchase platform credits and pledge them directly toward environmental projects.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-6.5 text-center flex flex-col items-center hover:translate-y-[-5px] transition-transform duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-black mb-5">
                3
              </div>
              <img 
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400" 
                alt="Verify & Payout"
                className="w-full h-40 object-cover rounded-xl mb-5 shadow-xs"
              />
              <h3 className="text-base font-bold text-zinc-900 mb-2">Verify & Payout</h3>
              <p className="text-xs text-zinc-500 leading-relaxed m-0">
                Once the community verifies milestones, the platform approves payout withdrawals to fund forestry actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP FUNDED CAMPAIGNS (KICKSTARTER CARD STYLE) */}
      <section className="bg-zinc-50 py-24 border-b border-zinc-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight m-0">
              Top Funded <span className="text-emerald-600">Campaigns</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-3.5 max-w-lg mx-auto font-medium">
              Explore the highest backed active environmental campaigns supported by our global community.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
              <p className="mt-3.5 text-zinc-400 text-xs font-bold">Loading top campaigns...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
              {topCampaigns.map(camp => {
                const progressPercent = Math.min(100, Math.round((camp.amountRaised / camp.fundingGoal) * 100));
                return (
                  <div key={camp._id} className="border border-zinc-200 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
                    
                    {/* Cover Frame */}
                    <div className="h-48 relative overflow-hidden bg-zinc-100 shrink-0">
                      <img 
                        src={camp.imageUrl} 
                        alt={camp.title} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                        {camp.category}
                      </span>
                    </div>

                    {/* Progress Bar Frame */}
                    <div className="px-5 pt-5 pb-1">
                      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Content Frame */}
                    <div className="px-5 pb-5 pt-3 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Metrics Panel */}
                        <div className="flex justify-between items-center mb-4 text-left">
                          <div>
                            <span className="text-sm font-black text-zinc-900 block leading-tight">
                              {camp.amountRaised.toLocaleString()} cr
                            </span>
                            <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider">Raised ({progressPercent}%)</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-zinc-700 block leading-tight">
                              {camp.fundingGoal.toLocaleString()} cr
                            </span>
                            <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider">Goal Target</span>
                          </div>
                        </div>

                        <h3 className="m-0 mb-2.5 text-base font-extrabold text-zinc-800 line-clamp-2 h-11 leading-snug">
                          <Link href={camp._id.startsWith('fallback') ? '/explore' : `/campaign/${camp._id}`} className="text-zinc-900 hover:text-emerald-600 no-underline transition-colors">
                            {camp.title}
                          </Link>
                        </h3>

                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 h-14 m-0 mb-5">
                          {camp.story}
                        </p>
                      </div>

                      <div className="border-t border-zinc-50 pt-4 flex justify-between items-center mt-auto">
                        <span className="text-[11px] text-zinc-500 font-medium">
                          By <strong className="text-zinc-800">{camp.creatorName}</strong>
                        </span>
                        <Link className="h-8 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1 border-none no-underline transition-colors" href={camp._id.startsWith('fallback') ? '/explore' : `/campaign/${camp._id}`}>
                          View Project <FaArrowRight className="text-[10px]" />
                        </Link>
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
      <section className="bg-white py-24 border-b border-zinc-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight m-0">
              Explore by <span className="text-emerald-600">Category</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-3.5 max-w-lg mx-auto font-medium">
              Filter green initiatives and back specific categories that match your vision for climate sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Category 1 */}
            <Link href="/explore" className="no-underline group">
              <div 
                className="rounded-2xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden h-40 text-white shadow-md hover:translate-y-[-5px] transition-transform duration-350"
                style={{ 
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <FaLeaf className="text-emerald-400 text-3xl mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-base font-bold text-white m-0">Reforestation</h4>
                <span className="text-[10px] text-zinc-300 mt-1 block">Saplings & Woodlands</span>
              </div>
            </Link>

            {/* Category 2 */}
            <Link href="/explore" className="no-underline group">
              <div 
                className="rounded-2xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden h-40 text-white shadow-md hover:translate-y-[-5px] transition-transform duration-355"
                style={{ 
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <FaCoins className="text-emerald-400 text-3xl mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-base font-bold text-white m-0">Solar Power</h4>
                <span className="text-[10px] text-zinc-300 mt-1 block">Microgrids & Cells</span>
              </div>
            </Link>

            {/* Category 3 */}
            <Link href="/explore" className="no-underline group">
              <div 
                className="rounded-2xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden h-40 text-white shadow-md hover:translate-y-[-5px] transition-transform duration-360"
                style={{ 
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <FaUsers className="text-emerald-400 text-3xl mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-base font-bold text-white m-0">Humanitarian</h4>
                <span className="text-[10px] text-zinc-300 mt-1 block">Community Rations</span>
              </div>
            </Link>

            {/* Category 4 */}
            <Link href="/explore" className="no-underline group">
              <div 
                className="rounded-2xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden h-40 text-white shadow-md hover:translate-y-[-5px] transition-transform duration-365"
                style={{ 
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <FaBriefcase className="text-emerald-400 text-3xl mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-base font-bold text-white m-0">Social Forestry</h4>
                <span className="text-[10px] text-zinc-300 mt-1 block">Arid Land Grids</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: IMPACT IN NUMBERS (EXTRA SECTION 3) */}
      <section 
        className="py-24 text-white relative overflow-hidden"
        style={{ 
          backgroundImage: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="mb-16">
            <h2 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight m-0">Our <span className="text-emerald-500">Climate</span> Impact</h2>
            <p className="text-zinc-300 text-sm mt-3">Every credit contributed translates directly to active environmental outcomes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Block 1 */}
            <div className="bg-emerald-600/90 border border-white/15 p-7.5 rounded-2xl text-center shadow-md flex flex-col items-center hover:bg-white hover:text-emerald-600 hover:translate-y-[-5px] transition-all duration-300 group">
              <span className="text-4xl text-white group-hover:text-emerald-600 mb-3 transition-colors"><FaUsers /></span>
              <h4 className="text-[11px] text-white/85 group-hover:text-zinc-500 uppercase font-black tracking-wider mb-2">Active Volunteers</h4>
              <span className="text-3xl font-black text-white group-hover:text-emerald-600">2,450+</span>
            </div>

            {/* Block 2 */}
            <div className="bg-emerald-600/90 border border-white/15 p-7.5 rounded-2xl text-center shadow-md flex flex-col items-center hover:bg-white hover:text-emerald-600 hover:translate-y-[-5px] transition-all duration-300 group">
              <span className="text-4xl text-white group-hover:text-emerald-600 mb-3 transition-colors"><FaFileAlt /></span>
              <h4 className="text-[11px] text-white/85 group-hover:text-zinc-500 uppercase font-black tracking-wider mb-2">Green Campaigns</h4>
              <span className="text-3xl font-black text-white group-hover:text-emerald-600">150+</span>
            </div>

            {/* Block 3 */}
            <div className="bg-emerald-600/90 border border-white/15 p-7.5 rounded-2xl text-center shadow-md flex flex-col items-center hover:bg-white hover:text-emerald-600 hover:translate-y-[-5px] transition-all duration-300 group">
              <span className="text-4xl text-white group-hover:text-emerald-600 mb-3 transition-colors"><FaHandPeace /></span>
              <h4 className="text-[11px] text-white/85 group-hover:text-zinc-500 uppercase font-black tracking-wider mb-2">Global Donors</h4>
              <span className="text-3xl font-black text-white group-hover:text-emerald-600">5,200+</span>
            </div>

            {/* Block 4 */}
            <div className="bg-emerald-600/90 border border-white/15 p-7.5 rounded-2xl text-center shadow-md flex flex-col items-center hover:bg-white hover:text-emerald-600 hover:translate-y-[-5px] transition-all duration-300 group">
              <span className="text-4xl text-white group-hover:text-emerald-600 mb-3 transition-colors"><FaTrophy /></span>
              <h4 className="text-[11px] text-white/85 group-hover:text-zinc-500 uppercase font-black tracking-wider mb-2">Forestry Awards</h4>
              <span className="text-3xl font-black text-white group-hover:text-emerald-600">12+</span>
            </div>

          </div>
        </div>
      </section>

      {/* STATIC TESTIMONIALS SLIDER SECTION */}
      <section className="bg-zinc-50 py-24 border-b border-zinc-200">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight m-0">
              Community <span className="text-emerald-600">Testimonials</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-3.5 max-w-lg mx-auto font-medium">
              Read reviews from verified creators and supporters who make a difference every day.
            </p>
          </div>

          <div className="flex justify-center mt-10">
            <div className="w-full max-w-2xl px-4 relative">
              <div className="bg-white border border-zinc-100 rounded-3xl p-10 shadow-lg relative flex flex-col items-center text-center">
                
                {/* Overlapping Reviewer Avatar */}
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <img 
                    src={testimonials[currentTestimonial].photo} 
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Star Ratings */}
                <div className="flex gap-1 justify-center mt-10 mb-5 text-emerald-500">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>

                {/* Quote details */}
                <p className="text-zinc-600 italic font-light text-base leading-relaxed max-w-xl mb-6">
                  "{testimonials[currentTestimonial].quote}"
                </p>

                {/* Reviewer Details */}
                <div className="text-center mb-5">
                  <h5 className="m-0 font-bold text-base text-zinc-900">{testimonials[currentTestimonial].name}</h5>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1.5 block">{testimonials[currentTestimonial].role}</span>
                </div>

                {/* Desktop controls (Arrows) */}
                <div className="hidden sm:flex absolute inset-y-0 left-4 right-4 items-center justify-between pointer-events-none">
                  <button 
                    onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-650 hover:bg-zinc-100 cursor-pointer flex items-center justify-center shadow-xs transition-colors pointer-events-auto"
                    aria-label="Previous Testimonial"
                  >
                    <FaChevronLeft className="text-sm" />
                  </button>
                  <button 
                    onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                    className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-650 hover:bg-zinc-100 cursor-pointer flex items-center justify-center shadow-xs transition-colors pointer-events-auto"
                    aria-label="Next Testimonial"
                  >
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>

                {/* Mobile controls (Combined bottom elements) */}
                <div className="flex items-center justify-center gap-6 mt-4 w-full sm:hidden">
                  <button 
                    onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-250 text-zinc-600 cursor-pointer flex items-center justify-center"
                    aria-label="Previous Testimonial"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-colors ${
                          currentTestimonial === index ? 'bg-emerald-500' : 'bg-zinc-200'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                    className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-250 text-zinc-600 cursor-pointer flex items-center justify-center"
                    aria-label="Next Testimonial"
                  >
                    <FaChevronRight className="text-xs" />
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
