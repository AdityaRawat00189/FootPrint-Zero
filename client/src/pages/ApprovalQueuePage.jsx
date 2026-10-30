import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  ArrowRight,
  RefreshCw,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { DraftLetterPreview } from '../components/DraftLetterPreview';
import { StatusBadge } from '../components/StatusBadge';

export const ApprovalQueuePage = () => {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/cases/approvals');
      if (res.data.success) {
        setApprovals(res.data.data);
        if (res.data.data.length > 0 && !selectedCaseId) {
          setSelectedCaseId(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error('[Approvals] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (caseId, editedBody) => {
    try {
      setProcessingId(caseId);
      const action = editedBody ? 'edit_and_approve' : 'approve';
      const res = await axiosClient.post(`/cases/${caseId}/action`, {
        action,
        editedBody,
      });

      if (res.data.success) {
        setNotification({
          type: 'success',
          message: 'Legal notice approved! Dispatched to data broker compliance team via SMTP relay.',
        });
        await fetchApprovals();
        navigate(`/cases/${caseId}`);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Approval action failed.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (caseId, feedback) => {
    try {
      setProcessingId(caseId);
      const res = await axiosClient.post(`/cases/${caseId}/action`, {
        action: 'reject',
        rejectionReason: feedback,
      });

      if (res.data.success) {
        setNotification({
          type: 'info',
          message: 'Revision requested. Legal Drafting Agent regenerated statutory notice draft.',
        });
        await fetchApprovals();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to request revision.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const selectedCase = approvals.find((a) => a._id === selectedCaseId) || approvals[0];

  return (
    <div className="min-h-screen pb-24 bg-bg-base text-gray-100 selection:bg-brand-orange/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="badge-pill mb-2">
              Human Review & Authorization
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Review Deletion Notices
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Read, edit, and authorize legal requests before they are sent to data brokers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-4 py-2 rounded-full bg-slate-900 border border-white/[0.08] text-blue-400 shadow-sm">
              {approvals.length} {approvals.length === 1 ? 'Notice' : 'Notices'} Waiting for You
            </span>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 text-xs ${
              notification.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
            }`}
          >
            <Zap className="w-4 h-4 flex-shrink-0 text-blue-400" />
            <span className="flex-1 font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="py-24 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <span>Loading legal notice drafts...</span>
          </div>
        ) : approvals.length === 0 ? (
          <div className="app-card p-16 rounded-3xl text-center mt-10">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-display font-extrabold text-2xl text-white">
              All Caught Up!
            </h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              You have no pending deletion notices waiting for review. You can trigger new requests from your dashboard anytime.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary mt-6 inline-flex items-center gap-2 text-xs font-semibold px-7 py-3.5 rounded-full"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
            {/* Left Column: Queue Selector Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-1">
                Pending Notices ({approvals.length})
              </span>

              {approvals.map((item) => {
                const isSelected = item._id === selectedCaseId;
                return (
                  <motion.div
                    key={item._id}
                    onClick={() => setSelectedCaseId(item._id)}
                    whileHover={{ x: 3 }}
                    className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-2 border-blue-500 shadow-glow-blue'
                        : 'bg-[#111726] border-white/[0.08] hover:border-white/[0.18]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">
                        {item.caseNumber}
                      </span>
                      <StatusBadge status="pending_approval" />
                    </div>

                    <h4 className="font-display font-bold text-white text-base mt-2.5">
                      {item.targetEntityName}
                    </h4>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {item.targetEntityEmail}
                    </span>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                      <span>Law: {item.legalFramework}</span>
                      <span className="text-blue-400 font-semibold">Review Draft →</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Full Draft Preview & Action Editor */}
            <div className="lg:col-span-8">
              {selectedCase && (
                <DraftLetterPreview
                  key={selectedCase._id}
                  caseRecord={selectedCase}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessing={processingId === selectedCase._id}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
