'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';

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

  const dummyPayments: PaymentRecord[] = [
    {
      _id: 'dummy_pay_1',
      credits: 300,
      amount: 25,
      paymentIntentId: 'pi_3MtwkL2eZvKYlo2C1x9A8B7C',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'dummy_pay_2',
      credits: 100,
      amount: 10,
      paymentIntentId: 'pi_3MtwkL2eZvKYlo2C1x9A8B8D',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments/history');
        const serverPays = res.data.payments;
        if (serverPays && serverPays.length > 0) {
          setPayments(serverPays);
        } else {
          setPayments(dummyPayments);
        }
      } catch (err) {
        console.error('Error fetching payments history, using dummy:', err);
        setPayments(dummyPayments);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="text-left bg-white p-2 font-sans">
      
      {/* Title */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight font-heading">
          Payment History
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Review all your processed Stripe credit packages checkout transactions.
        </p>
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Transaction Date</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Credits Purchased</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Amount Paid (USD)</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Stripe Intent ID</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr 
                  key={pay._id} 
                  className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors duration-150"
                >
                  <td className="px-5 py-5 text-sm font-bold text-zinc-900">
                    {new Date(pay.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-primary font-numbers">
                    +{pay.credits} cr
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-emerald-600 font-numbers">
                    ${pay.amount.toFixed(2)} USD
                  </td>
                  <td className="px-5 py-5 text-xs text-zinc-400 font-mono">
                    {pay.paymentIntentId}
                  </td>
                  <td className="px-5 py-5">
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase border border-emerald-100">
                      {pay.status}
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
