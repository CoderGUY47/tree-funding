'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  FaGithub, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaCode, 
  FaGlobe, 
  FaUsers,
  FaCheckCircle
} from 'react-icons/fa';

export default function DeveloperProfile() {
  const clientRepo = 'https://github.com/CoderGUY47/tree-funding';
  const serverRepo = 'https://github.com/CoderGUY47/tree-funding';

  const teamMembers = [
    {
      name: 'CODERGUY',
      role: 'Project Director & Full-Stack Architect',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'Director',
      skills: ['MERN', 'NextJS', 'MongoDB', 'TS'],
      email: 'coderguy@treefunding.org',
      github: 'https://github.com/CoderGUY47'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Lead Frontend & Auth Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'Frontend',
      skills: ['Next.js', 'Better Auth', 'Tailwind'],
      email: 'sjenkins@treefunding.org',
      github: 'https://github.com'
    },
    {
      name: 'Marcus Chen',
      role: 'Lead Backend & Database Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'Backend',
      skills: ['Express', 'Mongoose', 'Redis'],
      email: 'mchen@treefunding.org',
      github: 'https://github.com'
    },
    {
      name: 'Elena Rostova',
      role: 'Lead UI/UX Product Designer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'Design',
      skills: ['Figma', 'Framer', 'Sleek UI'],
      email: 'erostova@treefunding.org',
      github: 'https://github.com'
    },
    {
      name: 'David Kross',
      role: 'Lead QA & DevOps Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'DevOps',
      skills: ['Docker', 'Vercel', 'Playwright'],
      email: 'dkross@treefunding.org',
      github: 'https://github.com'
    },
    {
      name: 'Aisha Rahman',
      role: 'AI & Smart Search Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'AI / Search',
      skills: ['Python', 'PyTorch', 'Vector DB'],
      email: 'arahman@treefunding.org',
      github: 'https://github.com'
    },
    {
      name: 'Kenji Sato',
      role: 'Stripe & Payout Security Engineer',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'Security',
      skills: ['Stripe API', 'OAuth', 'Crypto'],
      email: 'ksato@treefunding.org',
      github: 'https://github.com'
    },
    {
      name: 'Sophia Martinez',
      role: 'Communications & Supporter Relations',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'Relations',
      skills: ['CRM', 'Intercom', 'SendGrid'],
      email: 'smartinez@treefunding.org',
      github: 'https://github.com'
    },
    {
      name: 'Liam Gallagher',
      role: 'Developer Advocate & Community Lead',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'Community',
      skills: ['Discord', 'Git APIs', 'Advocacy'],
      email: 'lgallagher@treefunding.org',
      github: 'https://github.com'
    },
    {
      name: 'Olivia Vance',
      role: 'Audit & Compliance Manager',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300',
      category: 'Audit',
      skills: ['SOC2', 'GDPR', 'Compliance'],
      email: 'ovance@treefunding.org',
      github: 'https://github.com'
    }
  ];

  return (
    <div style={{ background: '#fcfdfa', minHeight: '100vh' }}>
      <Navbar />

      {/* Unique Card Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }
        .dev-card {
          background: #ffffff;
          border: 1px solid #eef2eb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(124, 176, 50, 0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .dev-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(124, 176, 50, 0.12);
          border-color: #7cb032;
        }
        .dev-image-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: #f5f7f3;
        }
        .dev-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .dev-card:hover .dev-image {
          transform: scale(1.08);
        }
        .dev-category-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(18, 20, 15, 0.75);
          backdrop-filter: blur(4px);
          color: #7cb032;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          z-index: 2;
        }
        .dev-info {
          padding: 25px;
          text-align: left;
          position: relative;
        }
        .dev-name {
          font-size: 18px;
          font-weight: bold;
          color: #1e211c;
          margin: 0 0 5px 0;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dev-role {
          font-size: 12px;
          color: #7cb032;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 15px 0;
        }
        .dev-skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }
        .dev-skill-tag {
          font-size: 10px;
          background: #f5f7f3;
          color: #656b60;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: bold;
        }
        .dev-card-footer {
          border-top: 1px solid #f2f5f0;
          padding-top: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dev-contact-btn {
          font-size: 12px;
          color: #656b60;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .dev-contact-btn:hover {
          color: #7cb032;
        }
        .dev-social-link {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f5f7f3;
          color: #656b60;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s;
        }
        .dev-social-link:hover {
          background: #7cb032;
          color: #ffffff;
        }
      ` }} />

      {/* HEADER HERO SECTION */}
      <section 
        className="page-header" 
        style={{
          backgroundImage: `linear-gradient(rgba(18, 20, 15, 0.75), rgba(18, 20, 15, 0.85)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200')`,
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
                Engineering Directory
              </span>
              <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.5px', margin: '0 0 10px 0' }}>
                Join As Developer
              </h1>
              <p className="page-breadcrumb" style={{ fontSize: '13px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#7cb032', fontWeight: 'bold' }}>Home</Link> / Team / Directory
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10 CARDS GRID SECTION */}
      <section className="section-content-block" style={{ padding: '80px 0 60px 0' }}>
        <div className="container">
          
          <div className="row text-center">
            <div className="col-sm-12">
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e211c', textTransform: 'uppercase', marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <FaUsers style={{ color: '#7cb032' }} /> Meet the Engineering Team
              </h2>
              <p style={{ color: '#656b60', fontSize: '14px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 50px auto' }}>
                Discover the 10 engineers, security auditors, developers, and designers who collaborated to deploy the TreeFund crowdfunding platform.
              </p>
            </div>
          </div>

          <div className="dev-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="dev-card">
                <div className="dev-image-wrapper">
                  <span className="dev-category-badge">{member.category}</span>
                  <img src={member.avatar} alt={member.name} className="dev-image" />
                </div>
                
                <div className="dev-info">
                  <h4 className="dev-name">
                    {member.name}
                    {member.category === 'Director' && <FaCheckCircle style={{ color: '#7cb032', fontSize: '14px' }} />}
                  </h4>
                  <p className="dev-role">{member.role}</p>
                  
                  <div className="dev-skills-container">
                    {member.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="dev-skill-tag">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="dev-card-footer">
                    <a href={`mailto:${member.email}`} className="dev-contact-btn">
                      <FaEnvelope style={{ color: '#7cb032' }} /> Contact
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="dev-social-link" title="GitHub">
                      <FaGithub />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* REPOSITORY CALL TO ACTION */}
      <section style={{ padding: '40px 0 80px 0', background: '#fcfdfa' }}>
        <div className="container text-center">
          <div style={{
            background: '#ffffff',
            border: '1px solid #eef2eb',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(124, 176, 50, 0.02)',
            maxWidth: '760px',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e211c', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
              Explore the Project Source Code
            </h3>
            <p style={{ color: '#656b60', fontSize: '14px', marginBottom: '25px' }}>
              Access the frontend client and API server repositories on GitHub to see our codebase, database models, and deployment configurations.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
