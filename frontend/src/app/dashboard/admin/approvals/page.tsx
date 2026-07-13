'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { 
  FaCheckSquare, 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaExclamationCircle, 
  FaCheckCircle 
} from 'react-icons/fa';
import Link from 'next/link';

interface Campaign {
  _id: string;
  title: string;
  creatorName: string;
  creatorEmail: string;
  fundingGoal: number;
  minimumContribution: number;
  category: string;
  imageUrl: string;
}

export default function CampaignApprovals() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPendingCampaigns = async () => {
    try {
      const res = await api.get('/campaigns?status=pending');
      setCampaigns(res.data.campaigns);
    } catch (err) {
      console.error('Error fetching pending campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/campaigns/${id}/approve`);
      setSuccess('Campaign approved successfully! It is now live to supporters.');
      setCampaigns(prev => prev.filter(c => c._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error approving campaign.');
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/campaigns/${id}/reject`);
      setSuccess('Campaign rejected and creator notified.');
      setCampaigns(prev => prev.filter(c => c._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error rejecting campaign.');
    } finally {
      setProcessingId('');
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaCheckSquare style={{ color: '#7cb032' }} /> Campaign Approvals
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Review new campaign submissions and decide to Approve or Reject them.
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
          <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading pending campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', border: '2px dashed #eee', borderRadius: '4px', background: '#fdfdfd' }}>
          <FaExclamationCircle style={{ fontSize: '32px', color: '#ccc', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>No Pending Campaigns</h4>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            When creators launch new campaigns, they will be listed here for approval.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered" style={{ margin: 0, fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', color: '#333' }}>
                <th style={{ fontWeight: 'bold' }}>Campaign Details</th>
                <th style={{ fontWeight: 'bold' }}>Creator</th>
                <th style={{ fontWeight: 'bold' }}>Target (Credits)</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} style={{ verticalAlign: 'middle' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                      />
                      <div style={{ minWidth: 0, maxWidth: '200px' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.title}>{c.title}</p>
                        <span className="label label-success" style={{ textTransform: 'uppercase', fontSize: '8px', fontWeight: 'bold', marginTop: '3px', display: 'inline-block' }}>
                          {c.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{c.creatorName}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#777' }}>{c.creatorEmail}</p>
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#333' }}>{c.fundingGoal} Credits</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Link
                        href={`/campaign/${c._id}`}
                        className="btn"
                        style={{ padding: '5px 10px', fontSize: '12px', background: '#eee', color: '#555' }}
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => handleApprove(c._id)}
                        disabled={processingId !== ''}
                        className="btn btn-theme"
                        style={{ padding: '5px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(c._id)}
                        disabled={processingId !== ''}
                        className="btn"
                        style={{ padding: '5px 12px', fontSize: '12px', background: '#d9534f', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
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
