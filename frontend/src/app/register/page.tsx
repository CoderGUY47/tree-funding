'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PageBanner from '@/components/PageBanner';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaImage,
  FaGoogle,
  FaArrowRight,
  FaLeaf,
  FaCheckCircle,
} from 'react-icons/fa';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<'Supporter' | 'Creator'>('Supporter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (role: 'Supporter' | 'Creator') => {
    setActiveRole(role);
    setError('');
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google Auth registration failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password, activeRole, photoUrl);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'Free wallet credits on sign-up',
    'Direct campaign pledging',
    'Community-verified milestones',
    'Real-time contribution alerts',
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* AidUs-style inner page banner */}
      <PageBanner
        title="Create Account"
        bgImage="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Register' },
        ]}
      />

      {/* Page body */}
      <main className="flex-grow bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* ── Left: Info panel ── */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="bg-[#1a3c34] rounded-2xl p-8 text-white h-full relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-8">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <FaLeaf className="text-primary text-sm" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">TreeFund</span>
                </div>

                <h2 className="text-2xl font-black leading-snug mb-4">
                  Join the Movement.<br />
                  <span className="text-primary">Fund a Greener Future.</span>
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed mb-8">
                  Register today and start pledging wallet credits to verified environmental campaigns around the world.
                </p>

                <ul className="flex flex-col gap-3 mb-8">
                  {perks.map((perk, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-200">
                      <FaCheckCircle className="text-primary shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>

                {/* Side image */}
                <div className="relative h-44 rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600"
                    alt="Tree planting"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/80 to-transparent" />
                </div>
              </div>
            </div>

            {/* ── Right: Registration form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">

                {/* Form header */}
                <div className="mb-7">
                  <h2 className="text-2xl font-black text-zinc-900 mb-1">Start on TreeFund</h2>
                  <p className="text-zinc-500 text-sm">
                    Choose a role and fill out details to claim your registration credits.
                  </p>
                </div>

                {/* Role selector */}
                <div className="flex gap-2 mb-6 p-1 bg-zinc-100 rounded-xl">
                  {(['Supporter', 'Creator'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleTabChange(r)}
                      className={`flex-1 py-2.5 text-[11px] font-black uppercase rounded-[10px] border-none cursor-pointer transition-all tracking-wider ${
                        activeRole === r
                          ? 'bg-[#1a3c34] text-white shadow-sm'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {r} {r === 'Supporter' ? '(+50 CR)' : '(+20 CR)'}
                    </button>
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold mb-5 animate-in fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                      <FaUser className="text-primary text-xs" /> Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                      <FaEnvelope className="text-primary text-xs" /> Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@treefund.org"
                      className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Photo URL */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="photoUrl" className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                      <FaImage className="text-primary text-xs" /> Profile Picture URL
                      <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="photoUrl"
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                      <FaLock className="text-primary text-xs" /> Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 border-none cursor-pointer transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-60"
                    >
                      {loading ? 'Registering...' : 'Create Account'} <FaArrowRight className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="flex-1 h-12 rounded-full bg-[#1a3c34] hover:bg-[#1a3c34]/90 text-white font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 border-none cursor-pointer transition-all"
                    >
                      <FaGoogle className="text-sm" /> Google Sign Up
                    </button>
                  </div>

                  <p className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100 font-medium">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline no-underline">
                      Sign In here
                    </Link>
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
