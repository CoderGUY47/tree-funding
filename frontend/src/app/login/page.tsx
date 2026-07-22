'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import PageBanner from '@/components/PageBanner';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaArrowRight,
  FaLeaf,
  FaShieldAlt,
  FaBolt,
} from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('supporter@gmail.com');
  const [password, setPassword] = useState('treefund123');
  const [activeRole, setActiveRole] = useState<'Supporter' | 'Creator' | 'Admin'>('Supporter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const handleTabChange = (role: 'Supporter' | 'Creator' | 'Admin') => {
    setActiveRole(role);
    if (role === 'Admin') {
      setEmail('admin@gmail.com');
      setPassword('treefund123');
    } else if (role === 'Creator') {
      setEmail('creater@gmail.com');
      setPassword('treefund123');
    } else {
      setEmail('supporter@gmail.com');
      setPassword('treefund123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

  const features = [
    { icon: <FaShieldAlt className="text-white" />, text: 'Secure encrypted login' },
    { icon: <FaBolt className="text-white" />, text: 'Instant dashboard access' },
    { icon: <FaLeaf className="text-white" />, text: 'Track your green impact' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* AidUs-style inner page banner */}
      <PageBanner
        title="Sign In"
        bgImage="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1600"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Sign In' },
        ]}
      />

      {/* Page body */}
      <main className="flex-grow bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">

            {/* ── Left: login form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">

                {/* Form header */}
                <div className="mb-7">
                  <h2 className="text-2xl font-black text-zinc-900 mb-1">Welcome Back</h2>
                  <p className="text-zinc-500 text-sm">
                    Choose your role and credentials to access your dashboard.
                  </p>
                </div>

                {/* Role selector */}
                <div className="flex gap-2 mb-6 p-1 bg-zinc-100 rounded-xl">
                  {(['Supporter', 'Creator', 'Admin'] as const).map((r) => (
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
                      {r}
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
                      placeholder="e.g. supporter@gmail.com"
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
                      placeholder="Enter your password"
                      className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 border-none cursor-pointer transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-60"
                    >
                      {loading ? 'Signing In...' : 'Sign In'} <FaArrowRight className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="flex-1 h-12 rounded-full bg-[#1a3c34] hover:bg-[#1a3c34]/90 text-white font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 border-none cursor-pointer transition-all"
                    >
                      <FaGoogle className="text-sm" /> Google Sign In
                    </button>
                  </div>

                  <p className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100 font-medium">
                    New to TreeFund?{' '}
                    <Link href="/register" className="text-primary font-bold hover:underline no-underline">
                      Register an account
                    </Link>{' '}
                    to claim your default wallet credits.
                  </p>
                </form>
              </div>
            </div>

            {/* ── Right: Info panel (All text white) ── */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="bg-[#1a3c34] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <FaLeaf className="text-white text-sm" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white">TreeFund</span>
                </div>

                <h3 className="text-xl font-black leading-snug mb-3 text-white">
                  Access Your<br />
                  <span className="text-white">Green Dashboard</span>
                </h3>
                <p className="text-white text-sm leading-relaxed mb-7 font-medium">
                  Manage campaigns, track wallet credits, and monitor your environmental contributions — all in one place.
                </p>

                <ul className="flex flex-col gap-4 mb-7 p-0 m-0 list-none">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white font-semibold">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white">
                        {f.icon}
                      </div>
                      <span className="text-white">{f.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative h-40 rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600"
                    alt="Forest"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/80 to-transparent" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
