import React from 'react';

const statusConfig = {
  discovered: { label: 'DISCOVERED', bg: 'bg-white/5', text: 'text-gray-300', border: 'border-white/10', dot: 'bg-gray-400' },
  pending_approval: { label: 'AWAITING APPROVAL', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  approved: { label: 'APPROVED', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  dispatched: { label: 'NOTICE DISPATCHED', bg: 'bg-brand-orange/10', text: 'text-brand-orange', border: 'border-brand-orange/30', dot: 'bg-brand-orange' },
  awaiting_response: { label: 'SLA COUNTDOWN', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-400' },
  escalated: { label: 'REGULATORY ESCALATION', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  resolved: { label: 'RESOLVED & PURGED', bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40', dot: 'bg-emerald-400' },
  rejected: { label: 'REVISION QUEUED', bg: 'bg-white/5', text: 'text-gray-400', border: 'border-white/10', dot: 'bg-gray-400' },
  critical: { label: 'CRITICAL RISK', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-500' },
  high: { label: 'HIGH RISK', bg: 'bg-brand-orange/10', text: 'text-brand-orange', border: 'border-brand-orange/30', dot: 'bg-brand-orange' },
  medium: { label: 'MEDIUM RISK', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  low: { label: 'LOW RISK', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
};

export const StatusBadge = ({ status, className = '' }) => {
  const config = statusConfig[status?.toLowerCase()] || {
    label: status?.toUpperCase() || 'UNKNOWN',
    bg: 'bg-white/5',
    text: 'text-gray-300',
    border: 'border-white/10',
    dot: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
      {config.label}
    </span>
  );
};
