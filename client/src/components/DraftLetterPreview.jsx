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
    <div className="novacraft-card-dark p-8 rounded-4xl flex flex-col justify-between">
      {/* Header Info */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
          <div>
            <div className="section-badge mb-1">
              STATUTORY DEMAND ({caseRecord.legalFramework})
            </div>
            <h3 className="font-display font-bold text-white text-xl tracking-tight">
              Drafted Deletion & Opt-Out Notice
            </h3>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Case Ref: <span className="text-white font-bold">{caseRecord.caseNumber}</span> • Target: <span className="text-brand-orange">{caseRecord.targetEntityName}</span> ({caseRecord.targetEntityEmail})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                isEditing
                  ? 'bg-brand-orange/20 text-brand-orange border-brand-orange'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/25'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Editing Mode' : 'Edit Notice'}</span>
            </button>
          </div>
        </div>

        {/* Legal Clauses Used */}
        {legalClauses.length > 0 && (
          <div className="py-4 border-b border-white/10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block mb-2">
              Statutory RAG Clauses Injected:
            </span>
            <div className="flex flex-wrap gap-2">
              {legalClauses.map((clause, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/25 text-brand-orange flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-brand-orange" />
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
              <label className="block text-xs font-mono text-gray-400 mb-2">
                Customize Legal Letter Body:
              </label>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={16}
                className="w-full bg-[#111115] border border-brand-orange/40 rounded-2xl p-5 text-xs font-mono text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-orange leading-relaxed"
              />
            </div>
          ) : (
            <div className="bg-[#111115] border border-white/5 rounded-2xl p-5 max-h-[400px] overflow-y-auto font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap selection:bg-brand-orange/30">
              {customBody || originalBody}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => setShowRevisionModal(true)}
          disabled={isProcessing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 hover:text-white px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Request Agent Revision</span>
        </button>

        <button
          onClick={() => onApprove(caseRecord._id, isEditing ? customBody : null)}
          disabled={isProcessing}
          className="btn-primary-orange w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-semibold px-7 py-3.5 rounded-full disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isProcessing ? 'Authorizing Dispatch...' : 'Approve & Dispatch Notice'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#18181E] p-8 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl"
          >
            <div className="section-badge mb-2">
              AGENT FEEDBACK
            </div>
            <h4 className="font-display font-bold text-white text-xl mb-2">
              Request Agent Revision
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Specify instructions for the Legal Drafting Agent (e.g. adjust statutory citations, demand immediate phone suppression, or cite CPPA enforcement penalties).
            </p>
            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="e.g., Emphasize SB 362 continuous 45-day deletion requirements and CCPA § 1798.199 fines..."
              rows={4}
              className="w-full bg-[#111115] border border-white/10 rounded-2xl p-4 text-xs font-mono text-gray-200 focus:outline-none focus:border-brand-orange mb-5"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="text-xs font-semibold px-5 py-2.5 rounded-full text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRevisionModal(false);
                  onReject(caseRecord._id, revisionFeedback);
                }}
                className="btn-primary-orange text-xs font-semibold px-6 py-2.5 rounded-full"
              >
                Submit Feedback
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
