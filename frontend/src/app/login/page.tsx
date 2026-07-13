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
    <div style={{ background: '#fcfdfa', minHeight: '100vh' }}>
      <Navbar />

      {/* PAGE HEADER */}
      <section 
        className="page-header" 
        style={{
          backgroundImage: `linear-gradient(rgba(18, 20, 15, 0.75), rgba(18, 20, 15, 0.85)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h3 style={{ color: '#fff', fontSize: '30px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>
                Sign In
              </h3>
              <p className="page-breadcrumb" style={{ fontSize: '12px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#ccc' }}>Home</Link> / Login
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM BODY */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
              
              <Card style={{ 
                background: '#ffffff', 
                border: '1px solid #eef2eb', 
                borderRadius: '16px', 
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                padding: '40px 30px'
              }}>
                <CardHeader style={{ padding: '0 0 25px 0', textAlign: 'left' }}>
                  <CardTitle style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e211c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaSignInAlt style={{ color: '#7cb032' }} /> Sign In to TreeFund
                  </CardTitle>
                  <CardDescription style={{ fontSize: '13px', color: '#656b60', marginTop: '5px' }}>
                    Enter your account credentials to access your fundraising or support workspace.
                  </CardDescription>
                </CardHeader>

                <CardContent style={{ padding: 0 }}>
                  {error && (
                    <div className="alert alert-danger" style={{ fontSize: '12px', textAlign: 'center', borderRadius: '6px', marginBottom: '20px' }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Email Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                      <Label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaEnvelope style={{ color: '#7cb032' }} /> Email Address
                      </Label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. admin@treefunding.com"
                        style={{ height: '44px', borderRadius: '8px', border: '1px solid #dcdfd8', padding: '0 12px' }}
                      />
                    </div>

                    {/* Password Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                      <Label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaLock style={{ color: '#7cb032' }} /> Password
                      </Label>
                      <Input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{ height: '44px', borderRadius: '8px', border: '1px solid #dcdfd8', padding: '0 12px' }}
                      />
                    </div>

                    {/* Submit Actions */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                      <Button
                        type="submit"
                        disabled={loading}
                        style={{ 
                          background: '#7cb032', 
                          color: '#ffffff', 
                          fontWeight: 'bold', 
                          height: '44px', 
                          flex: 1, 
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <FaSignInAlt /> {loading ? 'Signing In...' : 'Sign In'}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        style={{ 
                          background: '#1e211c', 
                          color: '#ffffff', 
                          fontWeight: 'bold', 
                          height: '44px', 
                          flex: 1, 
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <FaGoogle /> Google Sign In
                      </Button>
                    </div>

                  </form>

                  <div style={{ marginTop: '30px', borderTop: '1px solid #f2f5f0', paddingTop: '20px', fontSize: '13px', color: '#656b60', textAlign: 'left' }}>
                    Don't have an account? <Link href="/register" style={{ color: '#7cb032', fontWeight: 'bold' }}>Register here</Link>.
                    <div style={{ background: '#f5f7f3', borderLeft: '3px solid #7cb032', padding: '12px', borderRadius: '4px', marginTop: '15px' }}>
                      <span style={{ fontSize: '11px', color: '#555e50', display: 'block', lineHeight: '1.6' }}>
                        💡 <strong>Quick access credentials:</strong><br />
                        Email: <code>admin@treefunding.com</code><br />
                        Password: <code>adminpassword123</code>
                      </span>
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
