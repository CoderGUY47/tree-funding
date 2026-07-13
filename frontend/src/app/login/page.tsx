'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { FaSignInAlt, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(
        'Google Supporter', 
        'google_supporter@gmail.com', 
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

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
      <section className="section-content-block">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-sm-12">
              
              <div className="donation-form-wrapper" style={{ border: '1px solid #eee', background: '#fff', padding: '40px', borderRadius: '4px' }}>
                
                <form onSubmit={handleSubmit} className="donation_form">
                  
                  <div className="donation-form-info-2" style={{ border: 'none', padding: 0, margin: 0 }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaSignInAlt style={{ color: '#7cb032' }} /> Sign In to TreeFund
                    </h4>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '25px' }}>
                      Enter your account details below.
                    </p>

                    {error && (
                      <div className="alert alert-danger" style={{ fontSize: '12px', textAlign: 'center' }}>{error}</div>
                    )}

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <FaEnvelope style={{ color: '#7cb032' }} /> Email Address
                      </label>
                      <input
                        type="email"
                        required
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. admin@treefunding.com"
                        style={{ height: '40px', fontSize: '13px' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '25px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <FaLock style={{ color: '#7cb032' }} /> Password
                      </label>
                      <input
                        type="password"
                        required
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{ height: '40px', fontSize: '13px' }}
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-theme text-uppercase"
                        style={{ padding: '10px 30px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaSignInAlt /> {loading ? 'Signing In...' : 'Sign In'}
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn btn-pure-dark-bg"
                        style={{ padding: '10px 20px', fontSize: '12px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaGoogle /> Google Sign In
                      </button>
                    </div>

                  </div>

                </form>

                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '12px', color: '#666' }}>
                  Don't have an account? <Link href="/register" style={{ color: '#7cb032', fontWeight: 'bold' }}>Register here</Link>.
                  <br />
                  <span style={{ fontSize: '11px', color: '#888', marginTop: '10px', display: 'block' }}>
                    Quick access credentials: <strong>admin@treefunding.com</strong> / <strong>adminpassword123</strong>
                  </span>
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
