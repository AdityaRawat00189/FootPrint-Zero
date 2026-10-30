import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, RotateCcw, Send, Shield, AlertTriangle, FileCheck, ArrowRight } from 'lucide-react';

export const DraftLetterPreview = ({
  caseRecord,
  onApprove,
  onReject,
  isProcessing = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customBody, setCustomBody] = useState(
    caseRecord?.draftedLetter?.userEditedBody || caseRecord?.draftedLetter?.body || ''
  );
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const originalBody = caseRecord?.draftedLetter?.body || '';
  const legalClauses = caseRecord?.draftedLetter?.legalClausesUsed || [];

  return (
    <div className="app-card p-8 rounded-3xl flex flex-col justify-between">
      {/* Header Info */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
          <div>
            <div className="badge-pill mb-1.5">
              Legal Request ({caseRecord.legalFramework})
            </div>
            <h3 className="font-display font-bold text-white text-xl tracking-tight">
              Drafted Data Deletion Notice
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Case Ref: <span className="text-white font-semibold">{caseRecord.caseNumber}</span> • Target: <span className="text-blue-400 font-medium">{caseRecord.targetEntityName}</span> ({caseRecord.targetEntityEmail})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                isEditing
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500'
                  : 'bg-white/[0.05] text-slate-300 border-white/[0.1] hover:border-white/20'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Editing Mode' : 'Edit Notice Text'}</span>
            </button>
          </div>
        </div>

        {/* Legal Clauses Used */}
        {legalClauses.length > 0 && (
          <div className="py-4 border-b border-white/[0.08]">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-2">
              Statutory Citations Included:
            </span>
            <div className="flex flex-wrap gap-2">
              {legalClauses.map((clause, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>{clause}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Letter Preview / Editor Area */}
        <div className="mt-5">
          {isEditing ? (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Customize Legal Letter Body:
              </label>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={16}
                className="w-full bg-[#0C111D] border border-blue-500/40 rounded-2xl p-5 text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed shadow-inner"
              />
            </div>
          ) : (
            <div className="bg-[#0C111D] border border-white/[0.08] rounded-2xl p-5 max-h-[420px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30 shadow-inner">
              {customBody || originalBody}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setShowRevisionModal(true)}
          disabled={isProcessing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-5 py-3 rounded-full bg-white/[0.05] border border-white/[0.1] hover:border-white/20 transition-all disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ask AI to Revise Draft</span>
        </button>

        <button
          onClick={() => onApprove(caseRecord._id, isEditing ? customBody : null)}
          disabled={isProcessing}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-semibold px-7 py-3.5 rounded-full disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isProcessing ? 'Sending Notice...' : 'Approve & Send Notice'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="app-card p-8 rounded-3xl max-w-md w-full border border-white/[0.12] shadow-2xl bg-[#0F172A]"
          >
            <div className="badge-pill mb-2">
              Feedback for Agent
            </div>
            <h4 className="font-display font-bold text-white text-xl mb-2">
              Request AI Revision
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Tell the Legal Drafting Agent what to modify (e.g., mention specific phone records, adjust statutory deadlines, or highlight penalties).
            </p>
            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="e.g., Please emphasize removal of my phone number from all outbound telemarketing lists under TRAI regulations..."
              rows={4}
              className="w-full bg-[#090D16] border border-white/[0.1] rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 mb-5 shadow-inner"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="text-xs font-semibold px-5 py-2.5 rounded-full text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRevisionModal(false);
                  onReject(caseRecord._id, revisionFeedback);
                }}
                className="btn-primary text-xs font-semibold px-6 py-2.5 rounded-full"
              >
                Regenerate Notice
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
