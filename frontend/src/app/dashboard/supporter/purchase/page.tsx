'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { ShieldCheck, CreditCard, Sparkles, AlertCircle, ArrowRight, HeartHandshake } from 'lucide-react';

export default function PurchaseCredit() {
  const { user, updateCredits } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ credits: number; price: number } | null>(null);
  const [dummyCardNumber, setDummyCardNumber] = useState('');
  const [dummyExpiry, setDummyExpiry] = useState('');
  const [dummyCvc, setDummyCvc] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

  const packages = [
    { credits: 100, price: 10, saving: 'Basic Pack', highlight: false },
    { credits: 300, price: 25, saving: 'Save 16%', highlight: false },
    { credits: 800, price: 60, saving: 'Save 25%', highlight: true },
    { credits: 1500, price: 110, saving: 'Save 27%', highlight: false },
  ];

  const handleSelectPackage = async (pack: { credits: number; price: number }) => {
    setError('');
    setSuccess('');
    setLoading(true);
    setSelectedPackage(pack);

    try {
      // Call backend to generate payment intent (real Stripe or simulated dummy)
      const res = await api.post('/payments/create-intent', { credits: pack.credits });
      
      setPaymentIntentId(res.data.paymentIntentId);
      setCheckoutModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error initializing payment gateway.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedPackage || !paymentIntentId) {
      setError('Invalid checkout session.');
      setLoading(false);
      return;
    }

    try {
      // Confirm payment on backend
      const res = await api.post('/payments/confirm', {
        paymentIntentId,
        credits: selectedPackage.credits,
        amount: selectedPackage.price
      });

      setSuccess(`Success! ${selectedPackage.credits} credits have been added to your profile.`);
      
      // Update credits in context
      if (res.data.userCredits !== undefined) {
        updateCredits(res.data.userCredits);
      }

      setTimeout(() => {
        setCheckoutModalOpen(false);
        setSelectedPackage(null);
        setSuccess('');
      }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Transaction confirmation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 id="purchase-credits-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Purchase Credits</h2>
        <p className="text-xs text-zinc-500 mt-1">Acquire platform credits to support green campaigns (10 credits = 1 USD equivalent).</p>
      </div>

      {error && !checkoutModalOpen && (
        <div className="p-3.5 text-xs text-red-400 bg-red-950/20 border border-red-900 rounded-lg flex gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pack) => (
          <div
            key={pack.credits}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
              pack.highlight
                ? 'bg-emerald-950/15 border-emerald-500/80 shadow-emerald-950/10 shadow-xl'
                : 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-800'
            }`}
          >
            {pack.highlight && (
              <span className="absolute top-3 right-3 rounded-full bg-emerald-500 text-[9px] font-bold text-white px-2 py-0.5 flex items-center gap-0.5">
                <Sparkles className="h-2.5 w-2.5" /> Popular
              </span>
            )}

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                {pack.saving}
              </span>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-white">{pack.credits} cr</p>
                <p className="text-xs text-zinc-400">Credits Package</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-baseline text-white">
                <span className="text-2xl font-bold">$</span>
                <span className="text-4xl font-extrabold tracking-tight">{pack.price}</span>
                <span className="text-zinc-500 ml-1 text-sm">USD</span>
              </div>

              <button
                onClick={() => handleSelectPackage(pack)}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-bold transition-all shadow-sm ${
                  pack.highlight
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-350 hover:text-white'
                }`}
              >
                Purchase Package
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 flex items-center gap-4.5 max-w-xl">
        <ShieldCheck className="h-7 w-7 text-emerald-500 shrink-0" />
        <div className="text-xs leading-relaxed text-zinc-400">
          <p className="font-bold text-white mb-0.5">Secure Transaction Processing</p>
          We employ Industry-standard Stripe encryption key channels. Under simulated developer configs, checkout uses mock confirmation queries.
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-850 p-6 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-teal-400" />

            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <CreditCard className="h-5 w-5 text-emerald-500" /> Secure Checkout
            </h3>
            
            <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-850 flex items-center justify-between text-sm">
              <div>
                <p className="font-bold text-white">{selectedPackage.credits} Credits</p>
                <p className="text-xs text-zinc-500">TreeFund Credit Package</p>
              </div>
              <p className="text-lg font-extrabold text-emerald-400">${selectedPackage.price}.00 USD</p>
            </div>

            {success && (
              <div className="p-3 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900 rounded-lg flex gap-1.5 items-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}
            
            {error && (
              <div className="p-3 text-xs text-red-400 bg-red-950/20 border border-red-900 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-550 uppercase">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4242 4242 4242 4242"
                    value={dummyCardNumber}
                    onChange={(e) => setDummyCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    className="w-full bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-550 rounded-lg py-2.5 px-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-550 uppercase">Expiration</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={dummyExpiry}
                    onChange={(e) => setDummyExpiry(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-550 rounded-lg py-2.5 px-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-550 uppercase">CVC</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="123"
                    value={dummyCvc}
                    onChange={(e) => setDummyCvc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-550 rounded-lg py-2.5 px-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition disabled:opacity-50"
                >
                  {loading ? 'Authorizing Payout...' : 'Confirm Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
