'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { FaHistory, FaExclamationCircle } from 'react-icons/fa';

interface WithdrawalRecord {
  _id: string;
  withdrawalCredit: number;
  withdrawalAmount: number;
  paymentSystem: string;
  accountNumber: string;
  status: string;
  withdrawDate: string;
}

export default function CreatorPayments() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await api.get('/withdrawals/creator');
        setWithdrawals(res.data.withdrawals);
      } catch (err) {
        console.error('Error fetching creator payouts history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="label label-success" style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold' }}>
            Succeeded
          </span>
        );
      default:
        return (
          <span className="label label-warning" style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold' }}>
            Pending
          </span>
        );
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaHistory style={{ color: '#7cb032' }} /> Payout History
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Review all your processed cash withdrawals and pending transfer requests.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading payout records...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', border: '2px dashed #eee', borderRadius: '4px', background: '#fdfdfd' }}>
          <FaExclamationCircle style={{ fontSize: '32px', color: '#ccc', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>No Payout History Found</h4>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            Your requested campaign earnings withdrawals will be archived and displayed here.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered" style={{ margin: 0, fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', color: '#333' }}>
                <th style={{ fontWeight: 'bold' }}>Request Date</th>
                <th style={{ fontWeight: 'bold' }}>Credits Exchanged</th>
                <th style={{ fontWeight: 'bold' }}>Amount Payout (USD)</th>
                <th style={{ fontWeight: 'bold' }}>Channel Details</th>
                <th style={{ fontWeight: 'bold' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w._id} style={{ verticalAlign: 'middle' }}>
                  <td>{new Date(w.withdrawDate).toLocaleString()}</td>
                  <td style={{ fontWeight: 'bold', color: '#d9534f' }}>-{w.withdrawalCredit} Credits</td>
                  <td style={{ fontWeight: 'bold', color: '#7cb032' }}>${w.withdrawalAmount.toFixed(2)}</td>
                  <td>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{w.paymentSystem}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#777' }}>{w.accountNumber}</p>
                  </td>
                  <td>{getStatusBadge(w.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
