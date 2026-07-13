'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { FaFlag, FaTrashAlt, FaCheck, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

interface Report {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  createdAt: string;
}

export default function ReportsPanel() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data.reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleClearReport = async (id: string) => {
    setProcessingId(id);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/admin/reports/${id}`);
      setSuccess('Report cleared successfully.');
      setReports(prev => prev.filter(r => r._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error clearing report.');
    } finally {
      setProcessingId('');
    }
  };

  const handleSuspendCampaign = async (campaignId: string, reportId: string) => {
    setProcessingId(reportId);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/campaigns/${campaignId}`);
      setSuccess('Campaign suspended/deleted and contributors refunded.');
      await api.delete(`/admin/reports/${reportId}`);
      
      setReports(prev => prev.filter(r => r.campaignId !== campaignId));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error suspending campaign.');
    } finally {
      setProcessingId('');
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaFlag style={{ color: '#d9534f' }} /> Reports Panel
        </h3>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          Review flagged campaigns submitted by supporters as suspicious or fraudulent.
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
          <p style={{ marginTop: '10px', color: '#888', fontSize: '12px' }}>Loading flagged reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', border: '2px dashed #eee', borderRadius: '4px', background: '#fdfdfd' }}>
          <FaCheckCircle style={{ fontSize: '32px', color: '#7cb032', marginBottom: '10px' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' }}>Clean Security History</h4>
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>No campaigns have been flagged by supporters at this time.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered" style={{ margin: 0, fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', color: '#333' }}>
                <th style={{ fontWeight: 'bold' }}>Flagged Campaign</th>
                <th style={{ fontWeight: 'bold' }}>Reporter</th>
                <th style={{ fontWeight: 'bold' }}>Reason for Flag</th>
                <th style={{ fontWeight: 'bold' }}>Date</th>
                <th style={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} style={{ verticalAlign: 'middle' }}>
                  <td style={{ fontWeight: 'bold', color: '#333', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.campaignTitle}>
                    {r.campaignTitle}
                  </td>
                  <td>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{r.reporterName}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#777' }}>{r.reporterEmail}</p>
                  </td>
                  <td style={{ maxWidth: '250px', wordBreak: 'break-word' }}>{r.reason}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleClearReport(r._id)}
                        disabled={processingId !== ''}
                        className="btn btn-theme"
                        style={{ padding: '5px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FaCheck /> Dismiss
                      </button>
                      <button
                        onClick={() => handleSuspendCampaign(r.campaignId, r._id)}
                        disabled={processingId !== ''}
                        className="btn"
                        style={{ padding: '5px 12px', fontSize: '12px', background: '#d9534f', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FaTrashAlt /> Suspend
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
