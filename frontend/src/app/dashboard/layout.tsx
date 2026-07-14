'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
      <div>
        <Navbar />
        <div className="container text-center py-32">
          <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-500 text-sm">Checking credentials...</p>
        </div>
        <Footer />
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
    <div>
      <Navbar />

      {/* PAGE HEADER */}
      <section
        className="page-header"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.55)), url('/images/home_1_slider_1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '65px 0',
          color: '#fff'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h3 className="text-white text-3xl font-bold uppercase">
                Dashboard Workspace
              </h3>
              <p className="text-xs text-zinc-300 mt-2">
                <Link href="/" className="text-zinc-300 hover:text-white no-underline">Home</Link> / Dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN WORKSPACE COLUMNS */}
      <section className="section-content-block bg-zinc-50">
        <div className="container">
          <div className="row">

            {/* SIDEBAR NAVIGATION COLUMN */}
            <div className="col-md-3 col-sm-12 mb-8">
              <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm">

                {/* Profile Card: User Image | Available Credits */}
                <div className="border-b border-zinc-100 pb-4 mb-5">

                  {/* Row 1: Avatar + Credits */}
                  <div className="flex items-center justify-between gap-3 mb-3">
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
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-base shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}

                    {/* Available Credits */}
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Available Credits</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-extrabold text-base leading-none mt-0.5">
                        <FaCoins className="text-emerald-500 text-xs" />
                        {user.credits}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: User Name | User Role */}
                  <div>
                    <h5 className="m-0 font-bold text-sm text-zinc-800">{user.name}</h5>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 mt-1">
                      {user.role === 'Admin' ? <FaShieldAlt /> : <FaBriefcase />} {user.role}
                    </span>
                  </div>

                </div>

                {/* Sidebar Navigation label */}
                <h4 className="text-xs text-zinc-700 uppercase font-bold mb-3 border-b border-zinc-100 pb-2 tracking-widest">
                  Workspace Menus
                </h4>

                <ul className="list-none m-0 p-0 space-y-1">
                  {links.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                      <li key={link.path}>
                        <Link
                          href={link.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold no-underline transition-all duration-200 ${
                            isActive
                              ? 'bg-emerald-500 text-white'
                              : 'text-zinc-800 hover:bg-zinc-50 hover:border hover:border-zinc-200'
                          }`}
                        >
                          <span className={`text-base inline-flex ${isActive ? 'text-white' : 'text-emerald-500'}`}>
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
            <div className="col-md-9 col-sm-12">
              <div className="bg-white border border-zinc-200 p-8 rounded-xl shadow-sm min-h-96">
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
