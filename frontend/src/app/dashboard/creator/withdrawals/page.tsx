'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { 
  FaPiggyBank, 
  FaArrowAltCircleDown, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaWallet 
} from 'react-icons/fa';

export default function WithdrawEarnings() {
  const { user } = useAuth();
  
  const [creditsToWithdraw, setCreditsToWithdraw] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('Stripe');
  const [accountNumber, setAccountNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [creatorCredits, setCreatorCredits] = useState(0);
  const [pendingCredits, setPendingCredits] = useState(0);

  const fetchCreatorDetails = async () => {
    try {
      const profileRes = await api.get('/auth/profile');
      setCreatorCredits(profileRes.data.user.credits);

      const withdrawalsRes = await api.get('/withdrawals/creator');
      const pendingList = withdrawalsRes.data.withdrawals.filter((w: any) => w.status === 'pending');
      const pendingSum = pendingList.reduce((sum: number, w: any) => sum + w.withdrawalCredit, 0);
      setPendingCredits(pendingSum);

    } catch (err) {
      console.error('Error loading creator details:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreatorDetails();
    }
  }, [user]);

  const availableToWithdraw = Math.max(0, creatorCredits - pendingCredits);
  const totalEarningsInDollars = creatorCredits / 20;
  const withdrawableInDollars = availableToWithdraw / 20;

  const computedDollars = creditsToWithdraw ? Number(creditsToWithdraw) / 20 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const credits = Number(creditsToWithdraw);
    if (isNaN(credits) || credits <= 0) {
      setError('Please enter a valid credit number to withdraw.');
      setLoading(false);
      return;
    }

    if (credits < 200) {
      setError('Minimum withdrawal limit is 200 credits ($10).');
      setLoading(false);
      return;
    }

    if (credits > availableToWithdraw) {
      setError(`Insufficient credits. You can withdraw up to ${availableToWithdraw} credits.`);
      setLoading(false);
      return;
    }

    if (!accountNumber) {
      setError('Account details or credit card number is required.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/withdrawals', {
        withdrawalCredit: credits,
        paymentSystem,
        accountNumber
      });

      setSuccess('Withdrawal request submitted! Credits are locked and payout is pending Admin transfer.');
      setCreditsToWithdraw('');
      setAccountNumber('');
      fetchCreatorDetails();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing withdrawal request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPiggyBank style={{ color: '#7cb032' }} /> Withdraw Earnings
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Convert your raised campaign credits to USD payouts. 20 credits equal 1 Dollar.
        </p>
      </div>

      {/* Balance widgets */}
      <div className="row" style={{ marginBottom: '25px' }}>
        <div className="col-md-6 col-sm-12" style={{ marginBottom: '15px' }}>
          <div style={{ padding: '20px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Raised Balance</span>
            <h4 style={{ margin: '8px 0 0 0', fontWeight: 'bold', color: '#333', fontSize: '24px' }}>
              {creatorCredits} Credits <span style={{ fontSize: '14px', color: '#7cb032', fontWeight: 'normal' }}>(${totalEarningsInDollars.toFixed(2)})</span>
            </h4>
          </div>
        </div>

        <div className="col-md-6 col-sm-12" style={{ marginBottom: '15px' }}>
          <div style={{ padding: '20px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Withdrawable Balance</span>
            <h4 style={{ margin: '8px 0 0 0', fontWeight: 'bold', color: '#7cb032', fontSize: '24px' }}>
              {availableToWithdraw} Credits <span style={{ fontSize: '14px', color: '#555', fontWeight: 'normal' }}>(${withdrawableInDollars.toFixed(2)})</span>
            </h4>
            {pendingCredits > 0 && (
              <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#d9534f' }}>({pendingCredits} credits locked in pending withdrawals)</p>
            )}
          </div>
        </div>
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

      {availableToWithdraw < 200 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', border: '2px dashed #eee', borderRadius: '4px', background: '#fdfdfd' }}>
          <FaWallet style={{ fontSize: '32px', color: '#f0ad4e', marginBottom: '10px' }} />
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#d9534f', margin: '0 0 8px 0' }}>Insufficient credit</p>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            You need a minimum of 200 credits ($10.00 equivalent) to submit a withdrawal request.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ margin: 0 }}>
          
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaArrowAltCircleDown style={{ color: '#7cb032' }} /> Payout Request Form
          </h4>

          {/* Credits To Withdraw */}
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Credits To Withdraw</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                required
                min={200}
                max={availableToWithdraw}
                placeholder="Minimum 200 credits"
                value={creditsToWithdraw}
                onChange={(e) => setCreditsToWithdraw(e.target.value)}
                style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', paddingRight: '40px' }}
              />
              <span style={{ position: 'absolute', right: '15px', top: '10px', fontSize: '12px', fontWeight: 'bold', color: '#999' }}>cr</span>
            </div>
          </div>

          {/* Conversion Display */}
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Payout Amount (USD)</label>
            <input
              type="text"
              readOnly
              value={creditsToWithdraw ? `$ ${computedDollars.toFixed(2)} USD` : '$ 0.00 USD'}
              style={{ width: '100%', padding: '10px 15px', border: '1px solid #eee', background: '#f9f9f9', color: '#555', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', cursor: 'not-allowed' }}
            />
            <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#777' }}>Calculated at standard 20:1 platform business rates.</p>
          </div>

          {/* Payout Channel dropdown */}
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Select Payout Channel</label>
            <select
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', background: '#fff', height: '40px' }}
            >
              <option value="Stripe">Stripe</option>
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Nagad">Nagad</option>
              <option value="Bank Transfer">Bank Wire Transfer</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          {/* Payout Address Details */}
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '5px' }}>Account Address / Details</label>
            <input
              type="text"
              required
              placeholder="e.g., Stripe card number, Bank routing, or PayPal email"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-theme text-uppercase"
            style={{ padding: '12px 35px', fontSize: '12px', fontWeight: 'bold' }}
          >
            {loading ? 'Requesting...' : 'Request Payout'}
          </button>

        </form>
      )}

    </div>
  );
}
