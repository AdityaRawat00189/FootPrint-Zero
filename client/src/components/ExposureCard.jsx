import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Database, ArrowRight, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const ExposureCard = ({ exposure, onStartCase, onViewCase, isStarting = false, lightMode = false }) => {
  const isBreach = exposure.sourceType === 'breach';
  const hasCase = !!exposure.caseId;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group border ${
        lightMode
          ? 'bg-white text-gray-900 border-gray-100 shadow-card-soft'
          : 'bg-[#1C1E2D] text-white border-white/15 shadow-xl hover:border-brand-orange/50'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                isBreach
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
              }`}
            >
              {isBreach ? <ShieldAlert className="w-5 h-5" /> : <Database className="w-5 h-5" />}
            </div>
            <div>
              <h4 className={`font-display font-bold text-base tracking-tight group-hover:text-brand-orange transition-colors ${
                lightMode ? 'text-gray-950' : 'text-white'
              }`}>
                {exposure.sourceName}
              </h4>
              <span className="text-xs font-mono text-gray-400">
                {isBreach ? 'Security Breach Vector' : exposure.category || 'Data Aggregator'}
              </span>
            </div>
          </div>

          <StatusBadge status={exposure.severity} />
        </div>

        {/* Categories tags */}
        <div className="mt-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
            Discovered Attributes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(exposure.exposedDataCategories || []).slice(0, 5).map((cat, idx) => (
              <span
                key={idx}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
                  lightMode
                    ? 'bg-gray-50 border-gray-200 text-gray-700'
                    : 'bg-[#24273A] border-white/10 text-gray-200'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </span>
            ))}
            {(exposure.exposedDataCategories || []).length > 5 && (
              <span className="text-xs font-mono px-2 py-1 text-gray-400">
                +{(exposure.exposedDataCategories || []).length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Description snippet */}
        {isBreach && exposure.rawBreachDetails && (
          <p className="mt-4 text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {exposure.rawBreachDetails.description?.replace(/<[^>]*>?/gm, '') ||
              'Identified in public breach record indexes.'}
          </p>
        )}
      </div>

      {/* Footer / Action */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-gray-400">Vulnerability:</span>
          <span className="text-xs font-mono font-bold text-brand-orange">
            {exposure.riskScore || 50}/100
          </span>
        </div>

        {hasCase ? (
          <button
            onClick={() => onViewCase && onViewCase(typeof exposure.caseId === 'object' ? exposure.caseId._id : exposure.caseId)}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors px-3 py-1.5 rounded-full bg-brand-orange/10 hover:bg-brand-orange/20"
          >
            <span>View Case</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            disabled={isStarting}
            onClick={() => onStartCase && onStartCase(exposure._id)}
            className="btn-primary-orange flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-50"
          >
            <span>{isStarting ? 'Drafting Notice...' : 'Enforce Deletion'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
