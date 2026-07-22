'use client';

import React from 'react';
import { 
  FaShieldAlt, 
  FaBolt, 
  FaUserCheck, 
  FaCreditCard, 
  FaChartLine, 
  FaSearch 
} from 'react-icons/fa';

export default function FeaturesSection() {
  return (
    <section className="bg-[#F8FAFC] py-24 border-b border-zinc-100 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-14">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <p className="text-primary font-semibold text-lg italic mb-2 tracking-wide"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            Why People Choose TreeFund Platform
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-tight tracking-tight m-0">
            Why Choose <span className="text-[#f0a500]">TreeFund</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-3 font-medium leading-relaxed">
            We combine transparent blockchain-ready wallet credits, verified creator milestones, and high-impact climate tracking.
          </p>
        </div>

        {/* 6 Feature Cards with DISTINCT colors & LARGE icon watermarks in card background */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          
          {/* Feature 1 — Indigo Theme */}
          <div className="bg-indigo-50/60 border border-indigo-100/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <FaShieldAlt className="text-3xl text-indigo-600 mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <h3 className="text-lg font-black text-zinc-900 mb-2.5 group-hover:text-indigo-600 transition-colors relative z-10">
              Encrypted Credit Ledgers
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed m-0 font-medium relative z-10">
              End-to-end encrypted credit transactions to verify every contribution source securely without hidden processing fees.
            </p>
            <FaShieldAlt className="absolute -right-4 -bottom-4 text-8xl md:text-9xl text-indigo-600/15 pointer-events-none group-hover:scale-110 group-hover:text-indigo-600/25 transition-all duration-500" aria-hidden="true" />
          </div>

          {/* Feature 2 — Amber/Gold Theme */}
          <div className="bg-amber-50/60 border border-amber-100/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <FaBolt className="text-3xl text-[#f0a500] mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <h3 className="text-lg font-black text-zinc-900 mb-2.5 group-hover:text-[#f0a500] transition-colors relative z-10">
              Fast Creator Payouts
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed m-0 font-medium relative z-10">
              Creators claim payouts directly to their verified bank, Stripe, or localized mobile banking accounts upon milestone approval.
            </p>
            <FaBolt className="absolute -right-4 -bottom-4 text-8xl md:text-9xl text-[#f0a500]/20 pointer-events-none group-hover:scale-110 group-hover:text-[#f0a500]/30 transition-all duration-500" aria-hidden="true" />
          </div>

          {/* Feature 3 — AidUs Emerald/Dark Green Theme */}
          <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <FaUserCheck className="text-3xl text-[#1a3c34] mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <h3 className="text-lg font-black text-zinc-900 mb-2.5 group-hover:text-[#1a3c34] transition-colors relative z-10">
              Verified Eco Creators
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed m-0 font-medium relative z-10">
              Every creator campaign undergoes administrative review and community verification to guarantee platform trust and campaign safety.
            </p>
            <FaUserCheck className="absolute -right-4 -bottom-4 text-8xl md:text-9xl text-[#1a3c34]/15 pointer-events-none group-hover:scale-110 group-hover:text-[#1a3c34]/25 transition-all duration-500" aria-hidden="true" />
          </div>

          {/* Feature 4 — Rose/Red Theme */}
          <div className="bg-rose-50/60 border border-rose-100/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <FaCreditCard className="text-3xl text-rose-600 mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <h3 className="text-lg font-black text-zinc-900 mb-2.5 group-hover:text-rose-600 transition-colors relative z-10">
              Stripe &amp; Credit Checkout
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed m-0 font-medium relative z-10">
              Seamless credit package checkout system powered by secure Stripe transaction flows and instant digital receipts.
            </p>
            <FaCreditCard className="absolute -right-4 -bottom-4 text-8xl md:text-9xl text-rose-600/15 pointer-events-none group-hover:scale-110 group-hover:text-rose-600/25 transition-all duration-500" aria-hidden="true" />
          </div>

          {/* Feature 5 — Teal Theme */}
          <div className="bg-teal-50/60 border border-teal-100/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <FaChartLine className="text-3xl text-teal-600 mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <h3 className="text-lg font-black text-zinc-900 mb-2.5 group-hover:text-teal-600 transition-colors relative z-10">
              Real-Time Climate Analytics
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed m-0 font-medium relative z-10">
              Track live stats on trees planted, CO2 offset metrics, and project milestone proof posted by campaign leaders.
            </p>
            <FaChartLine className="absolute -right-4 -bottom-4 text-8xl md:text-9xl text-teal-600/15 pointer-events-none group-hover:scale-110 group-hover:text-teal-600/25 transition-all duration-500" aria-hidden="true" />
          </div>

          {/* Feature 6 — Purple Theme */}
          <div className="bg-purple-50/60 border border-purple-100/80 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <FaSearch className="text-3xl text-purple-600 mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
            <h3 className="text-lg font-black text-zinc-900 mb-2.5 group-hover:text-purple-600 transition-colors relative z-10">
              Active Fraud Prevention
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed m-0 font-medium relative z-10">
              Integrated community reporting and admin audit flag reviews ensure malicious or unverified campaigns are blocked immediately.
            </p>
            <FaSearch className="absolute -right-4 -bottom-4 text-8xl md:text-9xl text-purple-600/15 pointer-events-none group-hover:scale-110 group-hover:text-purple-600/25 transition-all duration-500" aria-hidden="true" />
          </div>

        </div>

      </div>
    </section>
  );
}
