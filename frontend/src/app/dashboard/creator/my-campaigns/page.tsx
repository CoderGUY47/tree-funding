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

  const dummyCampaigns: Campaign[] = [
    {
      _id: 'dummy_camp_1',
      title: 'Support Stray Children & Local Orphanages',
      story: 'This campaign is designed to support stray children and local orphanages who have no one. Contributions will provide fresh meals, warm clothes, textbooks, and shelter infrastructure.',
      category: 'Humanitarian',
      fundingGoal: 15000,
      minimumContribution: 100,
      amountRaised: 4200,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      rewardInfo: 'Ecosystem Protector - An official badge and quarterly updates.',
      imageUrl: '/images/cause_1.jpg',
      status: 'approved'
    },
    {
      _id: 'dummy_camp_2',
      title: 'Feed the Hungry: Community Food Shelter',
      story: 'Help us keep local food shelters and community kitchens stocked. This campaign supplies healthy ingredients, warm meals, and basic hygienic products.',
      category: 'Social Care',
      fundingGoal: 8000,
      minimumContribution: 50,
      amountRaised: 6000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      rewardInfo: 'Solar Supporter Plaque - Engraved name on dashboard list.',
      imageUrl: '/images/cause_2.jpg',
      status: 'approved'
    }
  ];

  const fetchMyCampaigns = async () => {
    try {
      const res = await api.get('/campaigns?status=all');
      const filtered = res.data.campaigns
        .filter((c: any) => c.creatorEmail === user?.email)
        .sort((a: Campaign, b: Campaign) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
      
      if (filtered && filtered.length > 0) {
        setCampaigns(filtered);
      } else {
        setCampaigns(dummyCampaigns);
      }
    } catch (err) {
      console.error('Error fetching creator campaigns, using dummy:', err);
      setCampaigns(dummyCampaigns);
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
      // Don't update server for dummy campaign ids
      if (!editCampaign._id.startsWith('dummy_')) {
        await api.put(`/campaigns/${editCampaign._id}`, {
          title: editTitle,
          story: editStory,
          rewardInfo: editReward
        });
      }

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
      // Don't update server for dummy campaign ids
      if (!deleteCampaignId.startsWith('dummy_')) {
        await api.delete(`/campaigns/${deleteCampaignId}`);
      }
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
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#fde8e8',
            color: '#c81e1e',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            border: '1px solid #f8b4b4'
          }}>
            Rejected
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#fef3c7',
            color: '#d97706',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            border: '1px solid #fcd34d'
          }}>
            Pending
          </span>
        );
    }
  };

  return (
    <div style={{ textAlign: 'left', background: '#ffffff', padding: '10px' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '35px', borderBottom: '1px solid #eef2eb', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e211c', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          My Campaigns
        </h2>
        <p style={{ fontSize: '14px', color: '#656b60', marginTop: '6px', fontWeight: '500' }}>
          Review, edit, or delete campaigns launched by you. Deleting refunds all contributors.
        </p>
      </div>

      {success && !editCampaign && !deleteCampaignId && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '20px' }}>
          <FaCheckCircle style={{ color: '#3c763d', fontSize: '16px', flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {error && !editCampaign && !deleteCampaignId && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginBottom: '20px' }}>
          <FaExclamationCircle style={{ color: '#a94442', fontSize: '16px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', height: '240px', alignItems: 'center', justifyContent: 'center' }}>
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-emerald-500 animate-spin" />
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid #eef2eb', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff' }}>
            <thead>
              <tr style={{ background: '#fcfdfa', borderBottom: '1px solid #eef2eb' }}>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Campaign Title</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Raised / Goal</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Deadline</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'left', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '16px 20px', fontSize: '13px', textTransform: 'uppercase', color: '#656b60', fontWeight: 'bold', textAlign: 'center', letterSpacing: '0.5px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, index) => (
                <tr 
                  key={c._id} 
                  style={{ 
                    borderBottom: index === campaigns.length - 1 ? 'none' : '1px solid #eef2eb',
                    transition: 'background 0.2s',
                    verticalAlign: 'middle'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fcfdfa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                >
                  <td style={{ padding: '20px', fontSize: '16px', fontWeight: 'bold', color: '#1e211c', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.title}>
                    {c.title}
                  </td>
                  <td style={{ padding: '20px', fontSize: '15px', fontWeight: '500', color: '#1e211c' }}>
                    <span style={{ color: '#7cb032', fontWeight: 'bold' }}>{c.amountRaised}</span> / {c.fundingGoal} Credits
                  </td>
                  <td style={{ padding: '20px', fontSize: '14px', color: '#656b60', fontWeight: '500' }}>
                    {new Date(c.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '20px' }}>{getStatusLabel(c.status)}</td>
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link
                        href={`/campaign/${c._id}`}
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          background: '#f5f7f3',
                          border: '1px solid #dcdfd8',
                          color: '#1e211c',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 'bold'
                        }}
                        title="View Details"
                      >
                        <FaEye /> View
                      </Link>
                      <button
                        onClick={() => handleEditClick(c)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          background: '#7cb032',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                        title="Edit Details"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteCampaignId(c._id)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '13px',
                          background: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                        title="Delete & Refund"
                      >
                        <FaTrashAlt /> Delete
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
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2eb', paddingBottom: '15px', marginBottom: '20px' }}>
              <h4 style={{ margin: 0, fontWeight: 'bold', color: '#1e211c', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaEdit style={{ color: '#7cb032' }} /> Update Campaign details
              </h4>
              <button onClick={() => setEditCampaign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888' }}>
                <FaTimes />
              </button>
            </div>

            {success && (
              <div className="alert alert-success" style={{ fontSize: '12px', padding: '10px', marginBottom: '15px' }}>
                {success}
              </div>
            )}

            {error && (
              <div className="alert alert-danger" style={{ fontSize: '12px', padding: '10px', marginBottom: '15px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c' }}>Campaign Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcdfd8', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c' }}>Campaign Story</label>
                <textarea
                  required
                  rows={4}
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcdfd8', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e211c' }}>Reward Details</label>
                <input
                  type="text"
                  required
                  value={editReward}
                  onChange={(e) => setEditReward(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcdfd8', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditCampaign(null)}
                  style={{ background: '#f5f7f3', border: '1px solid #dcdfd8', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  style={{ background: '#7cb032', border: 'none', color: '#fff', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
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
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', textAlign: 'center' }}>
            
            <div style={{ color: '#ef4444', fontSize: '42px', marginBottom: '15px' }}>
              <FaUndoAlt />
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#1e211c', fontSize: '18px' }}>
              Confirm Campaign Deletion
            </h4>

            <p style={{ fontSize: '14px', color: '#656b60', lineHeight: '1.6', marginBottom: '25px' }}>
              Are you sure you want to delete this campaign? This action is irreversible. All approved supporter contributions will be fully refunded to their credits balance.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeleteCampaignId('')}
                style={{ width: '50%', background: '#f5f7f3', border: '1px solid #dcdfd8', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                style={{ width: '50%', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
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
