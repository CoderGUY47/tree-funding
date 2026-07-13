'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { 
  FaFileAlt, 
  FaTrashAlt, 
  FaExclamationCircle, 
  FaEye, 
  FaCheckCircle, 
  FaUndoAlt 
} from 'react-icons/fa';
import Link from 'next/link';

interface Campaign {
  _id: string;
  title: string;
  creatorName: string;
  creatorEmail: string;
  fundingGoal: number;
  amountRaised: number;
  category: string;
  status: string;
}

export default function ManageCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete campaign confirmation
  const [deleteId, setDeleteId] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns?status=all');
      setCampaigns(res.data.campaigns);
    } catch (err) {
      console.error('Error fetching campaigns directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/campaigns/${deleteId}`);
      setSuccess('Campaign successfully deleted and backers refunded.');
      setCampaigns(prev => prev.filter(c => c._id !== deleteId));
      setDeleteId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting campaign.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="label label-success" style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold' }}>
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="label label-danger" style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold' }}>
            Rejected
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
          <FaFileAlt style={{ color: '#7cb032' }} /> Manage Campaigns
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Monitor all campaigns created on the platform. Deleting a campaign initiates automatic backer refunds.
        </p>
      </div>

      {success && !deleteId && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '20px' }}>
          <FaCheckCircle style={{ color: '#3c763d', fontSize: '16px', flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {error && !deleteId && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '20px' }}>
          <FaExclamationCircle style={{ color: '#a94442', fontSize: '16px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading campaigns directory...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', border: '2px dashed #eee', borderRadius: '4px', background: '#fdfdfd' }}>
          <FaExclamationCircle style={{ fontSize: '32px', color: '#ccc', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>No Campaigns Found</h4>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered" style={{ margin: 0, fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', color: '#333' }}>
                <th style={{ fontWeight: 'bold' }}>Campaign Name</th>
                <th style={{ fontWeight: 'bold' }}>Creator</th>
                <th style={{ fontWeight: 'bold' }}>Goal / Raised</th>
                <th style={{ fontWeight: 'bold' }}>Status</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} style={{ verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 'bold', color: '#333', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.title}>
                    {c.title}
                  </td>
                  <td>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{c.creatorName}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#777' }}>{c.creatorEmail}</p>
                  </td>
                  <td>
                    Goal: {c.fundingGoal} Credits / <span style={{ color: '#7cb032', fontWeight: 'bold' }}>{c.amountRaised} Credits</span>
                  </td>
                  <td>{getStatusLabel(c.status)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <Link
                        href={`/campaign/${c._id}`}
                        className="btn"
                        style={{ padding: '4px 8px', fontSize: '12px', background: '#eee', color: '#555' }}
                        title="View Details"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => setDeleteId(c._id)}
                        className="btn"
                        style={{ padding: '4px 8px', fontSize: '12px', background: '#d9534f', color: '#fff' }}
                        title="Delete & Refund"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Campaign Confirmation Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ background: '#fff', borderRadius: '4px', width: '100%', maxWidth: '400px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            
            <div style={{ color: '#d9534f', fontSize: '40px', marginBottom: '15px' }}>
              <FaUndoAlt />
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
              Remove Campaign
            </h4>

            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              Are you sure you want to delete this campaign? This action is irreversible. All approved supporter contributions will be refunded to their credit accounts.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteId('')}
                className="btn"
                style={{ width: '50%', background: '#eee', color: '#555', padding: '10px', fontSize: '12px', fontWeight: 'bold' }}
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="btn"
                style={{ width: '50%', background: '#d9534f', color: '#fff', padding: '10px', fontSize: '12px', fontWeight: 'bold' }}
              >
                {deleting ? 'Refunding...' : 'Yes, Delete & Refund'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
