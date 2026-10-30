import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Copy, Check, Scale, Shield, Database } from 'lucide-react';

export const StatutoryTelemetryModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const rawTelemetry = `// =========================================================================
// FOOTPRINTZERO MULTI-AGENT PIPELINE: STATE MACHINE TELEMETRY & STATUTORY RAG
// Core Regulatory Engine: DPDPA 2023 (Act No. 22 of 2023) · GDPR Art 17 · CCPA § 1798
// =========================================================================

{
  "pipeline": "FootprintZero_LangGraph_v2.4",
  "state_schema": "CaseStateTypedDict",
  "checkpointing": "MemorySaver + MongoDB Atlas Collection('cases')",
  "human_in_the_loop_gate": {
    "interruption_node": "executor_agent",
    "diff_review_active": true,
    "statutory_pause": "Awaiting explicit Citizen Authorization"
  },
  "vector_store": {
    "engine": "ChromaDB (Local persistent)",
    "embeddings": "sentence-transformers/all-MiniLM-L6-v2",
    "indexed_statutory_provisions": [
      {
        "framework": "DPDPA_2023",
        "citation": "Section 12(1) & (3)",
        "clause_text": "A Data Principal shall have the right to correction, completion, updating and erasure of her personal data... Data Fiduciary shall upon receipt of specified request erase personal data without unreasonable delay."
      },
      {
        "framework": "DPDPA_2023",
        "citation": "Section 6(4)",
        "clause_text": "The Data Principal shall have the right to withdraw her consent at any time, with the ease of doing so being comparable to the ease with which such consent was given."
      },
      {
        "framework": "DPDPA_2023",
        "citation": "Section 33 & Schedule",
        "clause_text": "Data Protection Board of India (DPBI) powers to inquire and impose significant penalties up to INR 250 Crores for failure to uphold Data Principal statutory erasure mandates."
      },
      {
        "framework": "GDPR",
        "citation": "Article 17(1)",
        "clause_text": "Right to erasure ('right to be forgotten'). The data subject shall have the right to obtain from the controller the erasure of personal data without undue delay."
      }
    ]
  },
  "risk_ranking_weights": {
    "Aadhaar_KYC": 30.0,
    "PAN_Card": 28.0,
    "UPI_VPA": 22.0,
    "Primary_Phone": 15.0,
    "GPS_Residence": 10.0,
    "Normalization": "0-100 Sigmoid Scaled Composite Score"
  },
  "escalation_daemons": {
    "schedule": "0 0 * * * (Daily UTC midnight)",
    "statutory_clock_days": {
      "DPDPA": 30,
      "GDPR": 30,
      "CCPA": 45
    },
    "regulatory_escalation_targets": [
      "Data Protection Board of India (DPBI)",
      "Indian Computer Emergency Response Team (CERT-In)",
      "Telecom Regulatory Authority of India (TRAI - TCCCPR)"
    ]
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawTelemetry);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#141624] border border-brand-orange/40 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1C1E2D]">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-brand-orange" />
              <span className="font-mono text-xs font-bold text-white tracking-wider">
                STATUTORY_RAG_MACHINE_TELEMETRY.JSON
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 hover:text-white hover:border-brand-orange/50 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Spec'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Telemetry Code Content */}
          <div className="p-6 overflow-y-auto font-mono text-xs text-gray-200 leading-relaxed selection:bg-brand-orange/30">
            <pre className="whitespace-pre-wrap">{rawTelemetry}</pre>
          </div>

          {/* Bottom Bar */}
          <div className="px-6 py-3 border-t border-white/10 bg-[#10121C] flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>LangGraph Multi-Agent Architecture · ChromaDB RAG Vector Store</span>
            <span className="text-brand-orange font-semibold">DPDPA 2023 Statutory Schema Ready</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
