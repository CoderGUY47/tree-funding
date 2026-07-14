'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  FaSignInAlt, 
  FaEnvelope, 
  FaLock, 
  FaGoogle 
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeRole, setActiveRole] = useState<'Supporter' | 'Creator' | 'Admin'>('Supporter');

  const handleTabChange = (role: 'Supporter' | 'Creator' | 'Admin') => {
    setActiveRole(role);
    if (role === 'Admin') {
      setEmail('admin@treefunding.com');
      setPassword('adminpassword123');
    } else if (role === 'Creator') {
      setEmail('creator@treefunding.com');
      setPassword('creatorpassword123');
    } else {
      setEmail('');
      setPassword('');
    }
  };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
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
            Sign In
          </h3>
          <p className="text-xs text-zinc-300 mt-2 font-medium">
            <Link href="/" className="text-zinc-300 hover:text-white no-underline">Home</Link> / Login
          </p>
        </div>
      </section>

      {/* FORM BODY */}
      <section className="py-20 flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 w-full max-w-md">
          
          <Card className="bg-white border border-zinc-150 rounded-2xl shadow-lg p-8">
            <CardHeader className="p-0 pb-6 text-left">
              <CardTitle className="text-xl font-extrabold text-zinc-900 flex items-center gap-2 m-0">
                <FaSignInAlt className="text-emerald-500" /> Sign In to TreeFund
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 mt-1.5 font-medium leading-relaxed">
                Enter your account credentials to access your fundraising or support workspace.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {/* Role Selection Tabs */}
              <div className="flex gap-1.5 bg-zinc-100 p-1.5 rounded-xl mb-6">
                {(['Supporter', 'Creator', 'Admin'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleTabChange(role)}
                    className={`flex-1 py-2 text-[10px] font-extrabold uppercase rounded-lg border-none cursor-pointer transition-colors ${
                      activeRole === role 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-transparent text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs text-center mb-5 font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Email Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <FaEnvelope className="text-emerald-500" /> Email Address
                  </Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@treefunding.com"
                    className="h-11 rounded-xl border border-zinc-250 px-4 text-sm focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5 text-left">
                  <Label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <FaLock className="text-emerald-500" /> Password
                  </Label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="h-11 rounded-xl border border-zinc-250 px-4 text-sm focus-visible:ring-emerald-500"
                  />
                </div>

                {/* Submit Actions */}
                <div className="flex gap-3 mt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 flex-1 rounded-xl flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                  >
                    <FaSignInAlt /> {loading ? 'Signing In...' : 'Sign In'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-11 flex-1 rounded-xl flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors"
                  >
                    <FaGoogle /> Google Sign In
                  </Button>
                </div>

              </form>

              <div className="mt-6 border-t border-zinc-100 pt-5 text-xs text-zinc-500 text-left leading-relaxed">
                Don't have an account? <Link href="/register" className="text-emerald-600 hover:underline font-bold">Register here</Link>.
                <div className="bg-zinc-50 border-l-4 border-emerald-500 p-4 rounded-r-xl mt-4">
                  <span className="text-[10px] text-zinc-650 block leading-relaxed">
                    💡 <strong>Quick access credentials:</strong><br />
                    Email: <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-800">admin@treefunding.com</code><br />
                    Password: <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-800">adminpassword123</code>
                  </span>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </section>

      <Footer />
    </div>
  );
}
