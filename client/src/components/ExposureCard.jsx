import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Database, ArrowRight, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const ExposureCard = ({ exposure, onStartCase, onViewCase, isStarting = false }) => {
  const isBreach = exposure.sourceType === 'breach';
  const hasCase = !!exposure.caseId;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden bg-[#111726] text-white border border-white/[0.08] shadow-lg hover:border-blue-500/40 transition-all"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isBreach
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}
            >
              {isBreach ? <ShieldAlert className="w-5 h-5" /> : <Database className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-display font-bold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">
                {exposure.sourceName}
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                {isBreach ? 'Known Security Leak' : exposure.category || 'Data Broker'}
              </span>
            </div>
          </div>

          <StatusBadge status={exposure.severity} />
        </div>

        {/* Categories tags */}
        <div className="mt-5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-2">
            Exposed Data:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(exposure.exposedDataCategories || []).slice(0, 5).map((cat, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-white/[0.08] text-slate-200 capitalize"
              >
                {cat.replace(/_/g, ' ')}
              </span>
            ))}
            {(exposure.exposedDataCategories || []).length > 5 && (
              <span className="text-xs px-2 py-1 text-slate-400">
                +{(exposure.exposedDataCategories || []).length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Description snippet */}
        {isBreach && exposure.rawBreachDetails && (
          <p className="mt-4 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {exposure.rawBreachDetails.description?.replace(/<[^>]*>?/gm, '') ||
              'Identified in public breach record index.'}
          </p>
        )}
      </div>

      {/* Footer / Action */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">Risk Score:</span>
          <span className="text-xs font-semibold text-blue-400">
            {exposure.riskScore || 50}/100
          </span>
        </div>

        {hasCase ? (
          <button
            onClick={() => onViewCase && onViewCase(typeof exposure.caseId === 'object' ? exposure.caseId._id : exposure.caseId)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20"
          >
            <span>View Deletion Status</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            disabled={isStarting}
            onClick={() => onStartCase && onStartCase(exposure._id)}
            className="btn-primary flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-50"
          >
            <span>{isStarting ? 'Preparing Notice...' : 'Draft Deletion Letter'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
