'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { 
  FaBriefcase, 
  FaEdit, 
  FaTrashAlt, 
  FaEye, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaTimes, 
  FaUndoAlt 
} from 'react-icons/fa';
import Link from 'next/link';

interface Campaign {
  _id: string;
  title: string;
  story: string;
  category: string;
  fundingGoal: number;
  minimumContribution: number;
  amountRaised: number;
  deadline: string;
  rewardInfo: string;
  imageUrl: string;
  status: string;
}

export default function MyCampaigns() {
  const { user } = useAuth();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Update campaign state
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editReward, setEditReward] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete confirmation state
  const [deleteCampaignId, setDeleteCampaignId] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchMyCampaigns = async () => {
    try {
      const res = await api.get('/campaigns?status=all');
      const filtered = res.data.campaigns
        .filter((c: any) => c.creatorEmail === user?.email)
        .sort((a: Campaign, b: Campaign) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
      
      setCampaigns(filtered);
    } catch (err) {
      console.error('Error fetching creator campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyCampaigns();
    }
  }, [user]);

  const handleEditClick = (camp: Campaign) => {
    setEditCampaign(camp);
    setEditTitle(camp.title);
    setEditStory(camp.story);
    setEditReward(camp.rewardInfo);
    setError('');
    setSuccess('');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCampaign) return;
    
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/campaigns/${editCampaign._id}`, {
        title: editTitle,
        story: editStory,
        rewardInfo: editReward
      });

      setSuccess('Campaign updated successfully!');
      
      setCampaigns(prev => prev.map(c => 
        c._id === editCampaign._id 
          ? { ...c, title: editTitle, story: editStory, rewardInfo: editReward } 
          : c
      ));

      setTimeout(() => {
        setEditCampaign(null);
        setSuccess('');
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update campaign.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCampaignId) return;
    
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/campaigns/${deleteCampaignId}`);
      setSuccess('Campaign deleted successfully and all contributors refunded.');
      
      setCampaigns(prev => prev.filter(c => c._id !== deleteCampaignId));
      setDeleteCampaignId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete campaign.');
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
          <FaBriefcase style={{ color: '#7cb032' }} /> My Campaigns
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Review, edit, or delete campaigns launched by you. Deleting refunds all contributors.
        </p>
      </div>

      {success && !editCampaign && !deleteCampaignId && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <FaCheckCircle style={{ color: '#3c763d', fontSize: '16px', flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {error && !editCampaign && !deleteCampaignId && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <FaExclamationCircle style={{ color: '#a94442', fontSize: '16px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin mx-auto" />
          <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading your campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', border: '2px dashed #eee', borderRadius: '4px', background: '#fdfdfd' }}>
          <FaExclamationCircle style={{ fontSize: '32px', color: '#ccc', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>No Campaigns Found</h4>
          <p style={{ fontSize: '12px', color: '#666', margin: '0 0 15px 0' }}>
            You haven't launched any fundraising campaigns yet.
          </p>
          <Link href="/dashboard/creator/add-campaign" className="btn btn-theme text-uppercase" style={{ fontSize: '11px', padding: '8px 20px' }}>
            Launch First Campaign
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered" style={{ margin: 0, fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', color: '#333' }}>
                <th style={{ fontWeight: 'bold' }}>Campaign Title</th>
                <th style={{ fontWeight: 'bold' }}>Raised / Goal</th>
                <th style={{ fontWeight: 'bold' }}>Deadline</th>
                <th style={{ fontWeight: 'bold' }}>Status</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} style={{ verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 'bold', color: '#333', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.title}>
                    {c.title}
                  </td>
                  <td>
                    <span style={{ color: '#7cb032', fontWeight: 'bold' }}>{c.amountRaised}</span> / {c.fundingGoal} Credits
                  </td>
                  <td>
                    {new Date(c.deadline).toLocaleDateString()}
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
                        onClick={() => handleEditClick(c)}
                        className="btn btn-theme"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        title="Edit Details"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteCampaignId(c._id)}
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

      {/* Edit Campaign Modal */}
      {editCampaign && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ background: '#fff', borderRadius: '4px', width: '100%', maxWidth: '500px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontWeight: 'bold', color: '#333', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaEdit style={{ color: '#7cb032' }} /> Update Campaign details
              </h4>
              <button onClick={() => setEditCampaign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#888' }}>
                <FaTimes />
              </button>
            </div>

            {success && (
              <div className="alert alert-success" style={{ fontSize: '11px', padding: '10px' }}>
                {success}
              </div>
            )}

            {error && (
              <div className="alert alert-danger" style={{ fontSize: '11px', padding: '10px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>Campaign Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>Campaign Story</label>
                <textarea
                  required
                  rows={4}
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#555', marginBottom: '4px' }}>Reward Details</label>
                <input
                  type="text"
                  required
                  value={editReward}
                  onChange={(e) => setEditReward(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditCampaign(null)}
                  className="btn"
                  style={{ background: '#eee', color: '#555', padding: '8px 20px', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-theme"
                  style={{ padding: '8px 20px', fontSize: '12px' }}
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCampaignId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div style={{ background: '#fff', borderRadius: '4px', width: '100%', maxWidth: '400px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            
            <div style={{ color: '#d9534f', fontSize: '40px', marginBottom: '15px' }}>
              <FaUndoAlt />
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
              Confirm Campaign Deletion
            </h4>

            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              Are you sure you want to delete this campaign? This action is irreversible. All approved supporter contributions will be fully refunded to their credits balance.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteCampaignId('')}
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
