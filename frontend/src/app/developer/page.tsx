'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageBanner from '@/components/PageBanner';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaEnvelope, 
  FaCode, 
  FaGlobe, 
  FaUsers,
  FaCheckCircle,
  FaServer,
  FaShieldAlt,
  FaLeaf,
  FaChartLine
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      <PageBanner
        title="Join As Developer"
        bgImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Team' },
          { label: 'Directory' },
        ]}
      />

      {/* BENTO GRID TEAM SECTION */}
      <section className="py-20 flex-grow">
        <div className="container mx-auto px-6 max-w-[1400px]">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight m-0 font-heading flex items-center justify-center gap-2.5">
              <FaUsers className="text-primary" /> Meet the Engineering Team
            </h2>
            <p className="text-zinc-500 text-sm mt-3.5 max-w-lg mx-auto font-semibold leading-relaxed">
              Discover the engineers, compliance managers, and designers who deployed the TreeFund crowdfunding workspace.
            </p>
          </div>

          {/* Bento grid layout */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
          >
            
            {/* Bento Card 1: Large Text Banner (About Team) */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 border border-zinc-200 bg-white p-8 rounded-[7px] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center text-lg">
                  <FaCode />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 font-heading m-0 uppercase tracking-tight">
                  High-Impact Eco Engineering
                </h3>
                <p className="text-sm text-zinc-500 font-semibold leading-relaxed m-0">
                  Our development team balances micro-planting campaign architecture, Stripe ledger allocations, and Better Auth authentication security layers. We build local-first sandbox testing environments for carbon credits and withdrawal audit pipelines.
                </p>
              </div>
              <div className="flex gap-4 mt-6 border-t border-zinc-100 pt-5">
                <div>
                  <span className="text-2xl font-bold text-primary font-numbers">10</span>
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider block mt-1">Core Builders</span>
                </div>
                <div className="border-l border-zinc-200 pl-4">
                  <span className="text-2xl font-bold text-primary font-numbers">99.8%</span>
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider block mt-1">Uptime Goal</span>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 2: Team Member - CODERGUY */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[0].category}
                </span>
                <img src={teamMembers[0].avatar} alt={teamMembers[0].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 flex items-center gap-1.5 font-heading">
                    {teamMembers[0].name}
                    <FaCheckCircle className="text-emerald-500 text-sm" />
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[0].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[0].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[0].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[0].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 3: Team Member - Sarah Jenkins */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[1].category}
                </span>
                <img src={teamMembers[1].avatar} alt={teamMembers[1].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[1].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[1].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[1].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[1].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[1].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 4: Team Member - Marcus Chen */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[2].category}
                </span>
                <img src={teamMembers[2].avatar} alt={teamMembers[2].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[2].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[2].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[2].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[2].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[2].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 5: Text Block - Tech Stack & Architecture */}
            <motion.div 
              variants={itemVariants}
              className="border border-zinc-200 bg-zinc-900 text-white p-6 rounded-[7px] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-[7px] bg-white/10 text-white flex items-center justify-center text-sm">
                  <FaServer />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider m-0 text-primary">System Ledger Security</h4>
                <p className="text-xs text-zinc-400 font-semibold leading-relaxed m-0">
                  Transactions are logged sequentially in MongoDB using cryptographically linked credit values. This isolates client checkout operations from network payout errors.
                </p>
              </div>
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider mt-4">
                Architecture Standard
              </div>
            </motion.div>

            {/* Bento Card 6: Team Member - Elena Rostova */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[3].category}
                </span>
                <img src={teamMembers[3].avatar} alt={teamMembers[3].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[3].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[3].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[3].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[3].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[3].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 7: Team Member - David Kross */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[4].category}
                </span>
                <img src={teamMembers[4].avatar} alt={teamMembers[4].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[4].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[4].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[4].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[4].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[4].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 8: Large Text Banner - DevOps & Quality Assurance Values */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 border border-zinc-200 bg-white p-8 rounded-[7px] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-[7px] bg-primary/10 text-primary flex items-center justify-center text-lg">
                  <FaShieldAlt />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 font-heading m-0 uppercase tracking-tight">
                  Security Compliance & Automated Testing
                </h3>
                <p className="text-sm text-zinc-500 font-semibold leading-relaxed m-0">
                  Every deployment undergoes rigorous unit checks and schema validation. We verify authentication routes utilizing NextJS mock routes and protect against cross-site scripting vulnerabilities dynamically.
                </p>
              </div>
              <div className="flex gap-4 mt-6 border-t border-zinc-100 pt-5">
                <div>
                  <span className="text-2xl font-bold text-primary font-numbers">95%</span>
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider block mt-1">Test Coverage</span>
                </div>
                <div className="border-l border-zinc-200 pl-4">
                  <span className="text-2xl font-bold text-primary font-numbers">SOC2</span>
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider block mt-1">Compliance Target</span>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 9: Team Member - Aisha Rahman */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[5].category}
                </span>
                <img src={teamMembers[5].avatar} alt={teamMembers[5].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[5].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[5].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[5].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[5].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[5].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 10: Team Member - Kenji Sato */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[6].category}
                </span>
                <img src={teamMembers[6].avatar} alt={teamMembers[6].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[6].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[6].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[6].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[6].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[6].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 11: Team Member - Sophia Martinez */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[7].category}
                </span>
                <img src={teamMembers[7].avatar} alt={teamMembers[7].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[7].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[7].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[7].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[7].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[7].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 12: Text Block - Environmental Mission */}
            <motion.div 
              variants={itemVariants}
              className="border border-zinc-200 bg-emerald-900 text-white p-6 rounded-[7px] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-[7px] bg-white/10 text-white flex items-center justify-center text-sm">
                  <FaLeaf />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-wider m-0 text-emerald-400">Green Restoration</h4>
                <p className="text-xs text-zinc-200 font-semibold leading-relaxed m-0">
                  TreeFund channels funding into micro-planting projects, targeting regions like Sundarbans and deforested urban campuses to rebuild soil ecosystems.
                </p>
              </div>
              <div className="text-[10px] text-emerald-450 font-black uppercase tracking-wider mt-4">
                Climate Initiative
              </div>
            </motion.div>

            {/* Bento Card 13: Team Member - Liam Gallagher */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[8].category}
                </span>
                <img src={teamMembers[8].avatar} alt={teamMembers[8].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[8].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[8].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[8].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[8].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[8].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bento Card 14: Team Member - Olivia Vance */}
            <motion.div variants={itemVariants} className="border border-zinc-200 bg-white rounded-[7px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-52 relative overflow-hidden bg-zinc-50 shrink-0">
                <span className="absolute top-4 right-4 bg-[#5B5FEF] text-white text-[9px] font-black px-3 py-1.5 rounded-[7px] uppercase tracking-wider z-10 shadow-sm">
                  {teamMembers[9].category}
                </span>
                <img src={teamMembers[9].avatar} alt={teamMembers[9].name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-zinc-900 m-0 mb-1.5 font-heading">{teamMembers[9].name}</h4>
                  <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide m-0 mb-4">{teamMembers[9].role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {teamMembers[9].skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded-[7px] font-bold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                  <a href={`mailto:${teamMembers[9].email}`} className="text-xs sm:text-sm font-bold text-zinc-500 hover:text-primary transition-colors no-underline flex items-center gap-1.5">
                    <FaEnvelope className="text-primary text-sm" /> Contact
                  </a>
                  <a href={teamMembers[9].github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-[7px] bg-zinc-100 text-zinc-500 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs" title="GitHub">
                    <FaGithub />
                  </a>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* REPOSITORY CALL TO ACTION */}
      <section className="py-16 bg-[#F8FAFC] border-t border-zinc-200">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-zinc-200 rounded-[7px] p-10 shadow-xs"
          >
            <h3 className="text-base font-extrabold text-zinc-900 m-0 uppercase tracking-wider mb-2 font-heading">
              Explore the Project Source Code
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed m-0 mb-6 font-semibold">
              Access the frontend client and API server repositories on GitHub to see our codebase, database models, and deployment configurations.
            </p>
            <div className="flex gap-4.5 justify-center flex-wrap">
              <a 
                href={clientRepo} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-11 px-6 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-[7px] border-none no-underline transition-colors cursor-pointer"
              >
                <FaCode /> Client Repository
              </a>
              <a 
                href={serverRepo} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-11 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-[7px] border-none no-underline transition-colors cursor-pointer"
              >
                <FaGlobe /> Server Repository
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
