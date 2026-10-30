import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Database, Clock, ArrowRight, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

const AUDIT_QUESTIONS = [
  {
    id: 'truecaller',
    questionText: 'Does Truecaller or Justdial have my Aadhaar & mobile number indexed without consent?',
    highlightWords: ['Truecaller', 'Justdial', 'Aadhaar', 'mobile number'],
    targetEntity: 'Truecaller India · Justdial Limited',
    category: 'Commercial Caller Directory & Local Search',
    exposedData: ['+91 98*** 42109', 'Aadhaar e-KYC tags', 'Delhi NCR Location'],
    riskScore: 78,
    legalCitation: 'DPDPA 2023 § 12(1) — Statutory Erasure Demand',
    slaWindow: '30-Day Response Window',
    slaProgress: 88,
    penaltySchedule: 'DPBI Schedule III (Up to ₹250 Cr penalty)',
    dispatchedTo: 'privacy@truecaller.com · grievance@justdial.com',
  },
  {
    id: 'cibil',
    questionText: 'Can I legally force TransUnion CIBIL to erase pre-approved loan & marketing profiling?',
    highlightWords: ['TransUnion CIBIL', 'pre-approved loan', 'marketing profiling'],
    targetEntity: 'TransUnion CIBIL Limited',
    category: 'Financial Bureau & Commercial Loan Profiler',
    exposedData: ['PAN Card Association', 'Commercial Telemarketing Opt-in', 'CIBIL Score 782'],
    riskScore: 85,
    legalCitation: 'DPDPA 2023 § 6(4) — Unconditional Consent Revocation',
    slaWindow: '30-Day Statutory Compliance Clock',
    slaProgress: 94,
    penaltySchedule: 'Data Protection Board of India Direct Investigation',
    dispatchedTo: 'nodalofficer@transunioncibil.com',
  },
  {
    id: 'apollo',
    questionText: 'What statutory escalation fires if Apollo.io ignores my cross-border data deletion request?',
    highlightWords: ['Apollo.io', 'cross-border data deletion'],
    targetEntity: 'Apollo.io (ZenProspect Inc)',
    category: 'B2B Sales Intelligence & Cross-Border Index',
    exposedData: ['Corporate Direct Dial', 'Work Email Domain', 'Sales Prospect Profiling'],
    riskScore: 64,
    legalCitation: 'GDPR Art. 17 / CCPA § 1798.105 / DPBI Transfer Rules',
    slaWindow: '45-Day Escalation Clock',
    slaProgress: 72,
    penaltySchedule: 'Autonomous DPBI, CERT-In & FTC Administrative Filing',
    dispatchedTo: 'compliance@apollo.io',
  },
];

