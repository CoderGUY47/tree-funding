'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import SponsorsMarquee from '@/components/home/SponsorsMarquee';
import MissionSection from '@/components/home/MissionSection';
import TopCampaignsSection from '@/components/home/TopCampaignsSection';
import ProcessSection from '@/components/home/ProcessSection';
import PlatformMetricsSection from '@/components/home/PlatformMetricsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';

export default function Homepage() {
  return (
    <div className="bg-[#F8FAFC] text-[#111827] min-h-screen flex flex-col font-sans">
      {/* 1. Global 3-Tier Navigation */}
      <Navbar />

      {/* 2. Hero Slide Banner */}
      <HeroBanner />

      {/* 3. Infinite Sponsors Marquee */}
      <SponsorsMarquee />

      {/* 4. We Work Together Mission Section */}
      <MissionSection />

      {/* 5. Top Funded Campaigns Section */}
      <TopCampaignsSection />

      {/* 6. How TreeFund Works (Our Process) */}
      <ProcessSection />

      {/* 7. Our Climate Impact (Platform Metrics) */}
      <PlatformMetricsSection />

      {/* 8. Discover Interests (Explore by Category) */}
      <CategoriesSection />

      {/* 9. Why Choose TreeFund (Our Features) */}
      <FeaturesSection />

      {/* 10. Community Testimonials (Reviews) */}
      <TestimonialsSection />

      {/* 11. Become a Creator Today CTA */}
      <CtaSection />

      {/* 12. Global Footer */}
      <Footer />
    </div>
  );
}
