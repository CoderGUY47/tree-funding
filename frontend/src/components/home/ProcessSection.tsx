'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

export default function ProcessSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 border-b border-zinc-100 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-14 text-center">
        
        {/* Header */}
        <div className="mb-14 max-w-2xl mx-auto">
          <p className="text-primary font-semibold text-lg italic mb-2 tracking-wide"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            Together, We Can Change Lives Forever.
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-tight tracking-tight m-0">
            How TreeFund <span className="text-[#f0a500]">Works</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-3 font-medium leading-relaxed">
            Three simple steps to connect climate supporters with verified micro-plantation campaigns worldwide.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#1a3c34] text-[#f0a500] flex items-center justify-center text-xl font-black shadow-md group-hover:scale-110 transition-transform">
                01
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                Discovery
              </span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900 mb-3 group-hover:text-primary transition-colors">
                Discover Verified Causes
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed m-0 font-medium">
                Creators outline environmental milestones and launch active campaigns. Supporters browse verified causes and transparent targets.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-primary">
              <span>Explore active causes</span> <FaArrowRight className="text-[10px]" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-black shadow-md group-hover:scale-110 transition-transform">
                02
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#f0a500] bg-amber-50 px-3 py-1 rounded-full">
                Pledge
              </span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900 mb-3 group-hover:text-primary transition-colors">
                Pledge Wallet Credits
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed m-0 font-medium">
                Supporters easily purchase platform credits and pledge them directly toward specific environmental goals with instant receipts.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-primary">
              <span>Direct wallet allocations</span> <FaArrowRight className="text-[10px]" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#f0a500] text-white flex items-center justify-center text-xl font-black shadow-md group-hover:scale-110 transition-transform">
                03
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#1a3c34] bg-emerald-50 px-3 py-1 rounded-full">
                Impact
              </span>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900 mb-3 group-hover:text-primary transition-colors">
                Track Real Impact
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed m-0 font-medium">
                Once campaigns are backed, creators submit milestone proof, tree-planting updates, and deliver backer rewards directly.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-bold text-primary">
              <span>Verified progress updates</span> <FaArrowRight className="text-[10px]" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