// Helper: Cubic ease out
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const HeroAskLoop = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [stage, setStage] = useState('typing'); // 'typing' | 'beat' | 'answer' | 'fade'
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [minCardHeight, setMinCardHeight] = useState(380);

  const containerRef = useRef(null);
  const hiddenTwinRef = useRef(null);
  const currentItem = AUDIT_QUESTIONS[currentIndex];

  // 1. Layout Stability: Measure tallest answer card in hidden twin
  useEffect(() => {
    const measure = () => {
      if (hiddenTwinRef.current) {
        const height = hiddenTwinRef.current.offsetHeight;
        if (height > 100) {
          setMinCardHeight(height + 24);
        }
      }
    };
    measure();
    window.addEventListener('resize', measure);
    if (document.fonts) {
      document.fonts.ready.then(measure);
    }
    return () => window.removeEventListener('resize', measure);
  }, []);

  // 2. Typing & Stage Loop
  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStage('answer');
      setTypedChars(currentItem.questionText.length);
      setDisplayedScore(currentItem.riskScore);
      return;
    }

    if (isHovered) return;

    let timer;

    if (stage === 'typing') {
      if (typedChars < currentItem.questionText.length) {
        timer = setTimeout(() => {
          setTypedChars((prev) => prev + 1);
        }, 26); // 26ms per character
      } else {
        // Typing finished -> 240ms beat before answer resolves
        timer = setTimeout(() => {
          setStage('answer');
        }, 240);
      }
    } else if (stage === 'answer') {
      // Animate score count-up over 620ms
      const startTime = performance.now();
      const targetScore = currentItem.riskScore;
      const duration = 620;

      const animateScore = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDisplayedScore(Math.round(targetScore * easeOutCubic(progress)));

        if (progress < 1) {
          requestAnimationFrame(animateScore);
        }
      };
      requestAnimationFrame(animateScore);

      // Card rests for 3.2s
      timer = setTimeout(() => {
        setStage('fade');
      }, 3400);
    } else if (stage === 'fade') {
      // 320ms fade before advancing to next question
      timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % AUDIT_QUESTIONS.length);
        setTypedChars(0);
        setDisplayedScore(0);
        setStage('typing');
      }, 320);
    }

    return () => clearTimeout(timer);
  }, [stage, typedChars, currentIndex, isHovered, currentItem]);

  // Handle visibility state to pause rotation when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Format question with highlighted words
  const renderedQuestion = useMemo(() => {
    const text = currentItem.questionText.slice(0, typedChars);
    const words = currentItem.questionText.split(' ');
    let charCount = 0;

    return words.map((word, wIdx) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9+]/g, '');
      const isHighlighted = currentItem.highlightWords.some((hw) =>
        hw.toLowerCase().includes(cleanWord.toLowerCase()) && cleanWord.length > 2
      );
      const wordLength = word.length + 1; // including space
      const isVisible = charCount < typedChars;
      charCount += wordLength;

      if (!isVisible) return null;

      return (
        <span
          key={wIdx}
          className={isHighlighted ? 'text-blue-400 font-semibold' : 'text-slate-100'}
        >
          {word}{' '}
        </span>
      );
    });
  }, [currentItem, typedChars]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full relative"
    >
      {/* Hidden twin to reserve height and eliminate layout shift */}
      <div
        ref={hiddenTwinRef}
        aria-hidden="true"
        className="opacity-0 pointer-events-none absolute top-0 left-0 right-0 z-[-1] p-7 rounded-3xl"
      >
        <div className="h-6 mb-4" />
        <div className="h-8 mb-6" />
        <div className="space-y-4">
          <div className="h-16" />
          <div className="h-16" />
          <div className="h-16" />
          <div className="h-12" />
        </div>
      </div>

      {/* Main Specular Container */}
      <div
        style={{ minHeight: `${minCardHeight}px` }}
        className="app-card p-7 rounded-3xl border border-white/[0.08] bg-[#0E1526] shadow-2xl relative flex flex-col justify-between transition-all duration-300"
      >
        {/* Top Eyebrow Ticket */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-400">
                Example Privacy Check #{currentIndex + 1}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Live Simulation
              </span>
            </div>
          </div>

          {/* Typing Question Prompt */}
          <div className="my-5 min-h-[52px]">
            <p className="font-display font-medium text-base sm:text-lg text-white leading-snug">
              {renderedQuestion}
              {stage === 'typing' && (
                <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse align-middle" />
              )}
            </p>
          </div>

          {/* Computed Answer Card with Cascade (0.07s per row, 7px rise) */}
          <AnimatePresence mode="wait">
            {stage === 'answer' && (
              <motion.div
                key={currentItem.id}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3.5"
              >
                {/* Row 1: Target Entity & Category */}
                <motion.div
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.07, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-between gap-3 shadow-inner"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                        Target Data Broker
                      </span>
                      <span className="text-xs font-display font-bold text-white">
                        {currentItem.targetEntity}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    DETECTED
                  </span>
                </motion.div>

                {/* Row 2: Computed Risk Score & Attributes */}
                <motion.div
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] grid grid-cols-12 gap-3 items-center shadow-inner"
                >
                  <div className="col-span-4 border-r border-white/[0.08] pr-3">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                      Risk Level
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-mono text-2xl font-bold text-blue-400 tabular-nums">
                        {displayedScore}
                      </span>
                      <span className="font-mono text-xs text-slate-400">/100</span>
                    </div>
                  </div>
                  <div className="col-span-8 pl-1">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block mb-1">
                      Leaked Information
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {currentItem.exposedData.map((d, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-200"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Row 3: Statutory Citation & Filling SLA Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.21, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] shadow-inner"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1.5">
                    <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" />
                      {currentItem.legalCitation}
                    </span>
                    <span className="text-slate-400 text-[10px]">{currentItem.slaWindow}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden relative mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentItem.slaProgress}%` }}
                      transition={{ duration: 0.33, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Row 4: Regulatory Authority & Guarantee */}
                <motion.div
                  initial={{ opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between pt-1 text-[11px] text-slate-400"
                >
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentItem.penaltySchedule}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready to Send
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Micro-Dots Indicator */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            {AUDIT_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setTypedChars(0);
                  setDisplayedScore(0);
                  setStage('typing');
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-blue-500' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Example 0${idx + 1}`}
              />
            ))}
          </div>

          <span className="text-[10px] text-slate-400">
            {isHovered ? 'Paused on Hover' : 'Auto-cycles every 3.4s'}
          </span>
        </div>
      </div>
    </div>
  );
};
