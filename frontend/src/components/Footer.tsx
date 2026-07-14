'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaAngleDoubleRight, 
  FaTree,
  FaShareAlt,
  FaGithub
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 text-zinc-400 font-sans mt-auto">
      
      {/* Top Footer Widget Area */}
      <section className="border-b border-zinc-800 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Useful Links Column 1 */}
            <div className="flex flex-col gap-4 text-left">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                Organization
              </h3>
              <ul className="list-none p-0 m-0 space-y-2 text-xs font-semibold">
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <Link href="/explore" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Explore Campaigns</Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <Link href="/login" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Login / Sign In</Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <Link href="/register" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Register Account</Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <a href="https://github.com/CoderGUY47/tree-funding" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400 flex items-center gap-1.5">
                    <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                    Github Repository
                  </a>
                </li>
              </ul>
            </div>

            {/* Useful Links Column 2 */}
            <div className="flex flex-col gap-4 text-left">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                Support
              </h3>
              <ul className="list-none p-0 m-0 space-y-2 text-xs font-semibold">
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <a href="#" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Love Philosophy</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <a href="#" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Share & care</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <a href="#" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Child Education</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <a href="#" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Medical Treatment</a>
                </li>
              </ul>
            </div>

            {/* Useful Links Column 3 */}
            <div className="flex flex-col gap-4 text-left">
              <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                Discover
              </h3>
              <ul className="list-none p-0 m-0 space-y-2 text-xs font-semibold">
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <a href="#" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">How To Sponsor</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <a href="#" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Support a Volunteer</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <a href="#" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Community Attitudes</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <FaAngleDoubleRight className="text-emerald-500 shrink-0" />
                  <a href="#" className="hover:text-emerald-500 transition-colors no-underline text-zinc-400">Family Adopting</a>
                </li>
              </ul>
            </div>

            {/* About Column with Tree Logo */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <FaTree className="text-emerald-500 text-lg" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider m-0">
                  Tree<span className="text-emerald-500">Fund</span>
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-zinc-450 m-0">
                TreeFund is a dedicated MERN Crowdfunding platform empowering creators and supporters to fund tree-planting campaigns and environmental solutions. Together, we build a greener future.
              </p>
            </div>

          </div>

          {/* Contact Details Panel Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-zinc-800 text-left">
            
            <div className="flex gap-3 text-xs leading-relaxed">
              <FaMapMarkerAlt className="text-emerald-500 text-base shrink-0 mt-0.5" />
              <p className="m-0 text-zinc-400">
                Road-2, East Shibgonj
                <br />
                House No: M-23, Sylhet
              </p>
            </div>

            <div className="flex gap-3 text-xs leading-relaxed">
              <FaEnvelope className="text-emerald-500 text-base shrink-0 mt-0.5" />
              <p className="m-0 text-zinc-400">
                <a href="mailto:support@treefunding.com" className="hover:text-emerald-500 transition-colors text-zinc-400 no-underline">support@treefunding.com</a>
                <br />
                <a href="mailto:info@treefunding.com" className="hover:text-emerald-500 transition-colors text-zinc-400 no-underline">info@treefunding.com</a>
              </p>
            </div>

            <div className="flex gap-3 text-xs leading-relaxed">
              <FaPhoneAlt className="text-emerald-500 text-base shrink-0 mt-0.5" />
              <p className="m-0 text-zinc-400">
                (+880) 0823 560 433
                <br />
                (+880) 0823 560 434
              </p>
            </div>

            <div className="flex gap-3 text-xs leading-relaxed">
              <FaShareAlt className="text-emerald-500 text-base shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <p className="m-0 font-bold text-white text-[11px] uppercase tracking-wider">Spread The Word</p>
                <div className="flex gap-3 items-center mt-1">
                  <a href="https://github.com/CoderGUY47" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm" aria-label="GitHub"><FaGithub /></a>
                  <a href="https://x.com/CoderGUY47" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm" aria-label="Twitter / X"><FaXTwitter /></a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm" aria-label="Facebook"><FaFacebookF /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-500 transition-colors text-sm" aria-label="LinkedIn"><FaLinkedinIn /></a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer copyright section */}
      <section className="bg-zinc-950 py-6 text-center text-xs text-zinc-500 font-medium">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="m-0">
            Copyright © {currentYear} TreeFund. All Rights Reserved.
          </p>
        </div>
      </section>

    </footer>
  );
}
