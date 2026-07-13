'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaImage, FaBriefcase, FaGoogle } from 'react-icons/fa';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(name, email, password, role, photoUrl);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle(
        'Google Supporter', 
        `google_${Date.now()}@gmail.com`, 
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      );
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google registration failed.');
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
                Register
              </h3>
              <p className="page-breadcrumb" style={{ fontSize: '12px', color: '#ccc', marginTop: '10px' }}>
                <Link href="/" style={{ color: '#ccc' }}>Home</Link> / Register
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
                      <FaUserPlus style={{ color: '#7cb032' }} /> Create New Account
                    </h4>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '25px' }}>
                      Register to start funding campaigns or sharing environmental stories.
                    </p>

                    {error && (
                      <div className="alert alert-danger" style={{ fontSize: '12px', textAlign: 'center' }}>{error}</div>
                    )}

                    {/* Full Name */}
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <FaUser style={{ color: '#7cb032' }} /> Full Name
                      </label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        style={{ height: '40px', fontSize: '13px' }}
                      />
                    </div>

                    {/* Email */}
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
                        placeholder="e.g. john@example.com"
                        style={{ height: '40px', fontSize: '13px' }}
                      />
                    </div>

                    {/* Password */}
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <FaLock style={{ color: '#7cb032' }} /> Password
                      </label>
                      <input
                        type="password"
                        required
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose password (min 6 chars)"
                        style={{ height: '40px', fontSize: '13px' }}
                      />
                    </div>

                    {/* Photo URL */}
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <FaImage style={{ color: '#7cb032' }} /> Avatar Photo URL (Optional)
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/..."
                        style={{ height: '40px', fontSize: '13px' }}
                      />
                    </div>

                    {/* Role Selector */}
                    <div className="form-group" style={{ marginBottom: '25px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <FaBriefcase style={{ color: '#7cb032' }} /> Account Role Type
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'Supporter' | 'Creator')}
                        className="form-control"
                        style={{ height: '40px', fontSize: '13px', padding: '5px 10px' }}
                      >
                        <option value="Supporter">Supporter (Starts with 50 credits)</option>
                        <option value="Creator">Creator (Starts with 20 credits)</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-theme text-uppercase"
                        style={{ padding: '10px 30px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaUserPlus /> {loading ? 'Registering...' : 'Register'}
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleRegister}
                        className="btn btn-pure-dark-bg"
                        style={{ padding: '10px 20px', fontSize: '12px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaGoogle /> Google Register
                      </button>
                    </div>

                  </div>

                </form>

                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '12px', color: '#666' }}>
                  Already have an account? <Link href="/login" style={{ color: '#7cb032', fontWeight: 'bold' }}>Login here</Link>.
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
