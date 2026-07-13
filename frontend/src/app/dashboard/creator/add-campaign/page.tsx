'use client';

import React, { useState } from 'react';
import api from '@/utils/api';
import { 
  FaPlusCircle, 
  FaImage, 
  FaLeaf, 
  FaCalendarAlt, 
  FaCoins, 
  FaGift, 
  FaExclamationCircle, 
  FaCheckCircle 
} from 'react-icons/fa';

export default function AddCampaign() {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [category, setCategory] = useState('Humanitarian');
  const [fundingGoal, setFundingGoal] = useState('');
  const [minimumContribution, setMinimumContribution] = useState('');
  const [deadline, setDeadline] = useState('');
  const [rewardInfo, setRewardInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['Humanitarian', 'Social Care', 'Reforestation', 'Solar', 'Forestry', 'Other'];

  // Handle imgBB upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (apiKey && apiKey !== 'YOUR_IMGBB_KEY') {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.success) {
          setImageUrl(data.data.url);
          setSuccess('Campaign banner uploaded successfully via imgBB!');
        } else {
          throw new Error('imgBB response error.');
        }
      } else {
        // Fallback simulation using local template cause images
        setTimeout(() => {
          const simulatedUrls = [
            '/images/cause_1.jpg',
            '/images/cause_2.jpg',
            '/images/cause_3.jpg'
          ];
          const randomUrl = simulatedUrls[Math.floor(Math.random() * simulatedUrls.length)];
          setImageUrl(randomUrl);
          setSuccess('Simulated cover image upload successful (ImgBB Key missing).');
          setUploading(false);
        }, 1500);
      }
    } catch (err) {
      setError('Banner upload failed. Please paste a direct image URL link below instead.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (Number(fundingGoal) <= 0 || Number(minimumContribution) <= 0) {
      setError('Funding goal and minimum contribution must be positive numbers.');
      setLoading(false);
      return;
    }

    if (new Date(deadline) <= new Date()) {
      setError('Campaign deadline must be a future date.');
      setLoading(false);
      return;
    }

    if (!imageUrl) {
      setError('Please provide a campaign cover image (via link or upload).');
      setLoading(false);
      return;
    }

    try {
      await api.post('/campaigns', {
        title,
        story,
        category,
        fundingGoal: Number(fundingGoal),
        minimumContribution: Number(minimumContribution),
        deadline,
        rewardInfo,
        imageUrl
      });

      setSuccess('Campaign created! The campaign status is set to pending and will go live once approved by an Admin.');
      
      // Reset form
      setTitle('');
      setStory('');
      setCategory('Humanitarian');
      setFundingGoal('');
      setMinimumContribution('');
      setDeadline('');
      setRewardInfo('');
      setImageUrl('');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPlusCircle style={{ color: '#7cb032' }} /> Launch New Campaign
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Pitch your campaign, establish credit goals, and outline backer rewards.
        </p>
      </div>

      {success && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <FaCheckCircle style={{ color: '#3c763d', fontSize: '16px', flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <FaExclamationCircle style={{ color: '#a94442', fontSize: '16px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Campaign Create Form */}
      <form onSubmit={handleSubmit} style={{ margin: 0 }}>
        
        <div className="row">
          
          {/* Campaign Title */}
          <div className="col-md-12 col-sm-12">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <FaLeaf style={{ color: '#7cb032' }} /> Campaign Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Support Stray Children & Local Orphanages"
                style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Category */}
          <div className="col-md-6 col-sm-12">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', background: '#fff', height: '40px' }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div className="col-md-6 col-sm-12">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <FaCalendarAlt style={{ color: '#7cb032' }} /> Campaign Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', height: '40px' }}
              />
            </div>
          </div>

          {/* Funding Goal */}
          <div className="col-md-6 col-sm-12">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <FaCoins style={{ color: '#7cb032' }} /> Funding Goal (Credits)
              </label>
              <input
                type="number"
                required
                min={1}
                value={fundingGoal}
                onChange={(e) => setFundingGoal(e.target.value)}
                placeholder="10000"
                style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', height: '40px' }}
              />
            </div>
          </div>

          {/* Minimum Contribution */}
          <div className="col-md-6 col-sm-12">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <FaCoins style={{ color: '#7cb032' }} /> Min Contribution (Credits)
              </label>
              <input
                type="number"
                required
                min={1}
                value={minimumContribution}
                onChange={(e) => setMinimumContribution(e.target.value)}
                placeholder="50"
                style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', height: '40px' }}
              />
            </div>
          </div>

          {/* Banner Image URL */}
          <div className="col-md-12 col-sm-12">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <FaImage style={{ color: '#7cb032' }} /> Cover Image Link
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg or upload below"
                style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Upload Banner Section */}
          <div className="col-md-12 col-sm-12">
            <div className="form-group" style={{ marginBottom: '20px', padding: '15px', border: '1px dashed #7cb032', background: '#fcfdfa', borderRadius: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#333', display: 'block', marginBottom: '5px' }}>
                Upload Banner Cover (optional imgBB CDN Hosting)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ fontSize: '12px', color: '#666' }}
              />
              {uploading && <p style={{ fontSize: '10px', color: '#7cb032', marginTop: '5px', fontWeight: 'bold' }}>Uploading to CDN...</p>}
            </div>
          </div>

          {/* Promise Reward Info */}
          <div className="col-md-12 col-sm-12">
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <FaGift style={{ color: '#7cb032' }} /> Backer Reward Details
              </label>
              <input
                type="text"
                required
                value={rewardInfo}
                onChange={(e) => setRewardInfo(e.target.value)}
                placeholder="e.g., Supporter Certificate - profile badge & updates of progress"
                style={{ width: '100%', padding: '10px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Story Narrative */}
          <div className="col-md-12 col-sm-12">
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>
                Campaign Narrative / Story
              </label>
              <textarea
                required
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Write a compelling story about why you are raising these funds and what impact they will have..."
                style={{ width: '100%', padding: '12px 15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', minHeight: '120px' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-md-12 col-sm-12">
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn btn-theme text-uppercase"
              style={{ padding: '12px 35px', fontSize: '12px', fontWeight: 'bold' }}
            >
              {loading ? 'Creating...' : 'Submit Campaign'}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
