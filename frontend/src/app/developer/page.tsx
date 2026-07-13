'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  FaGithub, 
  FaLinkedinIn, 
  FaFacebookF, 
  FaEnvelope, 
  FaCode, 
  FaGlobe, 
  FaUsers
} from 'react-icons/fa';

export default function DeveloperProfile() {
  const clientRepo = 'https://github.com/CoderGUY47/tree-funding';
  const serverRepo = 'https://github.com/CoderGUY47/tree-funding';

  const teamMembers = {
    head: {
      name: 'CODERGUY',
      role: 'Project Director & Full-Stack Architect',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200',
      tag: 'MERN Lead',
      email: 'coderguy@treefunding.org'
    },
    branches: [
      {
        name: 'Sarah Jenkins',
        role: 'Frontend & Auth Architect',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
        tag: 'Next.js / Better Auth',
        subNode: {
          name: 'Elena Rostova',
          role: 'Lead UI/UX Designer',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
          tag: 'Figma / CSS'
        }
      },
      {
        name: 'Marcus Chen',
        role: 'Backend & Database Architect',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
        tag: 'Express / MongoDB',
        subNode: {
          name: 'David Kross',
          role: 'QA & DevOps Engineer',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
          tag: 'CI/CD / Vercel'
        }
      }
    ]
  };

  return (
    <div style={{ background: '#fcfdfa', minHeight: '100vh' }}>
      <Navbar />

      {/* Embedded Tree CSS Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tree-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          position: relative;
          padding: 20px 0;
        }
        .tree-row {
          display: flex;
          justify-content: center;
          width: 100%;
          position: relative;
        }
        .tree-node-card {
          background: #ffffff;
          border: 1px solid #eef2eb;
          border-radius: 12px;
          padding: 20px;
          width: 250px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(124, 176, 50, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 2;
        }
        .tree-node-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(124, 176, 50, 0.12);
          border-color: #7cb032;
        }
        .tree-node-card.active-card {
          border: 2px solid #7cb032;
          box-shadow: 0 6px 24px rgba(124, 176, 50, 0.08);
        }
        .tree-node-avatar {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 12px;
          border: 2px solid #7cb032;
        }
        .tree-node-name {
          font-size: 15px;
          font-weight: bold;
          color: #1e211c;
          margin: 0 0 4px 0;
          text-transform: uppercase;
        }
        .tree-node-role {
          font-size: 11px;
          color: #656b60;
          margin: 0 0 10px 0;
          font-weight: 500;
          min-height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tree-node-tag {
          font-size: 10px;
          background: #f5f7f3;
          color: #7cb032;
          padding: 3px 10px;
          border-radius: 12px;
          font-weight: bold;
          text-transform: uppercase;
          display: inline-block;
        }
        .tree-line-vertical {
          width: 2px;
          height: 40px;
          background-color: #7cb032;
          position: relative;
          z-index: 1;
        }
        .tree-branches {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 760px;
          position: relative;
          z-index: 1;
        }
        .tree-branches::before {
          content: "";
          position: absolute;
          top: 0;
          left: 25%;
          right: 25%;
          height: 2px;
          background-color: #7cb032;
          z-index: 1;
        }
        .tree-branch-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 48%;
          position: relative;
        }
        .tree-branch-node::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 20px;
          background-color: #7cb032;
          z-index: 1;
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
                Organogram & Directory
              </span>
              <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '-0.5px', margin: '0 0 10px 0' }}>
                Join As Developer
              </h1>
              <p className="page-breadcrumb" style={{ fontSize: '13px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#7cb032', fontWeight: 'bold' }}>Home</Link> / Team / Structure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM HIERARCHY TREE SECTION */}
      <section className="section-content-block" style={{ padding: '80px 0 60px 0' }}>
        <div className="container text-center">
          <div className="row">
            <div className="col-sm-12">
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e211c', textTransform: 'uppercase', marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <FaUsers style={{ color: '#7cb032' }} /> Dev Team Organogram
              </h2>
              <p style={{ color: '#656b60', fontSize: '14px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 50px auto' }}>
                The hierarchical structure of engineers, designers, and systems architects who collaborated to build the TreeFund crowdfunding platform.
              </p>
            </div>
          </div>

          <div className="tree-container">
            {/* LEVEL 1: Head Node */}
            <div className="tree-row">
              <div className="tree-node-card active-card">
                <img src={teamMembers.head.avatar} alt={teamMembers.head.name} className="tree-node-avatar" />
                <h4 className="tree-node-name">{teamMembers.head.name}</h4>
                <p className="tree-node-role">{teamMembers.head.role}</p>
                <span className="tree-node-tag">{teamMembers.head.tag}</span>
              </div>
            </div>

            {/* Connecting line down from Head */}
            <div className="tree-line-vertical"></div>

            {/* LEVEL 2 & 3: Branches */}
            <div className="tree-branches">
              {teamMembers.branches.map((branch, idx) => (
                <div key={idx} className="tree-branch-node">
                  {/* Level 2 Card */}
                  <div className="tree-node-card" style={{ marginBottom: '20px' }}>
                    <img src={branch.avatar} alt={branch.name} className="tree-node-avatar" />
                    <h4 className="tree-node-name">{branch.name}</h4>
                    <p className="tree-node-role">{branch.role}</p>
                    <span className="tree-node-tag">{branch.tag}</span>
                  </div>

                  {/* Connecting line down to Level 3 */}
                  <div className="tree-line-vertical" style={{ height: '30px' }}></div>

                  {/* LEVEL 3 Card */}
                  <div className="tree-node-card">
                    <img src={branch.subNode.avatar} alt={branch.subNode.name} className="tree-node-avatar" />
                    <h4 className="tree-node-name">{branch.subNode.name}</h4>
                    <p className="tree-node-role">{branch.subNode.role}</p>
                    <span className="tree-node-tag">{branch.subNode.tag}</span>
                  </div>
                </div>
              ))}
            </div>
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
