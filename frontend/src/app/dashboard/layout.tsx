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
  FaUser
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

  // Redirect to login if user session is not found
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container text-center" style={{ padding: '120px 0' }}>
          <div className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p style={{ marginTop: '15px', color: '#888' }}>Checking credentials...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Generate sidebar navigation options based on User Role using react-icons
  const getSidebarLinks = () => {
    switch (user.role) {
      case 'Supporter':
        return [
          { path: '/dashboard', label: 'Home Dashboard', icon: <FaTachometerAlt /> },
          { path: '/dashboard/supporter/contributions', label: 'My Contributions', icon: <FaHeart /> },
          { path: '/dashboard/supporter/purchase', label: 'Purchase Credits', icon: <FaCoins /> },
          { path: '/dashboard/supporter/payments', label: 'Payment History', icon: <FaHistory /> },
          { path: '/dashboard/profile', label: 'Profile Settings', icon: <FaUser /> },
        ];
      case 'Creator':
        return [
          { path: '/dashboard', label: 'Home Dashboard', icon: <FaTachometerAlt /> },
          { path: '/dashboard/creator/add-campaign', label: 'Create Campaign', icon: <FaPlus /> },
          { path: '/dashboard/creator/my-campaigns', label: 'My Campaigns', icon: <FaBriefcase /> },
          { path: '/dashboard/creator/payments', label: 'Payment History', icon: <FaHistory /> },
          { path: '/dashboard/creator/withdrawals', label: 'Request Payout', icon: <FaCreditCard /> },
          { path: '/dashboard/profile', label: 'Profile Settings', icon: <FaUser /> },
        ];
      case 'Admin':
        return [
          { path: '/dashboard', label: 'Home Dashboard', icon: <FaTachometerAlt /> },
          { path: '/dashboard/admin/approvals', label: 'Pending Approvals', icon: <FaCheckSquare /> },
          { path: '/dashboard/admin/withdrawals', label: 'Withdrawal Requests', icon: <FaUniversity /> },
          { path: '/dashboard/admin/users', label: 'Manage Users', icon: <FaUsers /> },
          { path: '/dashboard/admin/reports', label: 'Flagged Campaigns', icon: <FaFlag /> },
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
              <h3 style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Dashboard Workspace
              </h3>
              <p className="page-breadcrumb" style={{ fontSize: '11px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#ccc' }}>Home</Link> / Dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN WORKSPACE COLUMNS */}
      <section className="section-content-block" style={{ background: '#fdfdfd' }}>
        <div className="container">
          <div className="row">
            
            {/* SIDEBAR NAVIGATION COLUMN */}
            <div className="col-md-3 col-sm-12" style={{ marginBottom: '30px' }}>
              <div style={{ background: '#fff', border: '1px solid #eee', padding: '20px', borderRadius: '4px' }}>
                
                {/* Profile Card */}
                <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {user.photoUrl && !imageError ? (
                    <img 
                      src={user.photoUrl} 
                      alt="Profile" 
                      onError={() => setImageError(true)}
                      style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7cb032' }}
                    />
                  ) : (
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#7cb032', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{user.name}</h5>
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#7cb032', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                      {user.role === 'Admin' ? <FaShieldAlt /> : <FaBriefcase />} {user.role}
                    </span>
                  </div>
                </div>

                {/* Sidebar Navigation list */}
                <h4 style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 10px 0', borderBottom: '1px solid #f9f9f9', paddingBottom: '5px' }}>Workspace Menus</h4>
                <ul className="list-unstyled" style={{ margin: 0, padding: 0 }}>
                  {links.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                      <li key={link.path} style={{ margin: '5px 0' }}>
                        <Link 
                          href={link.path}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 15px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: isActive ? '#fff' : '#555',
                            background: isActive ? '#7cb032' : 'transparent',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ display: 'inline-flex', fontSize: '14px' }}>{link.icon}</span>
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
              <div style={{ background: '#fff', border: '1px solid #eee', padding: '30px', borderRadius: '4px', minHeight: '400px' }}>
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
