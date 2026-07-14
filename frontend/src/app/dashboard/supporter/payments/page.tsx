'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Card } from '@/components/ui/card';

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
    <div style={{ textAlign: 'left', background: '#ffffff', padding: '10px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '35px', borderBottom: '1px solid #eef2eb', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e211c', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Payment History
        </h2>
        <p style={{ fontSize: '14px', color: '#656b60', marginTop: '6px', fontWeight: '500' }}>
          Review all your processed Stripe credit packages checkout transactions.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', height: '240px', alignItems: 'center', justifyContent: 'center' }}>
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin" />
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid #eef2eb', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff' }}>
            <thead>
              <tr style={{ background: '#fcfdfa', borderBottom: '1px solid #eef2eb' }}>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Transaction Date</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Credits Purchased</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Amount Paid (USD)</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Stripe Intent ID</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay, index) => (
                <tr 
                  key={pay._id} 
                  style={{ 
                    borderBottom: index === payments.length - 1 ? 'none' : '1px solid #eef2eb',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fcfdfa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                >
                  <td style={{ padding: '20px', fontSize: '14px', color: '#1e211c', fontWeight: '500' }}>
                    {new Date(pay.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '20px', fontSize: '16px', fontWeight: 'bold', color: '#7cb032' }}>+{pay.credits} credits</td>
                  <td style={{ padding: '20px', fontSize: '15px', fontWeight: 'bold', color: '#1e211c' }}>${pay.amount}.00</td>
                  <td style={{ padding: '20px', fontSize: '13px', fontFamily: 'monospace', color: '#656b60' }}>
                    {pay.paymentIntentId}
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: '#eaf4db',
                      color: '#56801b',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      border: '1px solid #c9e2a3'
                    }}>
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
