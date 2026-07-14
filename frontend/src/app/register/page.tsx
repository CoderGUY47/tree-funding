'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  FaUserPlus, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaImage, 
  FaGoogle 
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Register() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Supporter' | 'Creator'>('Supporter');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<'Supporter' | 'Creator'>('Supporter');

  const handleTabChange = (selectedRole: 'Supporter' | 'Creator') => {
    setActiveRole(selectedRole);
    setRole(selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side password strength check
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.');
      setLoading(false);
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password, role, photoUrl);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Error occurred during registration.');
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

  return (
    <div className="bg-zinc-50 min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* PAGE HEADER */}
      <section 
        className="relative py-20 text-white text-center bg-cover bg-center shrink-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(18, 20, 15, 0.75), rgba(18, 20, 15, 0.85)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200')`
        }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <h3 className="text-white text-3xl font-black uppercase tracking-tight m-0">
            Create Account
          </h3>
          <p className="text-xs text-zinc-300 mt-2 font-medium">
            <Link href="/" className="text-zinc-300 hover:text-white no-underline">Home</Link> / Register
          </p>
        </div>
      </section>

      {/* FORM BODY */}
      <section className="py-16 flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 w-full max-w-md">
          
          <Card className="bg-white border border-zinc-150 rounded-2xl shadow-lg p-8">
            <CardHeader className="p-0 pb-6 text-left">
              <CardTitle className="text-xl font-extrabold text-zinc-900 flex items-center gap-2 m-0">
                <FaUserPlus className="text-emerald-500" /> Start on TreeFund
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 mt-1.5 font-medium leading-relaxed">
                Choose a role and fill out form details to claim your registration credits.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {/* Role Selection Tabs */}
              <div className="flex gap-1.5 bg-zinc-100 p-1.5 rounded-xl mb-6">
                {(['Supporter', 'Creator'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleTabChange(r)}
                    className={`flex-1 py-2 text-[10px] font-extrabold uppercase rounded-lg border-none cursor-pointer transition-colors ${
                      activeRole === r 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {r} {r === 'Supporter' ? '(+50 cr)' : '(+20 cr)'}
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs text-center mb-5 font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <FaUser className="text-emerald-500 shrink-0" /> Full Name
                  </Label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-11 rounded-xl border border-zinc-250 px-4 text-sm focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <FaEnvelope className="text-emerald-500 shrink-0" /> Email Address
                  </Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@treefunding.com"
                    className="h-11 rounded-xl border border-zinc-250 px-4 text-sm focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Profile Photo URL */}
                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <FaImage className="text-emerald-500 shrink-0" /> Profile Picture URL (Optional)
                  </Label>
                  <Input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="e.g. https://example.com/avatar.jpg"
                    className="h-11 rounded-xl border border-zinc-250 px-4 text-sm focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <FaLock className="text-emerald-500 shrink-0" /> Password
                  </Label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="h-11 rounded-xl border border-zinc-250 px-4 text-sm focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex gap-3 mt-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 flex-1 rounded-xl flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                  >
                    <FaUserPlus /> {loading ? 'Registering...' : 'Register'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-11 flex-1 rounded-xl flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                  >
                    <FaGoogle /> Google Sign Up
                  </Button>
                </div>

              </form>

              <div className="mt-6 border-t border-zinc-100 pt-5 text-xs text-zinc-500 text-left leading-relaxed">
                Already have an account? <Link href="/login" className="text-emerald-600 hover:underline font-bold">Sign In here</Link>.
              </div>

            </CardContent>
          </Card>

        </div>
      </section>

      <Footer />
    </div>
  );
}
