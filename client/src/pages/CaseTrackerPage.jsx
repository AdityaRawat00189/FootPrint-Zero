import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Send,
  AlertTriangle,
  RefreshCw,
  Mail,
  Zap,
  FileText,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { AgentPipelineTrail } from '../components/AgentPipelineTrail';
import { StatusBadge } from '../components/StatusBadge';

export const CaseTrackerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseRecord, setCaseRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [escalating, setEscalating] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/cases/${id}`);
      if (res.data.success) {
        setCaseRecord(res.data.data);
      }
    } catch (err) {
      console.error('[CaseTracker] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [id]);

  const handleTriggerFollowup = async () => {
    try {
      setEscalating(true);
      const res = await axiosClient.post(`/cases/${id}/followup`);
      if (res.data.success) {
        setNotification({
          type: 'success',
          message: 'Follow-up escalation dispatched! Regulatory complaint queued for CPPA enforcement.',
        });
        await fetchCase();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to trigger escalation.',
      });
    } finally {
      setEscalating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center font-mono text-xs text-gray-400 flex flex-col items-center justify-center gap-3 bg-[#0D0D11]">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-orange" />
        <span>Loading case state and agent telemetry...</span>
      </div>
    );
  }

  if (!caseRecord) {
    return (
      <div className="min-h-screen py-24 text-center novacraft-card-dark max-w-lg mx-auto mt-12 p-10 rounded-4xl">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="font-display font-bold text-white text-xl">Case Not Found</h3>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-5 text-xs font-semibold text-brand-orange hover:underline block mx-auto"
        >
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  const deadline = caseRecord.responseDeadline ? new Date(caseRecord.responseDeadline) : null;
  const now = new Date();
  const daysRemaining = deadline ? Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))) : 45;

  return (
    <div className="min-h-screen pb-24 bg-[#090D16] text-slate-100 selection:bg-blue-500/30 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span className="text-slate-600 text-xs">/</span>
          <span className="text-xs font-mono text-blue-400">{caseRecord.caseNumber}</span>
        </div>

        {/* Case Header Banner */}
        <div className="app-card p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-600 text-white shadow-glow-blue">
                {caseRecord.caseNumber}
              </span>
              <StatusBadge status={caseRecord.status} />
              <span className="text-xs text-slate-400">
                Law: <strong className="text-white">{caseRecord.legalFramework}</strong>
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight mt-1">
              Data Removal Request: {caseRecord.targetEntityName}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Contact: {caseRecord.targetEntityEmail}</span>
            </p>
          </div>

          {/* SLA Countdown Card */}
          <div className="bg-slate-900 border border-white/[0.08] p-5 rounded-2xl flex items-center gap-4 min-w-[240px] relative z-10 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block">
                Statutory Deadline
              </span>
              <span className="font-display font-extrabold text-2xl text-white">
                {caseRecord.status === 'pending_approval' ? 'Pending Approval' : `${daysRemaining} Days Left`}
              </span>
              {deadline && (
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Due by: {deadline.toLocaleDateString()}
                </span>
              )}
            </div>
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
                : 'bg-blue-500/10 border-blue-500/25 text-blue-300'
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

        {/* The Animated Agent Pipeline Progress Trail */}
        <div className="mt-8">
          <AgentPipelineTrail
            caseStatus={caseRecord.status}
            agentTrail={caseRecord.agentTrail || []}
            legalFramework={caseRecord.legalFramework}
          />
        </div>

        {/* Two-Column Detail Grid: Correspondence Thread & Legal Letter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Outbound & Escalation Correspondence Thread */}
          <div className="lg:col-span-6 app-card p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <h3 className="font-display font-bold text-white text-lg">
                    Communication Log
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {caseRecord.correspondence?.length || 0} messages
                </span>
              </div>

              <div className="mt-5 space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
                {(caseRecord.correspondence || []).map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900 border border-white/[0.08] text-xs shadow-inner"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/[0.06] mb-2.5">
                      <span className="text-blue-400 font-semibold">
                        {msg.direction === 'outbound' ? 'Sent Deletion Notice' : 'Broker Response'}
                      </span>
                      <span>{new Date(msg.receivedAt).toLocaleString()}</span>
                    </div>
                    <p className="font-bold text-slate-200 mb-1.5">{msg.subject}</p>
                    <p className="text-xs text-slate-400 line-clamp-3 whitespace-pre-wrap leading-relaxed font-mono">
                      {msg.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Escalation Action */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Follow-ups sent: <strong className="text-white">{caseRecord.followupCount || 0}</strong>
              </span>

              <button
                onClick={handleTriggerFollowup}
                disabled={escalating || caseRecord.status === 'pending_approval'}
                className="flex items-center gap-2 text-xs font-semibold text-rose-300 hover:text-white px-5 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/25 transition-all disabled:opacity-40"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{escalating ? 'Sending Escalation...' : 'Send Follow-up Notice'}</span>
              </button>
            </div>
          </div>

          {/* Active Legal Demand Text */}
          <div className="lg:col-span-6 app-card p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h3 className="font-display font-bold text-white text-lg">
                    Approved Legal Demand Notice
                  </h3>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20">
                  Ready
                </span>
              </div>

              <div className="mt-5 bg-slate-900 border border-white/[0.08] rounded-2xl p-5 max-h-[380px] overflow-y-auto font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed selection:bg-blue-500/30 shadow-inner">
                {caseRecord.draftedLetter?.userEditedBody || caseRecord.draftedLetter?.body || 'No letter drafted.'}
              </div>
            </div>

            {caseRecord.status === 'pending_approval' && (
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  onClick={() => navigate('/approvals')}
                  className="btn-primary flex items-center gap-2 text-xs font-semibold px-6 py-3 rounded-full"
                >
                  <span>Review in Approval Queue</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
