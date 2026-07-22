'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { 
  FaTachometerAlt, 
  FaHeart, 
  FaCoins, 
  FaHistory, 
  FaPlus, 
  FaBriefcase, 
  FaTasks, 
  FaCreditCard, 
  FaCheckSquare, 
  FaUniversity, 
  FaUsers, 
  FaFlag, 
  FaShieldAlt,
  FaUser,
  FaCompass
} from 'react-icons/fa';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getSidebarLinks = () => {
    switch (user.role) {
      case 'Supporter':
        return [
          { path: '/dashboard', label: 'Home Dashboard', icon: <FaTachometerAlt /> },
          { path: '/dashboard/supporter/explore', label: 'Explore Campaigns', icon: <FaCompass /> },
          { path: '/dashboard/supporter/contributions', label: 'My Contributions', icon: <FaHeart /> },
          { path: '/dashboard/supporter/purchase', label: 'Purchase Credit', icon: <FaCoins /> },
          { path: '/dashboard/supporter/payments', label: 'Payment History', icon: <FaHistory /> },
          { path: '/dashboard/profile', label: 'Profile Settings', icon: <FaUser /> },
        ];
      case 'Creator':
        return [
          { path: '/dashboard', label: 'Home Dashboard', icon: <FaTachometerAlt /> },
          { path: '/dashboard/creator/add-campaign', label: 'Add New Campaign', icon: <FaPlus /> },
          { path: '/dashboard/creator/my-campaigns', label: 'My Campaigns', icon: <FaBriefcase /> },
          { path: '/dashboard/creator/withdrawals', label: 'Withdrawals', icon: <FaCreditCard /> },
          { path: '/dashboard/creator/payments', label: 'Payment History', icon: <FaHistory /> },
          { path: '/dashboard/profile', label: 'Profile Settings', icon: <FaUser /> },
        ];
      case 'Admin':
        return [
          { path: '/dashboard', label: 'Home Dashboard', icon: <FaTachometerAlt /> },
          { path: '/dashboard/admin/users', label: 'Manage Users', icon: <FaUsers /> },
          { path: '/dashboard/admin/approvals', label: 'Campaign Approvals', icon: <FaCheckSquare /> },
          { path: '/dashboard/admin/campaigns', label: 'Manage Campaigns', icon: <FaTasks /> },
          { path: '/dashboard/admin/withdrawals', label: 'Withdrawal Requests', icon: <FaUniversity /> },
          { path: '/dashboard/admin/reports', label: 'Reports', icon: <FaFlag /> },
          { path: '/dashboard/profile', label: 'Profile Settings', icon: <FaUser /> },
        ];
      default:
        return [];
    }
  };

  const links = getSidebarLinks();

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      <PageBanner
        title="Dashboard Workspace"
        bgImage="/images/home_1_slider_1.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard' },
        ]}
      />

      {/* MAIN WORKSPACE COLUMNS */}
      <section className="py-12 flex-grow bg-[#F8FAFC]">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* SIDEBAR NAVIGATION COLUMN */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-zinc-200 p-6 rounded-[24px] shadow-xs text-left">

                {/* Profile Card: User Image | Available Credits */}
                <div className="border-b border-zinc-150 pb-5 mb-5">

                  {/* Row 1: Avatar + Credits */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    {/* User Image */}
                    {user.photoUrl &&
                     user.photoUrl !== 'null' &&
                     user.photoUrl !== 'undefined' &&
                     user.photoUrl.trim() !== '' &&
                     (user.photoUrl.startsWith('http') || user.photoUrl.startsWith('/')) &&
                     !imageError ? (
                      <img
                        src={user.photoUrl}
                        alt="Profile"
                        onError={() => setImageError(true)}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}

                    {/* Available Credits */}
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider">Credits Available</span>
                      <span className="flex items-center gap-1 text-primary font-bold text-base leading-none mt-1 font-numbers">
                        <FaCoins className="text-amber-500 text-xs" />
                        {user.credits}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: User Name | User Role */}
                  <div>
                    <h5 className="m-0 font-bold text-sm text-zinc-900 leading-tight">{user.name}</h5>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 mt-1.5">
                      {user.role === 'Admin' ? <FaShieldAlt /> : <FaBriefcase />} {user.role}
                    </span>
                  </div>

                </div>

                {/* Sidebar Navigation label */}
                <h4 className="text-[10px] text-zinc-400 uppercase font-black mb-3 border-b border-zinc-100 pb-2 tracking-widest">
                  Workspace Menus
                </h4>

                <ul className="list-none m-0 p-0 space-y-1">
                  {links.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                      <li key={link.path}>
                        <Link
                          href={link.path}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold no-underline transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-white shadow-xs'
                              : 'text-zinc-700 hover:bg-zinc-50'
                          }`}
                        >
                          <span className={`text-sm inline-flex ${isActive ? 'text-white' : 'text-primary'}`}>
                            {link.icon}
                          </span>
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

              </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="lg:col-span-9 text-left">
              <div className="bg-white border border-zinc-200 p-8 rounded-[24px] shadow-xs min-h-[480px]">
                {children}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
