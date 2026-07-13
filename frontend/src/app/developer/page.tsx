'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaGithub, 
  FaEnvelope, 
  FaGlobe, 
  FaCode, 
  FaCheckCircle,
  FaDatabase,
  FaServer,
  FaUserShield,
  FaFire
} from 'react-icons/fa';

export default function DeveloperProfile() {
  const clientRepo = 'https://github.com/CoderGUY47/tree-funding';
  const serverRepo = 'https://github.com/CoderGUY47/tree-funding';
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{ background: '#fcfdfa', minHeight: '100vh' }}>
      <Navbar />

      {/* HEADER HERO SECTION */}
      <section 
        className="page-header" 
        style={{
          backgroundImage: `linear-gradient(rgba(18, 20, 15, 0.75), rgba(18, 20, 15, 0.85)), url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '120px 0 100px 0',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <span style={{ background: '#7cb032', color: '#000', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', marginBottom: '15px' }}>
                Creator & Developer
              </span>
              <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.5px', margin: '0 0 10px 0' }}>
                Developer Profile
              </h1>
              <p className="page-breadcrumb" style={{ fontSize: '13px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#7cb032', fontWeight: 'bold' }}>Home</Link> / Profile / Details
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="section-content-block" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
            
            {/* LEFT PROFILE CARD */}
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <div style={{
                background: '#ffffff',
                border: '1px solid #eef2eb',
                borderRadius: '12px',
                padding: '40px 30px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(124, 176, 50, 0.05)',
                position: 'sticky',
                top: '100px'
              }}>
                <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 25px auto' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300" 
                    alt="Developer Avatar" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '50%', 
                      objectFit: 'cover', 
                      border: '4px solid #7cb032',
                      boxShadow: '0 8px 24px rgba(124, 176, 50, 0.15)'
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '5px',
                    background: '#7cb032',
                    color: '#fff',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #fff',
                    fontSize: '12px'
                  }} title="Active Status">
                    <FaCheckCircle style={{ color: '#ffffff' }} />
                  </div>
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
                  CODERGUY
                </h3>
                <p style={{ fontSize: '13px', color: '#7cb032', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                  Lead Full-Stack Developer
                </p>

                <hr style={{ border: 'none', borderTop: '1px solid #f2f5f0', margin: '20px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', fontSize: '14px', color: '#656b60' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaEnvelope style={{ color: '#7cb032' }} />
                    <span>coderguy@treefunding.org</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaGlobe style={{ color: '#7cb032' }} />
                    <span>github.com/CoderGUY47</span>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #f2f5f0', margin: '20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <a href="https://github.com/CoderGUY47" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', background: '#f5f7f3', color: '#333', fontSize: '16px', transition: 'all 0.2s' }} title="GitHub">
                    <FaGithub />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', background: '#f5f7f3', color: '#007bb6', fontSize: '16px', transition: 'all 0.2s' }} title="LinkedIn">
                    <FaLinkedinIn />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', background: '#f5f7f3', color: '#3b5998', fontSize: '16px', transition: 'all 0.2s' }} title="Facebook">
                    <FaFacebookF />
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT INFO & EXPERIENCE */}
            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <div style={{ textAlign: 'left' }}>
                
                {/* BIO SECTION */}
                <div style={{ background: '#fff', border: '1px solid #eef2eb', borderRadius: '12px', padding: '40px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(124, 176, 50, 0.02)' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 20px 0', borderBottom: '2px solid #7cb032', display: 'inline-block', paddingBottom: '5px' }}>
                    About The Developer
                  </h3>
                  <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#555e50', marginBottom: '15px' }}>
                    Hi, I'm <strong>CODERGUY</strong>, the developer behind the MERN stack operations of the <strong>TreeFund</strong> crowdfunding platform.
                    I am dedicated to crafting highly responsive, performant, and secure web solutions that resolve community challenges and drive sustainability initiatives worldwide.
                  </p>
                  <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#555e50', marginBottom: '25px' }}>
                    For this project, I integrated a role-based modular dashboard structure supporting Supporters, Creators, and Administrators, as well as complex features like automated email sign-ups, secure Google OAuth authentication flows via Better Auth, Stripe payments, and a local credit transaction database.
                  </p>

                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <a 
                      href={clientRepo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-theme text-uppercase"
                      style={{ padding: '12px 30px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                    >
                      <FaCode /> Client Repository
                    </a>
                    <a 
                      href={serverRepo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-pure-dark-bg text-uppercase"
                      style={{ padding: '12px 30px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#1e211c', color: '#fff' }}
                    >
                      <FaGlobe /> Server Repository
                    </a>
                  </div>
                </div>

                {/* ARCHITECTURE HIGHLIGHTS */}
                <div style={{ background: '#fff', border: '1px solid #eef2eb', borderRadius: '12px', padding: '40px', marginBottom: '30px', boxShadow: '0 4px 20px rgba(124, 176, 50, 0.02)' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 25px 0', borderBottom: '2px solid #7cb032', display: 'inline-block', paddingBottom: '5px' }}>
                    Key Architecture Integrations
                  </h3>
                  
                  <div className="row">
                    {/* Block 1 */}
                    <div className="col-md-6 col-sm-6 col-xs-12" style={{ marginBottom: '25px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ background: '#f5f7f3', color: '#7cb032', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          <FaUserShield />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 8px 0' }}>Secure Auth Middleware</h4>
                          <p style={{ fontSize: '13px', color: '#656b60', lineHeight: '1.6', margin: 0 }}>
                            Constructed secure route guards validating local cookies and Better Auth session identifiers across all API routes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Block 2 */}
                    <div className="col-md-6 col-sm-6 col-xs-12" style={{ marginBottom: '25px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ background: '#f5f7f3', color: '#7cb032', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          <FaDatabase />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 8px 0' }}>Relational MongoDB Schema</h4>
                          <p style={{ fontSize: '13px', color: '#656b60', lineHeight: '1.6', margin: 0 }}>
                            Designed Mongoose database schemas modeling user roles, dynamic campaigns, support transactions, and withdrawal records.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Block 3 */}
                    <div className="col-md-6 col-sm-6 col-xs-12" style={{ marginBottom: '25px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ background: '#f5f7f3', color: '#7cb032', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          <FaServer />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 8px 0' }}>Express API REST System</h4>
                          <p style={{ fontSize: '13px', color: '#656b60', lineHeight: '1.6', margin: 0 }}>
                            Engineered structured controllers managing campaigns, payouts, notifications, and transactions.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Block 4 */}
                    <div className="col-md-6 col-sm-6 col-xs-12" style={{ marginBottom: '25px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ background: '#f5f7f3', color: '#7cb032', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                          <FaFire />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 8px 0' }}>Dynamic Client Hydration</h4>
                          <p style={{ fontSize: '13px', color: '#656b60', lineHeight: '1.6', margin: 0 }}>
                            Optimized React contexts ensuring persistent workspace state syncing and smooth active tab updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SKILLS METRICS */}
                <div style={{ background: '#fff', border: '1px solid #eef2eb', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 20px rgba(124, 176, 50, 0.02)' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 25px 0', borderBottom: '2px solid #7cb032', display: 'inline-block', paddingBottom: '5px' }}>
                    Developer Skill Directory
                  </h3>
                  
                  {/* Skill 1 */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#1e211c', marginBottom: '8px' }}>
                      <span>React.js / Next.js Full-Stack Frontend</span>
                      <span style={{ color: '#7cb032' }}>95%</span>
                    </div>
                    <div className="progress" style={{ height: '8px', background: '#f0f3ed', margin: 0, borderRadius: '4px', overflow: 'hidden' }}>
                      <div className="progress-bar" style={{ width: '95%', background: '#7cb032', height: '100%' }}></div>
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#1e211c', marginBottom: '8px' }}>
                      <span>Node.js / Express Server Systems</span>
                      <span style={{ color: '#7cb032' }}>90%</span>
                    </div>
                    <div className="progress" style={{ height: '8px', background: '#f0f3ed', margin: 0, borderRadius: '4px', overflow: 'hidden' }}>
                      <div className="progress-bar" style={{ width: '90%', background: '#7cb032', height: '100%' }}></div>
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#1e211c', marginBottom: '8px' }}>
                      <span>MongoDB / Database Management</span>
                      <span style={{ color: '#7cb032' }}>85%</span>
                    </div>
                    <div className="progress" style={{ height: '8px', background: '#f0f3ed', margin: 0, borderRadius: '4px', overflow: 'hidden' }}>
                      <div className="progress-bar" style={{ width: '85%', background: '#7cb032', height: '100%' }}></div>
                    </div>
                  </div>

                  {/* Skill 4 */}
                  <div style={{ marginBottom: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', color: '#1e211c', marginBottom: '8px' }}>
                      <span>Tailwind CSS / Premium UI UX Design</span>
                      <span style={{ color: '#7cb032' }}>92%</span>
                    </div>
                    <div className="progress" style={{ height: '8px', background: '#f0f3ed', margin: 0, borderRadius: '4px', overflow: 'hidden' }}>
                      <div className="progress-bar" style={{ width: '92%', background: '#7cb032', height: '100%' }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
