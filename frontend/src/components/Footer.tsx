'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaInstagram, 
  FaGithub,
  FaPaperPlane,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronRight
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#141b2b] text-zinc-300 font-sans w-full relative overflow-hidden">
      
      {/* ── 1. TOP SOCIAL RIBBON ── */}
      <div className="bg-[#1a2335] border-b border-zinc-800/80 py-5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-14 flex flex-wrap justify-between items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Connect With Our Global Eco Community
          </span>
          <div className="flex items-center gap-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#f0a500] transition-colors flex items-center gap-2 text-xs font-semibold no-underline">
              <FaFacebookF className="text-sm" /> <span>Facebook</span>
            </a>
            <a href="https://x.com/CoderGUY47" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#f0a500] transition-colors flex items-center gap-2 text-xs font-semibold no-underline">
              <FaXTwitter className="text-sm" /> <span>X (Twitter)</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#f0a500] transition-colors flex items-center gap-2 text-xs font-semibold no-underline">
              <FaInstagram className="text-sm" /> <span>Instagram</span>
            </a>
            <a href="https://github.com/CoderGUY47/tree-funding" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#f0a500] transition-colors flex items-center gap-2 text-xs font-semibold no-underline">
              <FaGithub className="text-sm" /> <span>GitHub</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#f0a500] transition-colors flex items-center gap-2 text-xs font-semibold no-underline">
              <FaLinkedinIn className="text-sm" /> <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN UPPER FOOTER ── */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-14 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-left">
          
          {/* Column 1: Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/images/tree-fund-logo.png" 
                alt="TreeFund Logo" 
                width={180} 
                height={50} 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
            </div>
            <h3 className="text-lg font-black text-white m-0 tracking-tight">
              Subscribe Newsletter
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed font-medium m-0 max-w-sm">
              Receive updates on newly launched micro-planting campaigns, verified milestone reports, and climate impact stories.
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-2 max-w-sm">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address..."
                className="w-full bg-[#1e283d] border border-zinc-700/80 rounded-full py-3.5 pl-5 pr-14 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#f0a500] transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#f0a500] hover:bg-[#f0a500]/90 text-zinc-950 flex items-center justify-center border-none cursor-pointer transition-all shadow-md"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </form>
            {subscribed && (
              <span className="text-xs font-bold text-[#f0a500] mt-1 block">
                ✓ Thank you for subscribing!
              </span>
            )}
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-[#f0a500] text-sm font-black tracking-wider uppercase m-0">
              Services &amp; Platform
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-medium p-0 m-0 list-none">
              <li>
                <Link href="/explore" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Environmental Crowdfunding
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Verified Milestone Tracking
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Wallet Credit System
                </Link>
              </li>
              <li>
                <Link href="/developer" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Developer API Directory
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Start an Application
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-[#f0a500] text-sm font-black tracking-wider uppercase m-0">
              Useful Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs font-medium p-0 m-0 list-none">
              <li>
                <Link href="/#campaigns" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> How It Works
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Sign In / Account
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Become a Creator
                </Link>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors no-underline flex items-center gap-1.5">
                  <FaChevronRight className="text-[9px] text-[#f0a500]" /> Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h3 className="text-[#f0a500] text-sm font-black tracking-wider uppercase m-0">
              Locations &amp; Contact
            </h3>
            <div className="flex flex-col gap-3 text-xs font-medium text-zinc-400">
              <div className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-[#f0a500] text-sm shrink-0 mt-0.5" />
                <span>Road-2, East Shibgonj, Sylhet, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaEnvelope className="text-[#f0a500] text-sm shrink-0" />
                <a href="mailto:hello@treefund.org" className="text-zinc-400 hover:text-white no-underline transition-colors">
                  hello@treefund.org
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-[#f0a500] text-sm shrink-0" />
                <a href="tel:+880823560433" className="text-zinc-400 hover:text-white no-underline transition-colors">
                  (+880) 0823 560 433
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── 3. LOWER FOOTER / COPYRIGHT ── */}
      <div className="bg-[#0f1420] border-t border-zinc-800/60 py-6">
        <div className="mx-auto max-w-[1400px] px-6 md:px-14 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-zinc-400">
          <div>
            <span>&copy; {currentYear} <strong className="text-white">TreeFund Ltd.</strong> All rights reserved.</span>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#" className="text-zinc-400 hover:text-[#f0a500] transition-colors no-underline">Privacy Policy</a>
            <a href="#" className="text-zinc-400 hover:text-[#f0a500] transition-colors no-underline">Terms of Service</a>
            <a href="#" className="text-zinc-400 hover:text-[#f0a500] transition-colors no-underline">Security Audit</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
