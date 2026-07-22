'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import api from '@/utils/api';
import { 
  FaSearch, 
  FaArrowRight, 
  FaCoins, 
  FaRegFrown, 
  FaChevronDown, 
  FaChevronUp 
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
  // 1. Forestry
  {
    _id: 'fb_forestry_1',
    title: 'Urban Micro-Forestry Initiative',
    story: 'Plant native tree species in micro-plots across urban residential zones to reduce neighborhood heat island effects.',
    fundingGoal: 10000,
    amountRaised: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=600',
    category: 'Forestry',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_forestry_2',
    title: 'Sundarbans Mangrove Restoration',
    story: 'Restore mangrove cover along critical saline estuaries to protect coastal soil structures from rising sea levels.',
    fundingGoal: 20000,
    amountRaised: 12000,
    imageUrl: '/images/cause_3.jpg',
    category: 'Forestry',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 2. Solar
  {
    _id: 'fb_solar_1',
    title: 'Off-Grid Solar Panels for Rural Clinics',
    story: 'Equip remote health outposts with 24/7 solar storage grids to maintain vaccine refrigeration and backup light modules.',
    fundingGoal: 15000,
    amountRaised: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600',
    category: 'Solar',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_solar_2',
    title: 'Clean Energy Solar Water Pumps',
    story: 'Deploy low-cost solar-driven irrigation pumps for smallholder agricultural cooperatives struggling with fuel pricing.',
    fundingGoal: 8000,
    amountRaised: 5200,
    imageUrl: '/images/cause_2.jpg',
    category: 'Solar',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 3. Gardening
  {
    _id: 'fb_garden_1',
    title: 'Community Rooftop Vegetable Gardens',
    story: 'Deploy modular raised growing spaces on urban rooftops to cultivate organic vegetables for nearby low-income residents.',
    fundingGoal: 5000,
    amountRaised: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=600',
    category: 'Gardening',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_garden_2',
    title: 'Pollinator Habitat & Wildflower Beds',
    story: 'Transform neglected roadside strips into vibrant pollinator corridors seeded with native wildflowers to feed honeybee swarms.',
    fundingGoal: 3500,
    amountRaised: 1800,
    imageUrl: '/images/cause_1.jpg',
    category: 'Gardening',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 4. Reforestation
  {
    _id: 'fb_reforest_1',
    title: 'Post-Wildfire Deciduous Reforestation',
    story: 'Re-establish native oak and maple saplings in public valleys heavily damaged by recent summer brushfires.',
    fundingGoal: 25000,
    amountRaised: 9000,
    imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600',
    category: 'Reforestation',
    deadline: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_reforest_2',
    title: 'Hillside Soil Erosion Mitigation Project',
    story: 'Secure sliding terrain slopes near mountain highways by planting dense lines of deep-rooted firs and ground conifers.',
    fundingGoal: 12000,
    amountRaised: 6700,
    imageUrl: '/images/event_1.jpg',
    category: 'Reforestation',
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 5. Humanitarian
  {
    _id: 'fb_human_1',
    title: 'Restoring Comfort for Old Age Shelter Homes',
    story: 'Upgrade sanitization layouts and supply medical cot setups for elder citizens abandoned in regional neighborhoods.',
    fundingGoal: 18000,
    amountRaised: 14000,
    imageUrl: '/images/humanitarian_about.jpg',
    category: 'Humanitarian',
    deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_human_2',
    title: 'Clean Water Well Installations',
    story: 'Drill community deep-well systems to deliver reliable and safe drinking water to remote villages suffering from waterborne illnesses.',
    fundingGoal: 9500,
    amountRaised: 7800,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    category: 'Humanitarian',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 6. Social Care
  {
    _id: 'fb_social_1',
    title: 'Mental Health Counseling for Youth',
    story: 'Fund weekly clinical therapy group sessions and peer counselors for high school and university students dealing with acute anxiety.',
    fundingGoal: 7500,
    amountRaised: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600',
    category: 'Social Care',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_social_2',
    title: 'Mobile Food Pantries for Poor Families',
    story: 'Deploy vans carrying fresh vegetables, grain items, and milk products directly to under-resourced housing projects.',
    fundingGoal: 6000,
    amountRaised: 4500,
    imageUrl: '/images/cause_2.jpg',
    category: 'Social Care',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 7. Art & Creative
  {
    _id: 'fb_art_1',
    title: 'Underground Community Theater Gear',
    story: 'Purchase professional staging rigs, LED spots, and audio capture interfaces for neighborhood dramatic theater groups.',
    fundingGoal: 11000,
    amountRaised: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
    category: 'Art & Creative',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_art_2',
    title: 'Urban Public Mural Painting Project',
    story: 'Commission youth street artists to repaint concrete highway dividers with murals conveying environmental unity and green futures.',
    fundingGoal: 4500,
    amountRaised: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600',
    category: 'Art & Creative',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 8. Science & Tech
  {
    _id: 'fb_science_1',
    title: 'Open Air Quality Sensor Networks',
    story: 'Assemble and deploy modular public air particle sensor nodes to collect real-time data on carbon exhaust levels.',
    fundingGoal: 14000,
    amountRaised: 6100,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    category: 'Science & Tech',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_science_2',
    title: 'Robotics Coding Kits for Schools',
    story: 'Distribute reusable microcontroller kits and basic sensor modules to secondary school classrooms to foster STEM skills.',
    fundingGoal: 8500,
    amountRaised: 4900,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    category: 'Science & Tech',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 9. Sports & Health
  {
    _id: 'fb_sports_1',
    title: 'Adaptive Wheelchair Racing Equipment',
    story: 'Provide custom-made sports wheelchairs and training gloves for para-athletes preparing for regional track tournaments.',
    fundingGoal: 16000,
    amountRaised: 8000,
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600',
    category: 'Sports & Health',
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_sports_2',
    title: 'Youth Sports Pitch Drainage Fix',
    story: 'Upgrade turf irrigation and drainage blocks on public pitches to keep youth leagues training safely during rainy cycles.',
    fundingGoal: 7000,
    amountRaised: 3450,
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
    category: 'Sports & Health',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 10. Education
  {
    _id: 'fb_edu_1',
    title: 'Rural School Library Book Drive',
    story: 'Purchase modern science, history, and literature textbooks along with simple bookshelves for remote schools.',
    fundingGoal: 9000,
    amountRaised: 5600,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
    category: 'Education',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_edu_2',
    title: 'Coding & Design Bootcamps',
    story: 'Host free software development and digital design workshops to help low-income high school graduates enter technology careers.',
    fundingGoal: 12500,
    amountRaised: 8200,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    category: 'Education',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 11. Music & Film
  {
    _id: 'fb_music_1',
    title: 'Eco-Documentary Production Fund',
    story: 'Complete post-production audio mixing and color grading for a documentary charting local river restoration programs.',
    fundingGoal: 10000,
    amountRaised: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
    category: 'Music & Film',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_music_2',
    title: 'Youth Orchestra Instrument Kits',
    story: 'Acquire violins, cellos, and brass horns to supply underfunded community music conservatories for student classes.',
    fundingGoal: 6500,
    amountRaised: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=600',
    category: 'Music & Film',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 12. Food & Hunger
  {
    _id: 'fb_food_1',
    title: 'Shelter Soup Kitchen Renovations',
    story: 'Replace worn prep tables and install high-capacity stoves to feed larger cohorts of homeless individuals daily.',
    fundingGoal: 8000,
    amountRaised: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
    category: 'Food & Hunger',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_food_2',
    title: 'Hydroponic Vertical Farm Modules',
    story: 'Assemble water-efficient vertical crop arrays inside city food banks to grow fresh leafy greens throughout the year.',
    fundingGoal: 15000,
    amountRaised: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600',
    category: 'Food & Hunger',
    deadline: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 13. Wildlife
  {
    _id: 'fb_wild_1',
    title: 'Sea Turtle Nesting Shore Patrols',
    story: 'Train volunteers and construct protective cages over sea turtle nests to secure hatchlings from shore predators.',
    fundingGoal: 7500,
    amountRaised: 4900,
    imageUrl: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=600',
    category: 'Wildlife',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_wild_2',
    title: 'Injured Raptor Veterinary Care',
    story: 'Fund medical treatments and large flight rehabilitation enclosures for orphaned or injured forest birds of prey.',
    fundingGoal: 5000,
    amountRaised: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&q=80&w=600',
    category: 'Wildlife',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },

  // 14. Disaster Relief
  {
    _id: 'fb_disaster_1',
    title: 'Flood Emergency Action Packs',
    story: 'Assemble first-aid boxes containing solar torches, high-grade water purifiers, and warm blankets for immediate deployment.',
    fundingGoal: 20000,
    amountRaised: 11500,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    category: 'Disaster Relief',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  },
  {
    _id: 'fb_disaster_2',
    title: 'Modular Temporary Emergency Domes',
    story: 'Fabricate lightweight, insulated fiberglass shelters to house families displaced by unexpected earthquakes or slides.',
    fundingGoal: 30000,
    amountRaised: 18200,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
    category: 'Disaster Relief',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Green Creator'
  }
];

export default function ExploreCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Pagination & Accordion states
  const [currentPage, setCurrentPage] = useState(1);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const categories = [
    'All', 
    'Forestry', 
    'Solar', 
    'Gardening', 
    'Reforestation', 
    'Humanitarian', 
    'Social Care', 
    'Art & Creative', 
    'Science & Tech', 
    'Sports & Health', 
    'Education', 
    'Music & Film', 
    'Food & Hunger', 
    'Wildlife', 
    'Disaster Relief'
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns');
        const activeAndApproved = res.data.campaigns.filter((c: any) => c.status === 'approved');
        
        if (activeAndApproved.length > 0) {
          // Merge database campaigns with any missing fallback categories to ensure 14 categories have items
          const dbIds = new Set(activeAndApproved.map((c: any) => c._id));
          const dbTitles = new Set(activeAndApproved.map((c: any) => c.title.toLowerCase()));
          
          const uniqueFallbacks = defaultFallbackCampaigns.filter(
            (c) => !dbIds.has(c._id) && !dbTitles.has(c.title.toLowerCase())
          );
          
          setCampaigns([...activeAndApproved, ...uniqueFallbacks]);
        } else {
          setCampaigns(defaultFallbackCampaigns);
        }
      } catch (err) {
        console.error('Error fetching campaigns in explore:', err);
        setCampaigns(defaultFallbackCampaigns);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search filter trigger
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.story.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination parameters
  const cardsPerPage = 9;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCampaigns.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCampaigns.length / cardsPerPage);

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      <PageBanner
        title="Explore Campaigns"
        bgImage="/images/home_1_slider_1.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'All Causes' },
        ]}
      />

      {/* MAIN CONTENT AREA */}
      <section className="py-16 flex-grow">
        <div className="container mx-auto px-6 max-w-[1400px]">
          
          {/* SEARCH BAR & COLLAPSIBLE CATEGORIES ACCORDION */}
          <div className="bg-white border border-zinc-150 rounded-[7px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col gap-5 mb-12 text-left">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns by name or story description..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-[#F8FAFC] border border-zinc-200 rounded-[7px] py-3.5 pl-5 pr-11 text-xs text-zinc-800 outline-none focus:border-primary transition-colors font-semibold"
              />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm" />
            </div>

            {/* Accordion trigger panel */}
            <div className="border-t border-zinc-100 pt-4 mt-1">
              <button
                type="button"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="w-full flex items-center justify-between py-2 text-xs font-black uppercase tracking-wider text-zinc-700 hover:text-primary transition-colors cursor-pointer border-none bg-transparent"
              >
                <span className="flex items-center gap-2">
                  Filter by Category: <span className="text-primary font-black font-sans lowercase first-letter:uppercase">{selectedCategory}</span>
                </span>
                {isAccordionOpen ? <FaChevronUp className="text-sm text-zinc-400" /> : <FaChevronDown className="text-sm text-zinc-400" />}
              </button>

              {/* Accordion slide container */}
              {isAccordionOpen && (
                <div className="mt-4 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-150">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1); // Reset page on category filter switch
                      }}
                      className={`h-9 px-4 rounded-[7px] text-[10px] uppercase font-black tracking-wider transition-all border cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-primary text-white border-primary shadow-xs' 
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Heading */}
          <div className="text-left mb-10">
            <h2 className="text-2xl font-black text-zinc-900 m-0 uppercase tracking-tight font-heading">
              Our Active Causes
            </h2>
            <p className="text-sm text-zinc-500 mt-1 font-semibold">Find campaigns and pledge tree plantation credits.</p>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin mx-auto" />
              <p className="mt-4 text-xs text-zinc-400 font-bold">Loading active causes...</p>
            </div>
          ) : currentCards.length === 0 ? (
            <div className="py-24 text-center bg-white border border-zinc-150 rounded-[7px] max-w-md mx-auto shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
              <FaRegFrown className="text-4xl text-zinc-300 mx-auto mb-4" />
              <h3 className="text-sm font-bold text-zinc-800 m-0">No Campaigns Found</h3>
              <p className="text-xs text-zinc-500 mt-2 font-medium">Try modifying your search or filter settings.</p>
            </div>
          ) : (
            <>
              {/* Cards Grid: 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {currentCards.map((camp) => {
                  const progressPercent = Math.min(100, Math.round((camp.amountRaised / camp.fundingGoal) * 100));
                  return (
                    <div 
                      key={camp._id} 
                      className="border border-zinc-150 bg-white rounded-[7px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(91,95,239,0.12)] hover:translate-y-[-6px] transition-all duration-300 flex flex-col justify-between"
                    >
                      
                      {/* Cover Frame */}
                      <div className="h-52 relative overflow-hidden bg-zinc-100 shrink-0">
                        <img 
                          src={camp.imageUrl} 
                          alt={camp.title} 
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                          {camp.category}
                        </span>
                      </div>

                      {/* Progress Bar Frame */}
                      <div className="px-6 pt-6 pb-1">
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Content Frame */}
                      <div className="px-6 pb-6 pt-3 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Metrics Panel */}
                          <div className="flex justify-between items-center mb-5 text-left font-numbers">
                            <div>
                              <span className="text-base font-bold text-zinc-900 block leading-tight">
                                {camp.amountRaised.toLocaleString()} cr
                              </span>
                              <span className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">Raised ({progressPercent}%)</span>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-bold text-zinc-700 block leading-tight">
                                {camp.fundingGoal.toLocaleString()} cr
                              </span>
                              <span className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">Goal Target</span>
                            </div>
                          </div>

                          <h3 className="m-0 mb-3 text-base font-extrabold text-zinc-900 line-clamp-2 h-12 leading-snug font-heading">
                            <Link href={`/campaign/${camp._id}`} className="text-zinc-900 hover:text-primary no-underline transition-colors">
                              {camp.title}
                            </Link>
                          </h3>

                          <p className="text-xs text-zinc-500 font-semibold leading-relaxed line-clamp-3 h-14 m-0 mb-6">
                            {camp.story}
                          </p>
                        </div>

                        <div className="border-t border-zinc-100 pt-5 flex justify-between items-center mt-auto">
                          <span className="text-[11px] text-zinc-500 font-semibold">
                            By <strong className="text-zinc-800 font-bold">{camp.creatorName}</strong>
                          </span>
                          <Link className="h-9 px-5 bg-primary hover:bg-primary/95 text-white rounded-[7px] text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1 border-none no-underline transition-colors animate-in fade-in" href={`/campaign/${camp._id}`}>
                            View Details <FaArrowRight className="text-[9px]" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-14">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-10 px-4 rounded-[7px] bg-white border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-[7px] text-xs font-black transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-primary text-white shadow-md shadow-primary/20 border-primary'
                          : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-10 px-4 rounded-[7px] bg-white border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
