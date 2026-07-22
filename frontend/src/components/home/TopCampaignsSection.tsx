'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import api from '@/utils/api';

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
  }
];

export default function TopCampaignsSection() {
  const [topCampaigns, setTopCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCampaignPage, setCurrentCampaignPage] = useState(0);

  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        const res = await api.get('/campaigns');
        const activeAndApproved = res.data.campaigns
          .filter((c: any) => c.status === 'approved')
          .sort((a: any, b: any) => b.amountRaised - a.amountRaised)
          .slice(0, 3);
        
        if (activeAndApproved.length > 0) {
          setTopCampaigns(activeAndApproved);
        } else {
          setTopCampaigns(defaultFallbackCampaigns);
        }
      } catch (err) {
        console.error('Error fetching campaigns on homepage:', err);
        setTopCampaigns(defaultFallbackCampaigns);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCampaigns();
  }, []);

  return (
    <section id="campaigns" className="py-20 bg-white border-b border-zinc-100 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-14">

        {/* Section header */}
        <div className="flex items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-primary font-semibold text-lg italic mb-3 tracking-wide"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Charity makes no decrease in property.
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-[1.1] tracking-tight m-0">
              Helping Each Other Can<br />
              Make{' '}<span className="text-[#f0a500]">World</span>{' '}Better
            </h2>
          </div>

          {/* Circular nav arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentCampaignPage(p => Math.max(0, p - 1))}
              aria-label="Previous campaigns"
              className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer bg-transparent"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            <button
              onClick={() => setCurrentCampaignPage(p => p + 1)}
              aria-label="Next campaigns"
              className="w-12 h-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer bg-transparent"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>

        {/* Campaign cards row */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCampaigns.map((camp) => {
              const progressPercent = Math.min(100, Math.round((camp.amountRaised / camp.fundingGoal) * 100));
              return (
                <div
                  key={camp._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-zinc-100 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden shrink-0">
                    <img
                      src={camp.imageUrl}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-[#f0a500] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow">
                      {camp.category}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-black text-zinc-900 leading-snug mb-2 line-clamp-2">
                      <Link href={`/campaign/${camp._id}`} className="text-zinc-900 hover:text-primary no-underline transition-colors">
                        {camp.title}
                      </Link>
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-5 font-medium">
                      {camp.story}
                    </p>

                    <div className="mb-4">
                      <div className="relative h-2 bg-zinc-100 rounded-full mb-3">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full"
                          style={{
                            width: `${progressPercent}%`,
                            background: 'linear-gradient(90deg, #f0a500, #ff6b35)'
                          }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
                          style={{
                            left: `calc(${progressPercent}% - 8px)`,
                            background: '#f0a500'
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                          {progressPercent}% Funded
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                          Goal: {camp.fundingGoal.toLocaleString()} cr
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-100">
                      <div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide m-0">Raised</p>
                        <p className="text-base font-black text-[#f0a500] m-0">{camp.amountRaised.toLocaleString()} cr</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide m-0">Goal</p>
                        <p className="text-base font-black text-[#f0a500] m-0">{camp.fundingGoal.toLocaleString()} cr</p>
                      </div>
                      <Link
                        href={`/campaign/${camp._id}`}
                        className="h-9 px-5 bg-primary hover:bg-primary/90 text-white rounded-full text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5 no-underline transition-all shadow shadow-primary/20"
                      >
                        View <FaArrowRight className="text-[9px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 h-13 px-10 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold text-[13px] uppercase tracking-wider no-underline transition-all"
          >
            View All Campaigns <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
