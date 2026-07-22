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
    <div className="text-left bg-white p-2 font-sans">
      
      {/* Title Header */}
      <div className="mb-9 border-b border-zinc-100 pb-5">
        <h2 className="text-3xl font-extrabold text-zinc-900 m-0 uppercase tracking-tight font-heading flex items-center gap-2.5">
          <FaFlag className="text-red-500" /> Reports Panel
        </h2>
        <p className="text-sm text-zinc-500 mt-2 font-medium">
          Review flagged campaigns submitted by supporters as suspicious or fraudulent.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-250 text-emerald-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaCheckCircle className="text-base shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs mb-5 font-bold animate-in fade-in">
          <FaExclamationCircle className="text-base shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-zinc-200 border-t-primary animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-zinc-200 rounded-[24px] text-center bg-zinc-50">
          <FaCheckCircle className="text-4xl text-emerald-555 mx-auto mb-4" />
          <h4 className="text-base font-bold text-zinc-900 m-0 font-heading">Clean Security History</h4>
          <p className="text-sm text-zinc-500 m-0 font-medium">No campaigns have been flagged by supporters at this time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-100 rounded-xl shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Flagged Campaign</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Reporter</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Reason for Flag</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-left tracking-wider">Date</th>
                <th className="px-5 py-4 text-xs uppercase text-zinc-500 font-bold text-center tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors last:border-b-0">
                  <td className="px-5 py-5 text-sm font-bold text-zinc-900 max-w-[200px] truncate" title={r.campaignTitle}>
                    {r.campaignTitle}
                  </td>
                  <td className="px-5 py-5 text-sm font-bold text-zinc-800">
                    <p className="m-0 leading-tight">{r.reporterName}</p>
                    <p className="m-0 text-[10px] text-zinc-400 font-semibold mt-1">{r.reporterEmail}</p>
                  </td>
                  <td className="px-5 py-5 text-sm text-zinc-650 max-w-[240px] break-words">{r.reason}</td>
                  <td className="px-5 py-5 text-xs text-zinc-500 font-bold">
                    {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-5 py-5 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleClearReport(r._id)}
                        disabled={processingId !== ''}
                        className="h-9 px-4.5 rounded-xl bg-emerald-650 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-none cursor-pointer disabled:opacity-50"
                      >
                        <FaCheck /> Dismiss
                      </button>
                      <button
                        onClick={() => handleSuspendCampaign(r.campaignId, r._id)}
                        disabled={processingId !== ''}
                        className="h-9 px-4.5 rounded-xl bg-red-500 hover:bg-red-650 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border-none cursor-pointer disabled:opacity-50"
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
