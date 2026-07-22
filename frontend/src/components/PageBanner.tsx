import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

interface Crumb {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  breadcrumbs?: Crumb[];
  /** Optional background image URL. Defaults to a dark green/charcoal */
  bgImage?: string;
}

/**
 * AidUs-style inner-page title banner.
 * Dark overlay + centered title + high-visibility breadcrumb trail.
 * Used by Login, Register, Explore, Campaign, Dashboard, Developer pages.
 */
export default function PageBanner({ title, breadcrumbs = [], bgImage }: PageBannerProps) {
  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ marginTop: '170px', minHeight: '220px' }}
    >
      {/* Background */}
      {bgImage ? (
        <img
          src={bgImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#1a1a2e]" />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/95 via-[#1a1a2e]/80 to-[#1a1a2e]/70" />

      {/* Content */}
      <div className="relative z-10 text-center py-14 px-6">
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight m-0 mb-4 drop-shadow-md">
          {title}
        </h1>

        {/* Breadcrumbs — High Visibility, Bold White & Gold */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center justify-center gap-3 text-sm sm:text-base text-white font-bold drop-shadow-md">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <FaChevronRight className="text-xs text-[#f0a500] shrink-0" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-white hover:text-[#f0a500] no-underline transition-colors font-bold">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#f0a500] font-extrabold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      {/* Bottom green accent line — matches AidUs style */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-[#f0a500] to-primary" />
    </div>
  );
}
