'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { History, CreditCard, AlertCircle } from 'lucide-react';

interface PaymentRecord {
  _id: string;
  credits: number;
  amount: number;
  paymentIntentId: string;
  status: string;
  createdAt: string;
}

export default function SupporterPayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments/history');
        setPayments(res.data.payments);
      } catch (err) {
        console.error('Error fetching payments history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 id="payment-history-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Payment History</h2>
        <p className="text-xs text-zinc-500 mt-1">Review all your processed Stripe credit packages checkout transactions.</p>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10">
          <AlertCircle className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-zinc-300">No payment records found</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Your successfully processed credit package transactions will be listed here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-900 rounded-xl bg-zinc-900/10">
          <table className="w-full text-sm text-left text-zinc-400">
            <thead className="text-xs uppercase bg-zinc-950/60 text-zinc-400 border-b border-zinc-900">
              <tr>
                <th scope="col" className="px-6 py-4">Transaction Date</th>
                <th scope="col" className="px-6 py-4">Credits Purchased</th>
                <th scope="col" className="px-6 py-4">Amount Paid (USD)</th>
                <th scope="col" className="px-6 py-4">Stripe Intent ID</th>
                <th scope="col" className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60">
              {payments.map((pay) => (
                <tr key={pay._id} className="hover:bg-zinc-900/30">
                  <td className="px-6 py-4 text-xs font-medium text-zinc-300">
                    {new Date(pay.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-white">+{pay.credits} credits</td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">${pay.amount}.00</td>
                  <td className="px-6 py-4 text-xs font-mono text-zinc-550 select-all" title={pay.paymentIntentId}>
                    {pay.paymentIntentId}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/65 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-900/30">
                      Succeeded
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
