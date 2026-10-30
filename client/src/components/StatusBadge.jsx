import React from 'react';

const statusConfig = {
  discovered: { label: 'Discovered', bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-700/50', dot: 'bg-slate-400' },
  pending_approval: { label: 'Pending Review', bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  approved: { label: 'Approved', bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  dispatched: { label: 'Notice Sent', bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  awaiting_response: { label: 'Waiting for Reply', bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30', dot: 'bg-indigo-400' },
  escalated: { label: 'Escalated', bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  resolved: { label: 'Data Removed', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40', dot: 'bg-emerald-400' },
  rejected: { label: 'Revision Needed', bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-700/50', dot: 'bg-slate-400' },
  critical: { label: 'Critical Risk', bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  high: { label: 'High Risk', bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  medium: { label: 'Medium Risk', bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  low: { label: 'Low Risk', bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
};

export const StatusBadge = ({ status, className = '' }) => {
  const config = statusConfig[status?.toLowerCase()] || {
    label: status?.replace(/_/g, ' ') || 'Unknown',
    bg: 'bg-slate-800/60',
    text: 'text-slate-300',
    border: 'border-slate-700/50',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
      {config.label}
    </span>
  );
};
