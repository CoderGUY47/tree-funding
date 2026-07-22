'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { FaPiggyBank, FaCheck, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

interface Withdrawal {
  _id: string;
  creatorName: string;
  creatorEmail: string;
  withdrawalCredit: number;
  withdrawalAmount: number;
  paymentSystem: string;
  accountNumber: string;
  status: string;
  withdrawDate: string;
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/withdrawals');
      const pendingRequests = res.data.withdrawals.filter((w: Withdrawal) => w.status === 'pending');
      setWithdrawals(pendingRequests);
    } catch (err) {
      console.error('Error fetching withdrawal requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handlePaymentSuccess = async (id: string) => {
    setProcessingId(id);
    setError('');
    setSuccess('');

    try {
      await api.patch(`/withdrawals/${id}/payout`);
      setSuccess('Withdrawal payout marked successful. Creator credits deducted.');
      setWithdrawals(prev => prev.filter(w => w._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing payout verification.');
    } finally {
      setProcessingId('');
    }
  };

  return (
    <div className="text-left bg-white p-2 font-sans">
      
      {/* Title Header */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight font-heading flex items-center gap-2.5">
          <FaPiggyBank className="text-primary" /> Withdrawal Requests
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Review pending creator cash withdrawal requests and mark payouts as completed.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaCheckCircle className="text-base shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaExclamationCircle className="text-base shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin" />
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-zinc-200 rounded-[24px] text-center bg-zinc-50">
          <FaExclamationCircle className="text-4xl text-zinc-400 mx-auto mb-4" />
          <h4 className="text-base font-bold text-zinc-900 m-0 mb-1 font-heading">No Pending Requests</h4>
          <p className="text-sm text-zinc-500 m-0 font-medium">When creators withdraw their earnings, requests will be listed here for confirmation.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Creator</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Credits to Exchange</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Cash Payout (USD)</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Transfer Channel</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-center tracking-wider">Payout</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors last:border-b-0">
                  <td className="px-5 py-5 text-sm font-bold text-zinc-805">
                    <p className="m-0 leading-tight">{w.creatorName}</p>
                    <p className="m-0 text-[10px] text-zinc-400 font-semibold mt-1">{w.creatorEmail}</p>
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-red-500 font-numbers">
                    -{w.withdrawalCredit} cr
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-emerald-600 font-numbers">
                    ${w.withdrawalAmount.toFixed(2)} USD
                  </td>
                  <td className="px-5 py-5 text-sm text-zinc-700">
                    <p className="m-0 font-bold leading-tight">{w.paymentSystem}</p>
                    <p className="m-0 text-[10px] text-zinc-405 font-mono mt-1">{w.accountNumber}</p>
                  </td>
                  <td className="px-5 py-5 text-center">
                    <button
                      onClick={() => handlePaymentSuccess(w._id)}
                      disabled={processingId !== ''}
                      className="h-9 px-4.5 rounded-xl bg-emerald-650 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-none cursor-pointer disabled:opacity-50 mx-auto"
                    >
                      <FaCheck /> Confirm Success
                    </button>
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
