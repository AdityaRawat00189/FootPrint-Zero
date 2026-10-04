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
    <div className="min-h-screen pb-24 bg-[#0D0D11] text-gray-100 selection:bg-brand-orange/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Link & Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span className="text-gray-600 text-xs">/</span>
          <span className="text-xs font-mono text-brand-orange">{caseRecord.caseNumber}</span>
        </div>

        {/* Case Header Banner */}
        <div className="novacraft-card-dark p-8 rounded-4xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-brand-orange text-white shadow-glow-orange-sm">
                {caseRecord.caseNumber}
              </span>
              <StatusBadge status={caseRecord.status} />
              <span className="text-xs font-mono text-gray-400">
                Framework: <strong className="text-white">{caseRecord.legalFramework}</strong>
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight mt-1">
              Erasure Demand: {caseRecord.targetEntityName}
            </h1>
            <p className="text-xs font-mono text-gray-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              <span>Recipient: {caseRecord.targetEntityEmail}</span>
            </p>
          </div>

          {/* SLA Countdown Card */}
          <div className="bg-[#111115] border border-white/10 p-5 rounded-3xl flex items-center gap-4 min-w-[240px] relative z-10 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 text-brand-orange border border-brand-orange/30 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                Statutory Compliance SLA
              </span>
              <span className="font-display font-extrabold text-2xl text-white">
                {caseRecord.status === 'pending_approval' ? 'Pending Approval' : `${daysRemaining} Days Left`}
              </span>
              {deadline && (
                <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                  Due: {deadline.toLocaleDateString()}
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
            className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 text-xs font-mono ${
              notification.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                : 'bg-brand-orange/15 border-brand-orange/30 text-brand-orange'
            }`}
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-white"
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
          <div className="lg:col-span-6 novacraft-card-dark p-8 rounded-4xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-brand-orange" />
                  <h3 className="font-display font-bold text-white text-lg">
                    Correspondence & Dispatch Log
                  </h3>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {caseRecord.correspondence?.length || 0} Records
                </span>
              </div>

              <div className="mt-5 space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
                {(caseRecord.correspondence || []).map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#111115] border border-white/5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pb-2 border-b border-white/5 mb-2.5">
                      <span className="text-brand-orange uppercase font-bold">
                        {msg.direction === 'outbound' ? '↗ OUTBOUND STATUTORY DISPATCH' : '↙ INBOUND COMPLIANCE'}
                      </span>
                      <span>{new Date(msg.receivedAt).toLocaleString()}</span>
                    </div>
                    <p className="font-bold text-gray-200 mb-1.5">{msg.subject}</p>
                    <p className="text-xs text-gray-400 line-clamp-3 whitespace-pre-wrap leading-relaxed">
                      {msg.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Escalation Action */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">
                Escalations: <strong className="text-white">{caseRecord.followupCount || 0}</strong>
              </span>

              <button
                onClick={handleTriggerFollowup}
                disabled={escalating || caseRecord.status === 'pending_approval'}
                className="flex items-center gap-2 text-xs font-semibold text-rose-300 hover:text-white px-5 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/25 transition-all disabled:opacity-40"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{escalating ? 'Follow-up Agent Escalating...' : 'Trigger Follow-up Escalation'}</span>
              </button>
            </div>
          </div>

          {/* Active Legal Demand Text */}
          <div className="lg:col-span-6 novacraft-card-dark p-8 rounded-4xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-brand-orange" />
                  <h3 className="font-display font-bold text-white text-lg">
                    Authorized Legal Demand Body
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange font-bold border border-brand-orange/20">
                  RAG SYNTHESIZED
                </span>
              </div>

              <div className="mt-5 bg-[#111115] border border-white/5 rounded-2xl p-5 max-h-[380px] overflow-y-auto font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed selection:bg-brand-orange/30">
                {caseRecord.draftedLetter?.userEditedBody || caseRecord.draftedLetter?.body || 'No letter drafted.'}
              </div>
            </div>

            {caseRecord.status === 'pending_approval' && (
              <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => navigate('/approvals')}
                  className="btn-primary-orange flex items-center gap-2 text-xs font-semibold px-6 py-3 rounded-full"
                >
                  <span>Authorize in Approval Queue</span>
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
