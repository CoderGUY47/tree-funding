'use client';

import React from 'react';
import { FaPhoneAlt, FaLeaf, FaCoins, FaUsers, FaStar } from 'react-icons/fa';

export default function MissionSection() {
  return (
    <section className="bg-white py-20 border-b border-zinc-100 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: tagline + heading + body + phone CTA */}
          <div className="relative">
            {/* Decorative hand outline */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-10 pointer-events-none select-none" aria-hidden="true">
              <svg width="80" height="140" viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 130 C10 110, 5 80, 15 50 C20 30, 30 15, 40 10 C50 5, 60 10, 65 25 C70 40, 65 60, 60 80 C55 100, 50 115, 55 130"
                  stroke="#1a3c34" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <path d="M40 10 C40 10, 45 30, 42 55" stroke="#1a3c34" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M55 20 C55 20, 58 40, 54 62" stroke="#1a3c34" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>

            {/* Script tagline */}
            <p className="text-primary font-semibold text-lg italic mb-4 tracking-wide"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Hope, Support, and Love for All
            </p>

            {/* Main heading */}
            <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-[1.1] tracking-tight mb-6 m-0">
              We Work Together<br />
              &amp; Never{' '}
              <span className="text-[#f0a500]">Give Up</span>
            </h2>

            {/* Body */}
            <p className="text-zinc-500 text-base leading-relaxed mb-8 max-w-md font-medium">
              We work together to make a lasting difference, helping people with kindness and hard work. We bring hope and make positive changes for those in need — one campaign at a time.
            </p>

            {/* Phone CTA */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                <FaPhoneAlt className="text-white text-sm" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest m-0">Call Us Now</p>
                <a href="tel:+8808235600433" className="text-zinc-900 font-black text-lg no-underline hover:text-primary transition-colors">
                  (+880) 0823 560 433
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Unique Asymmetric & Staggered Stat Cards Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            
            {/* Card 1 — AidUs Dark Green Theme */}
            <div className="bg-[#1a3c34] text-white rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group border border-[#1a3c34]">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#f0a500] text-xl font-bold">
                  <FaLeaf />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#f0a500] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                  Verified
                </span>
              </div>
              <div className="relative z-10">
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-white block mb-2 font-numbers">
                  1,000+
                </span>
                <span className="text-zinc-200 text-xs font-bold block uppercase tracking-wider">
                  Environmental Campaigns
                </span>
              </div>
              <FaLeaf className="absolute -right-4 -bottom-4 text-8xl text-white/10 pointer-events-none group-hover:scale-110 group-hover:text-white/15 transition-all duration-500" />
            </div>

            {/* Card 2 — Amber/Gold Border Card */}
            <div className="bg-white border-2 border-amber-100 rounded-3xl p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group sm:translate-y-6">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-[#f0a500] text-xl font-bold">
                  <FaCoins />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#f0a500] bg-amber-50 px-3 py-1 rounded-full">
                  Monthly
                </span>
              </div>
              <div className="relative z-10">
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-zinc-900 block mb-2 font-numbers">
                  $4.5M
                </span>
                <span className="text-zinc-500 text-xs font-bold block uppercase tracking-wider mb-3">
                  Funds Raised Monthly
                </span>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#f0a500] to-amber-500 h-full rounded-full w-[85%]" />
                </div>
              </div>
              <FaCoins className="absolute -right-4 -bottom-4 text-8xl text-amber-500/10 pointer-events-none group-hover:scale-110 transition-all duration-500" />
            </div>

            {/* Card 3 — Clean Indigo Border Card */}
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary text-xl font-bold">
                  <FaUsers />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-indigo-50 px-3 py-1 rounded-full">
                  Global
                </span>
              </div>
              <div className="relative z-10">
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-zinc-900 block mb-2 font-numbers">
                  30K+
                </span>
                <span className="text-zinc-500 text-xs font-bold block uppercase tracking-wider">
                  Active Monthly Donors
                </span>
              </div>
              <FaUsers className="absolute -right-4 -bottom-4 text-8xl text-primary/10 pointer-events-none group-hover:scale-110 transition-all duration-500" />
            </div>

            {/* Card 4 — Dark Navy Impact Card */}
            <div className="bg-[#141b2b] text-white rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group border border-zinc-800 sm:translate-y-6">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#f0a500] text-xl font-bold">
                  <FaStar />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#f0a500] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                  Success Rate
                </span>
              </div>
              <div className="relative z-10">
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#f0a500] block mb-2 font-numbers">
                  98%
                </span>
                <span className="text-zinc-300 text-xs font-bold block uppercase tracking-wider">
                  Successful Eco Projects
                </span>
              </div>
              <FaStar className="absolute -right-4 -bottom-4 text-8xl text-[#f0a500]/15 pointer-events-none group-hover:scale-110 transition-all duration-500" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
