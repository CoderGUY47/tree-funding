'use client';

import React from 'react';
import Link from 'next/link';

export default function CategoriesSection() {
  const categories = [
    { 
      label: 'Reforestation', 
      badge: '34 Projects', 
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Clean Solar', 
      badge: '28 Projects', 
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Ocean & Coasts', 
      badge: '19 Projects', 
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Wildlife Rescue', 
      badge: '22 Projects', 
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Urban Farming', 
      badge: '15 Projects', 
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Clean Tech', 
      badge: '31 Projects', 
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Health & Aid', 
      badge: '18 Projects', 
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Eco Education', 
      badge: '14 Projects', 
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Sustainable Art', 
      badge: '11 Projects', 
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Disaster Relief', 
      badge: '25 Projects', 
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Climate Tech', 
      badge: '20 Projects', 
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600' 
    },
    { 
      label: 'Community', 
      badge: '40 Projects', 
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600' 
    },
  ];

  return (
    <section className="bg-white py-24 border-b border-zinc-100 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 md:px-14 text-center">
        
        {/* Section Header */}
        <div className="mb-14 max-w-2xl mx-auto">
          <p className="text-primary font-semibold text-lg italic mb-2 tracking-wide"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            Together, We Can Change Lives Forever.
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 leading-tight tracking-tight m-0">
            Explore by <span className="text-[#f0a500]">Category</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-3 font-medium leading-relaxed">
            Find and support causes aligned with your environmental vision across 12 specialized impact sectors.
          </p>
        </div>

        {/* 12 Borderless Unsplash Image Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 text-left">
          {categories.map((cat, idx) => (
            <Link href="/explore" key={idx} className="no-underline group">
              <div className="relative h-52 rounded-2xl overflow-hidden border-none shadow-md group-hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-4">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity group-hover:from-black/90" />

                <div className="relative z-10">
                  <span className="text-xs font-black text-white uppercase block tracking-wider mb-1 drop-shadow-sm group-hover:text-[#f0a500] transition-colors">
                    {cat.label}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {cat.badge}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
