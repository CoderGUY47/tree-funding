'use client';

import React from 'react';
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
  FaCheckCircle 
} from 'react-icons/fa';

export default function DeveloperProfile() {
  const clientRepo = 'https://github.com/coderguy/tree-funding-client';
  const serverRepo = 'https://github.com/coderguy/tree-funding-server';

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
          padding: '80px 0',
          color: '#fff'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h3 style={{ color: '#fff', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Developer Details
              </h3>
              <p className="page-breadcrumb" style={{ fontSize: '12px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#ccc' }}>Home</Link> / Developer Profile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER DETAIL CONTENT (MATCHING single-team.html) */}
      <section className="section-content-block">
        <div className="container">
          <div className="row">
            
            {/* LEFT COLUMN: Photo */}
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" style={{ marginBottom: '30px' }}>
              <div className="single-team" style={{ border: '1px solid #eee', background: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
                <figure className="team-member" style={{ margin: 0 }}>
                  <img 
                    src="/images/team_7.jpg" 
                    alt="Developer Avatar" 
                    style={{ width: '100%', display: 'block', objectFit: 'cover' }} 
                  />
                </figure>
              </div>
            </div>

            {/* RIGHT COLUMN: Details & Bio */}
            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
              <div className="single-team-details" style={{ textAlign: 'left' }}>
                
                <article className="team-info" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>CODERGUY</h3>
                  <h4 style={{ fontSize: '14px', color: '#7cb032', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    Junior MERN Stack Developer
                  </h4>
                </article>

                <ul className="team-social-share-2 clearfix" style={{ listStyle: 'none', padding: 0, margin: '0 0 25px 0', display: 'flex', gap: '10px' }}>
                  <li>
                    <a href={clientRepo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#f5f5f5', color: '#333', fontSize: '14px' }} title="GitHub Client">
                      <FaGithub />
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#f5f5f5', color: '#3b5998', fontSize: '14px' }} title="Facebook">
                      <FaFacebookF />
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#f5f5f5', color: '#007bb6', fontSize: '14px' }} title="LinkedIn">
                      <FaLinkedinIn />
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: '#f5f5f5', color: '#1da1f2', fontSize: '14px' }} title="Twitter">
                      <FaTwitter />
                    </a>
                  </li>
                </ul>

                <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#666', marginBottom: '20px' }}>
                  Hello! I am CODERGUY, a developer focusing on creating responsive and secure web applications.
                  I designed and implemented the full-stack MERN operations for this crowdfunding platform, integrating role workspaces, credit conversions, notifications, and secure route locks.
                </p>

                <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                  I aligned the front-end layout with the original assets and Bootstrap styling rules of the <strong>Generosity Charity template</strong>, incorporating crisp React Icons and dynamic fallback mechanisms.
                </p>

                {/* SKILLS METRICS */}
                <div style={{ marginBottom: '35px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '15px', textTransform: 'uppercase' }}>Professional Skills</h4>
                  
                  {/* Skill 1 */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>
                      <span>Next.js / React Frontend</span>
                      <span>95%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', background: '#eee', margin: 0 }}>
                      <div className="progress-bar" style={{ width: '95%', background: '#7cb032' }}></div>
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>
                      <span>Node.js / Express Backend</span>
                      <span>90%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', background: '#eee', margin: 0 }}>
                      <div className="progress-bar" style={{ width: '90%', background: '#7cb032' }}></div>
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>
                      <span>MongoDB Database</span>
                      <span>85%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', background: '#eee', margin: 0 }}>
                      <div className="progress-bar" style={{ width: '85%', background: '#7cb032' }}></div>
                    </div>
                  </div>
                </div>

                {/* REPO REDIRECT BUTTONS */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a 
                    href={clientRepo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-theme text-uppercase"
                    style={{ padding: '10px 25px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <FaCode /> Client Repository
                  </a>
                  <a 
                    href={serverRepo} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-pure-dark-bg text-uppercase"
                    style={{ padding: '10px 25px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <FaGlobe /> Server Repository
                  </a>
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
