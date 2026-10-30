import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Activity,
  FileText,
  UserCheck,
  Send,
  Clock,
  CheckCircle2,
  PauseCircle,
  ChevronDown,
} from 'lucide-react';

const PIPELINE_NODES = [
  {
    key: 'discovery',
    name: 'Discovery Agent',
    label: 'Discovery',
    description: 'Scans HIBP breaches & India/Global Aggregator Registries',
    icon: Search,
  },
  {
    key: 'risk_ranking',
    name: 'Risk Ranking Agent',
    label: 'Risk Ranking',
    description: 'Calculates sensitivity weights for Aadhaar, PAN, phone & financials',
    icon: Activity,
  },
  {
    key: 'legal_drafting',
    name: 'Legal Drafting Agent',
    label: 'Legal Drafting',
    description: 'Synthesizes DPDPA/GDPR/CCPA clauses via ChromaDB RAG',
    icon: FileText,
  },
  {
    key: 'human_approval',
    name: 'Human Approval Gate',
    label: 'Human Review',
    description: 'User verification & diff-style authorization pause',
    icon: UserCheck,
  },
  {
    key: 'executor',
    name: 'Executor Agent',
    label: 'Notice Dispatch',
    description: 'Formal transmission & statutory 30-day (DPDPA) clock initiation',
    icon: Send,
  },
  {
    key: 'followup',
    name: 'Follow-up Agent',
    label: 'SLA Monitoring',
    description: 'Scheduled DPBI / CPPA regulatory escalation',
    icon: Clock,
  },
];

export const AgentPipelineTrail = ({
  caseStatus = 'discovery',
  agentTrail = [],
  legalFramework = 'CCPA',
  onSelectStep,
}) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);

  const getProgressIndex = () => {
    switch (caseStatus) {
      case 'discovery':
        return 0;
      case 'risk_ranked':
        return 1;
      case 'drafted':
      case 'pending_approval':
        return 3;
      case 'approved':
      case 'dispatched':
      case 'awaiting_response':
        return 4;
      case 'escalated':
      case 'resolved':
        return 5;
      default:
        return 2;
    }
  };

  const activeIndex = getProgressIndex();

  const getNodeData = (nodeKey) => {
    return agentTrail.find((t) => t.step === nodeKey) || null;
  };

  return (
    <div className="w-full bg-[#111726] p-8 rounded-3xl border border-white/[0.08] relative overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 relative z-10">
        <div>
          <div className="badge-pill mb-1.5">
            Step-by-Step Workflow
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
            Automated Deletion Process
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Track each automated step from discovery to statutory notice delivery ({legalFramework})
          </p>
        </div>
        <div className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300">
          Current Stage: {caseStatus.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Horizontal Trail Container */}
      <div className="relative py-4 z-10">
        {/* Background Connecting Line */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 -translate-y-6 h-1 bg-white/[0.08] rounded-full" />

        {/* Animated Active Progress Line */}
        <motion.div
          className="hidden md:block absolute top-1/2 left-8 -translate-y-6 h-1 bg-gradient-to-r from-blue-600 to-indigo-500 shadow-glow-blue rounded-full"
          initial={{ width: '0%' }}
          animate={{
            width: `${Math.min(100, Math.max(0, (activeIndex / (PIPELINE_NODES.length - 1)) * 100))}%`,
          }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Pipeline Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
          {PIPELINE_NODES.map((node, index) => {
            const isCompleted = index < activeIndex || (index === activeIndex && caseStatus === 'resolved');
            const isActive = index === activeIndex && caseStatus !== 'resolved';
            const isPending = index > activeIndex;
            const nodeLog = getNodeData(node.key);
            const isPaused = node.key === 'human_approval' && isActive;

            const Icon = node.icon;

            return (
              <motion.div
                key={node.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedNodeIndex(selectedNodeIndex === index ? null : index);
                  if (onSelectStep) onSelectStep(node.key, nodeLog);
                }}
                className={`flex md:flex-col items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  selectedNodeIndex === index
                    ? 'bg-slate-900 border-2 border-blue-500 shadow-glow-blue'
                    : isActive
                    ? 'bg-slate-900 border border-blue-500/60 shadow-glow-blue'
                    : isCompleted
                    ? 'bg-slate-900/80 border border-white/[0.08] hover:border-blue-500/30'
                    : 'bg-slate-900/40 border border-white/[0.05] opacity-60 hover:opacity-90'
                }`}
              >
                {/* Node Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center relative transition-transform duration-300 p-3 ${
                    isPaused
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                      : isActive
                      ? 'bg-blue-600 text-white shadow-glow-blue scale-105'
                      : isCompleted
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                      : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {isPaused && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow font-bold text-xs">
                      ⏸
                    </span>
                  )}
                </div>

                {/* Node Text */}
                <div className="flex-1 md:text-center">
                  <div className="flex items-center md:justify-center gap-1.5">
                    <span className="text-xs font-semibold text-blue-400">
                      0{index + 1}.
                    </span>
                    <span className="text-xs font-display font-bold text-white tracking-tight">
                      {node.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {node.name}
                  </p>
                  <div className="mt-2 flex items-center md:justify-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isPaused
                          ? 'bg-amber-500/20 text-amber-300'
                          : isActive
                          ? 'bg-blue-600 text-white font-bold'
                          : isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-white/[0.05] text-slate-400'
                      }`}
                    >
                      {isPaused ? 'Waiting Review' : isActive ? 'Active' : isCompleted ? 'Completed' : 'Queued'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail Accordion */}
      <AnimatePresence>
        {selectedNodeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-5 border-t border-white/10 relative z-10"
          >
            {(() => {
              const activeNode = PIPELINE_NODES[selectedNodeIndex];
              const log = getNodeData(activeNode.key);

              return (
                <div className="bg-[#1C1C24] p-5 rounded-3xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <activeNode.icon className="w-5 h-5 text-brand-orange" />
                      <span className="font-display font-bold text-white text-base">
                        {activeNode.name} Execution Log
                      </span>
                    </div>
                    {log?.timestamp && (
                      <span className="text-xs font-mono text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 mt-2.5 leading-relaxed">
                    {log?.message || activeNode.description}
                  </p>
                  {log?.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-4 bg-[#111115] p-3.5 rounded-2xl border border-white/5 font-mono text-xs text-gray-300 overflow-x-auto">
                      <pre>{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
