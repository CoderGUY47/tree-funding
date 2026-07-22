'use client';

import React from 'react';
import { 
  FaLeaf, 
  FaTree, 
  FaCreditCard, 
  FaCloud, 
  FaPaw, 
  FaGlobe, 
  FaSun, 
  FaBolt 
} from 'react-icons/fa';

export default function SponsorsMarquee() {
  return (
    <section className="bg-zinc-50 border-b border-zinc-100 py-4 overflow-hidden relative w-full">
      {/* Left & Right Gradient Fades */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-zinc-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-zinc-50 to-transparent z-10 pointer-events-none" />

      {/* 100% Full Width Compact Marquee Track Container */}
      <div className="relative w-full overflow-hidden flex items-center">
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-compact {
            display: flex;
            width: max-content;
            animation: marquee 25s linear infinite;
          }
          .animate-marquee-compact:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="animate-marquee-compact items-center gap-12 md:gap-20 opacity-70">
          {[...Array(2)].map((_, setIdx) => (
            <React.Fragment key={setIdx}>
              <div className="flex items-center gap-2.5 text-zinc-900 text-base md:text-xl font-black uppercase tracking-wider hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none">
                <FaLeaf className="text-emerald-500 text-lg md:text-xl shrink-0" />
                <span>ECO</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-900 text-base md:text-xl font-black uppercase tracking-wider hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none">
                <FaTree className="text-green-600 text-lg md:text-xl shrink-0" />
                <span>TREES</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-900 text-base md:text-xl font-black uppercase tracking-wider hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none">
                <FaCreditCard className="text-indigo-600 text-lg md:text-xl shrink-0" />
                <span>STRIPE</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-900 text-base md:text-xl font-black uppercase tracking-wider hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none">
                <FaCloud className="text-amber-500 text-lg md:text-xl shrink-0" />
                <span>AWS</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-900 text-base md:text-xl font-black uppercase tracking-wider hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none">
                <FaPaw className="text-[#1a3c34] text-lg md:text-xl shrink-0" />
                <span>WWF</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-900 text-base md:text-xl font-black uppercase tracking-wider hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none">
                <FaGlobe className="text-cyan-600 text-lg md:text-xl shrink-0" />
                <span>UNEP</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-900 text-base md:text-xl font-black uppercase tracking-wider hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none">
                <FaSun className="text-[#f0a500] text-lg md:text-xl shrink-0" />
                <span>SOLAR</span>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-900 text-base md:text-xl font-black uppercase tracking-wider hover:opacity-100 hover:text-primary transition-all cursor-pointer select-none">
                <FaBolt className="text-primary text-lg md:text-xl shrink-0" />
                <span>CLIMATE</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
