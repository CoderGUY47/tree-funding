'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPhoneAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/images/home_1_slider_1.jpg',
      titlePre: 'Back Reforestation Grids &',
      titleHighlight: 'Plant Saplings',
      subtitle: "Support local micro-forestry teams and backers. We ensure direct crowdfunding backing to restore forest coverage worldwide.",
    },
    {
      image: '/images/home_1_slider_2.jpg',
      titlePre: 'Empower Lives and Clean',
      titleHighlight: 'Solar Communities',
      subtitle: 'From local community shelters and food banks to micro solar grid installations for off-grid agrarian classrooms.',
    },
    {
      image: '/images/volunteers.jpg',
      titlePre: 'Protect Marine Habitats and',
      titleHighlight: 'Coastal Wildlife',
      subtitle: 'Provide funding to clean coastal debris, restore sandbanks, and save nesting grounds for local wildlife and ecological protection.',
    }
  ];

  // Auto slide banner effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full overflow-hidden" style={{ marginTop: '170px' }}>
      {/* Full-width slide images */}
      <div className="relative w-full" style={{ minHeight: '600px', height: 'calc(100vh - 170px)', maxHeight: '760px' }}>
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            {/* Full background image */}
            <img
              src={slide.image}
              alt={`${slide.titlePre} ${slide.titleHighlight}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle black/10 overlay */}
            <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
          </div>
        ))}

        {/* Hero Content — Bold Sans-Serif Font Only, No Left Shade */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-14">
            <div className="max-w-[580px]">
              {/* Bold Tagline */}
              <p className="text-[#f0a500] font-black text-base sm:text-lg uppercase tracking-wider mb-4 drop-shadow-md">
                WE ARE ALWAYS OPEN FOR OUR PLANET
              </p>

              {/* Main Heading — Bold font only */}
              <h1 className="text-white text-4xl sm:text-5xl lg:text-[58px] font-black leading-[1.1] tracking-tight m-0 mb-8 drop-shadow-xl">
                {slides[currentSlide].titlePre}{' '}
                <span className="text-[#f0a500]">{slides[currentSlide].titleHighlight}</span>
              </h1>

              {/* Subtitle — Bold font */}
              <p className="text-white text-base leading-relaxed mb-10 max-w-md font-bold drop-shadow-md">
                {slides[currentSlide].subtitle}
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href="/register"
                  className="inline-flex items-center h-13 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[13px] uppercase tracking-wider no-underline transition-all shadow-xl shadow-primary/30 hover:scale-[1.03]"
                >
                  Donate Now
                </Link>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <FaPhoneAlt className="text-primary text-sm" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider m-0">Call Us Now</p>
                    <p className="text-white text-sm font-bold m-0 mt-0.5">+025 757 576 560</p>
                  </div>
                </div>
              </div>

              {/* Slide dot indicators */}
              <div className="flex items-center gap-2 mt-12">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`rounded-full border-none cursor-pointer transition-all duration-300 ${
                      currentSlide === i
                        ? 'bg-primary w-8 h-2'
                        : 'bg-white/30 w-2 h-2 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide navigation arrows */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-primary hover:border-primary flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
          >
            <FaChevronLeft className="text-xs" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            aria-label="Next slide"
            className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white hover:bg-primary hover:border-primary flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
