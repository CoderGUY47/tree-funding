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
    <div style={{ textAlign: 'left' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPiggyBank style={{ color: '#7cb032' }} /> Withdrawal Requests
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Review pending creator cash withdrawal requests and mark payouts as completed.
        </p>
      </div>

      {success && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '20px' }}>
          <FaCheckCircle style={{ color: '#3c763d', fontSize: '16px', flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '20px' }}>
          <FaExclamationCircle style={{ color: '#a94442', fontSize: '16px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading withdrawal requests...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', border: '2px dashed #eee', borderRadius: '4px', background: '#fdfdfd' }}>
          <FaExclamationCircle style={{ fontSize: '32px', color: '#ccc', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>No Pending Requests</h4>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>When creators withdraw their earnings, requests will be listed here for confirmation.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered" style={{ margin: 0, fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', color: '#333' }}>
                <th style={{ fontWeight: 'bold' }}>Creator</th>
                <th style={{ fontWeight: 'bold' }}>Credits to Exchange</th>
                <th style={{ fontWeight: 'bold' }}>Cash Payout (USD)</th>
                <th style={{ fontWeight: 'bold' }}>Transfer Channel</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>Payout</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} style={{ verticalAlign: 'middle' }}>
                  <td>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{w.creatorName}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#777' }}>{w.creatorEmail}</p>
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#d9534f' }}>-{w.withdrawalCredit} Credits</td>
                  <td style={{ fontWeight: 'bold', color: '#7cb032' }}>${w.withdrawalAmount.toFixed(2)}</td>
                  <td>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{w.paymentSystem}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#777' }}>{w.accountNumber}</p>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handlePaymentSuccess(w._id)}
                      disabled={processingId !== ''}
                      className="btn btn-theme text-uppercase"
                      style={{ padding: '6px 15px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto' }}
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
