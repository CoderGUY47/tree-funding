'use client';

import React from 'react';

export default function PlatformMetricsSection() {
  return (
    <section className="bg-[#1a3c34] text-white py-24 relative overflow-hidden">
      {/* Glow & background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#f0a500]/15 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-[1400px] px-6 md:px-14 text-center relative z-10">
        
        {/* Header */}
        <div className="mb-16 max-w-2xl mx-auto">
          <p className="text-[#f0a500] font-semibold text-lg italic mb-2 tracking-wide"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            Real Numbers. Real Environmental Impact.
          </p>
          <h2 className="text-[#FFFFFF] text-4xl sm:text-5xl font-black leading-tight tracking-tight m-0">
            Our Climate <span className="text-[#f0a500]">Impact</span> Worldwide
          </h2>
          <p className="text-zinc-300 text-sm mt-3 font-medium leading-relaxed">
            Empowering communities with verified micro-planting projects and transparent carbon credit allocations.
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 text-center">
            <span className="text-4xl sm:text-5xl font-black text-white font-numbers tracking-tight block mb-2">
              150+
            </span>
            <span className="text-xs text-[#f0a500] font-black uppercase tracking-widest block mb-1">
              Active Campaigns
            </span>
            <span className="text-[11px] text-zinc-300 font-medium">
              Verified tree plantation initiatives
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 text-center">
            <span className="text-4xl sm:text-5xl font-black text-[#f0a500] font-numbers tracking-tight block mb-2">
              5,200+
            </span>
            <span className="text-xs text-white font-black uppercase tracking-widest block mb-1">
              Global Supporters
            </span>
            <span className="text-[11px] text-zinc-300 font-medium">
              Active monthly contributors
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 text-center">
            <span className="text-4xl sm:text-5xl font-black text-white font-numbers tracking-tight block mb-2">
              120K+
            </span>
            <span className="text-xs text-[#f0a500] font-black uppercase tracking-widest block mb-1">
              Credits Pledged
            </span>
            <span className="text-[11px] text-zinc-300 font-medium">
              Directly funded to project leaders
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 text-center">
            <span className="text-4xl sm:text-5xl font-black text-[#f0a500] font-numbers tracking-tight block mb-2">
              12+
            </span>
            <span className="text-xs text-white font-black uppercase tracking-widest block mb-1">
              Countries
            </span>
            <span className="text-[11px] text-zinc-300 font-medium">
              Global eco-restoration footprint
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
