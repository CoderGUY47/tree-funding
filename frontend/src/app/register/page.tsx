'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
              
              <Card style={{ 
                background: '#ffffff', 
                border: '1px solid #eef2eb', 
                borderRadius: '16px', 
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                padding: '40px 30px'
              }}>
                <CardHeader style={{ padding: '0 0 25px 0', textAlign: 'left' }}>
                  <CardTitle style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e211c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUserPlus style={{ color: '#7cb032' }} /> Create New Account
                  </CardTitle>
                  <CardDescription style={{ fontSize: '13px', color: '#656b60', marginTop: '5px' }}>
                    Select your workspace role and register to start participating in environmental sustainability.
                  </CardDescription>
                </CardHeader>

                <CardContent style={{ padding: 0 }}>
                  {/* Role Selector Tabs */}
                  <div style={{ display: 'flex', gap: '8px', background: '#f5f7f3', padding: '6px', borderRadius: '10px', marginBottom: '25px' }}>
                    {(['Supporter', 'Creator'] as const).map((tRole) => (
                      <button
                        key={tRole}
                        type="button"
                        onClick={() => handleTabChange(tRole)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: activeRole === tRole ? '#7cb032' : 'transparent',
                          color: activeRole === tRole ? '#ffffff' : '#555e50'
                        }}
                      >
                        {tRole.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="alert alert-danger" style={{ fontSize: '12px', textAlign: 'center', borderRadius: '6px', marginBottom: '20px' }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div className="row">
                      {/* Full Name */}
                      <div className="col-sm-6" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginBottom: '15px' }}>
                        <Label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaUser style={{ color: '#7cb032' }} /> Full Name
                        </Label>
                        <Input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. John Doe"
                          style={{ height: '44px', borderRadius: '8px', border: '1px solid #dcdfd8', padding: '0 12px' }}
                        />
                      </div>

                      {/* Email Address */}
                      <div className="col-sm-6" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginBottom: '15px' }}>
                        <Label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaEnvelope style={{ color: '#7cb032' }} /> Email Address
                        </Label>
                        <Input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. john@example.com"
                          style={{ height: '44px', borderRadius: '8px', border: '1px solid #dcdfd8', padding: '0 12px' }}
                        />
                      </div>
                    </div>

                    <div className="row">
                      {/* Password */}
                      <div className="col-sm-6" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginBottom: '15px' }}>
                        <Label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaLock style={{ color: '#7cb032' }} /> Password
                        </Label>
                        <Input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Choose password (min 6 chars)"
                          style={{ height: '44px', borderRadius: '8px', border: '1px solid #dcdfd8', padding: '0 12px' }}
                        />
                      </div>

                      {/* Photo URL */}
                      <div className="col-sm-6" style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginBottom: '15px' }}>
                        <Label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaImage style={{ color: '#7cb032' }} /> Avatar Photo URL (Optional)
                        </Label>
                        <Input
                          type="url"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/..."
                          style={{ height: '44px', borderRadius: '8px', border: '1px solid #dcdfd8', padding: '0 12px' }}
                        />
                      </div>
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
                        <FaUserPlus /> {loading ? 'Registering...' : 'Register'}
                      </Button>

                      <Button
                        type="button"
                        onClick={handleGoogleRegister}
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
                        <FaGoogle /> Google Register
                      </Button>
                    </div>

                  </form>

                  <div style={{ marginTop: '30px', borderTop: '1px solid #f2f5f0', paddingTop: '20px', fontSize: '13px', color: '#656b60', textAlign: 'left' }}>
                    Already have an account? <Link href="/login" style={{ color: '#7cb032', fontWeight: 'bold' }}>Login here</Link>.
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
