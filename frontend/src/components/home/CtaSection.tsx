'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaGlobe, FaShieldAlt, FaLeaf } from 'react-icons/fa';

export default function CtaSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#1a3c34] text-white">
      {/* Background Forest Image Overlay */}
      <img
        src="/images/forest_bg.jpg"
        alt="Forest Overlay"
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-14 text-center relative z-10">
        
        {/* Gold script tagline */}
        <p className="text-[#f0a500] font-semibold text-xl italic mb-3 tracking-wide"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
          Start Raising Funds in Minutes
        </p>

        {/* Main heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6 max-w-3xl mx-auto m-0">
          Become a <span className="text-[#f0a500]">Creator</span> Today
        </h2>

        {/* Description */}
        <p className="text-zinc-200 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
          Start raising funds for your environmental project in minutes and claim backer credits directly to fund saplings, solar cells, and marine restoration.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-5 mb-16">
          <Link
            href="/register"
            className="h-14 px-10 rounded-full bg-[#f0a500] hover:bg-[#f0a500]/90 text-zinc-950 font-black text-xs uppercase tracking-widest flex items-center gap-2.5 no-underline transition-all shadow-xl shadow-[#f0a500]/20 hover:scale-[1.03]"
          >
            <FaRocket className="text-sm" /> Launch Campaign
          </Link>
          <Link
            href="/explore"
            className="h-14 px-10 rounded-full border-2 border-white/80 hover:border-white text-white font-black text-xs uppercase tracking-widest flex items-center gap-2.5 no-underline transition-all hover:bg-white/10"
          >
            <FaGlobe className="text-sm" /> Explore Projects
          </Link>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-10 border-t border-white/15 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-zinc-300 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center justify-center gap-2.5">
            <FaShieldAlt className="text-[#f0a500] text-base" /> <span>Direct Wallet Payouts</span>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <FaLeaf className="text-[#f0a500] text-base" /> <span>0% Platform Theft</span>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <FaGlobe className="text-[#f0a500] text-base" /> <span>Global Eco Backing</span>
          </div>
        </div>

      </div>
    </section>
  );
}
