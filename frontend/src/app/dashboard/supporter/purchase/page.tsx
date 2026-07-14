'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { FaShieldAlt, FaCreditCard, FaCrown, FaExclamationCircle, FaArrowRight, FaCoins, FaCheckCircle, FaTimes } from 'react-icons/fa';

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
      const res = await api.post('/payments/confirm', {
        paymentIntentId,
        credits: selectedPackage.credits,
        amount: selectedPackage.price
      });

      setSuccess(`Success! ${selectedPackage.credits} credits have been added to your profile.`);
      
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
    <div className="text-left bg-white p-2.5">
      
      {/* Title */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight">
          Purchase Credits
        </h2>
        <p className="text-sm text-zinc-555 mt-1.5 font-medium">
          Acquire platform credits to support green campaigns (10 credits = 1 USD equivalent).
        </p>
      </div>

      {error && !checkoutModalOpen && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-250 text-red-750 px-3.5 py-3.5 rounded-lg text-xs mb-5">
          <FaExclamationCircle className="text-base shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-9">
        {packages.map((pack) => (
          <div
            key={pack.credits}
            className={`rounded-2xl border p-6.5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden h-[350px] ${
              pack.highlight
                ? 'border-2 border-emerald-500 bg-white shadow-lg shadow-emerald-500/10'
                : 'border-zinc-200 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md'
            }`}
          >
            {pack.highlight && (
              <span className="absolute top-4 right-4 rounded-full bg-emerald-500 text-[9px] font-bold text-white px-2.5 py-1 flex items-center gap-1 uppercase tracking-wider">
                <FaCrown /> Popular
              </span>
            )}

            <div className="flex flex-col gap-4">
              <span className={`text-xs font-bold uppercase tracking-widest block ${
                pack.highlight ? 'text-emerald-600' : 'text-zinc-500'
              }`}>
                {pack.saving}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-3xl font-extrabold text-zinc-900 m-0 leading-none">
                  {pack.credits} cr
                </p>
                <p className="text-sm text-zinc-500 m-0 font-medium">Credits Package</p>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-5">
              <div className="flex items-baseline text-zinc-900">
                <span className="text-2xl font-bold">$</span>
                <span className="text-4xl font-extrabold tracking-tight leading-none">{pack.price}</span>
                <span className="text-zinc-500 ml-1.5 text-sm font-bold">USD</span>
              </div>

              <button
                onClick={() => handleSelectPackage(pack)}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold transition-all border-none cursor-pointer ${
                  pack.highlight
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900'
                }`}
              >
                Purchase Package
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Badge */}
      <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl flex items-center gap-3.5 max-w-xl">
        <FaShieldAlt className="text-3xl text-emerald-500 shrink-0" />
        <div className="text-xs leading-relaxed text-zinc-650">
          <strong className="text-zinc-900 block mb-1">Secure Transaction Processing</strong>
          We employ Industry-standard Stripe encryption key channels. Under simulated developer configs, checkout uses mock confirmation queries.
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-7.5 shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-sky-500" />

            <div className="flex justify-between items-center border-b border-zinc-155 pb-4 mb-5">
              <h3 className="m-0 font-bold text-zinc-900 text-lg flex items-center gap-2">
                <FaCreditCard className="text-emerald-500" /> Secure Checkout
              </h3>
              <button 
                onClick={() => setCheckoutModalOpen(false)} 
                className="bg-transparent border-none cursor-pointer text-lg text-zinc-405 hover:text-zinc-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-150 flex items-center justify-between text-sm mb-5">
              <div>
                <p className="font-bold text-zinc-900 m-0">{selectedPackage.credits} Credits</p>
                <p className="text-xs text-zinc-500 m-0">TreeFund Credit Package</p>
              </div>
              <p className="text-lg font-extrabold text-emerald-600 m-0">${selectedPackage.price}.00 USD</p>
            </div>

            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 px-3 py-3 rounded-lg text-xs mb-4">
                <FaCheckCircle className="text-base shrink-0" />
                <span>{success}</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-lg text-xs mb-4">
                <FaExclamationCircle className="text-base shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleProcessPayment} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4242 4242 4242 4242"
                  value={dummyCardNumber}
                  onChange={(e) => setDummyCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  className="w-full bg-white border border-zinc-300 text-sm text-zinc-900 rounded-lg py-2.5 px-3 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">Expiration</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={dummyExpiry}
                    onChange={(e) => setDummyExpiry(e.target.value)}
                    className="w-full bg-white border border-zinc-300 text-sm text-zinc-900 rounded-lg py-2.5 px-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider">CVC</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="123"
                    value={dummyCvc}
                    onChange={(e) => setDummyCvc(e.target.value)}
                    className="w-full bg-white border border-zinc-300 text-sm text-zinc-900 rounded-lg py-2.5 px-3 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(false)}
                  className="w-1/3 py-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-650 border-none cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white border-none cursor-pointer transition disabled:opacity-60"
                >
                  {loading ? 'Processing...' : 'Confirm Checkout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
