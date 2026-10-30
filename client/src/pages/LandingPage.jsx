import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Search,
  Activity,
  FileText,
  Lock,
  CheckCircle2,
  Database,
  Clock,
  Sparkles,
  UserCheck,
  BellRing,
} from 'lucide-react';
import { FlowingRibbonCanvas } from '../components/FlowingRibbonCanvas';
import { HeroAskLoop } from '../components/HeroAskLoop';
import { LivePipelineCanvas } from '../components/LivePipelineCanvas';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [quickScanEmail, setQuickScanEmail] = useState('');

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (quickScanEmail) {
      navigate(`/auth?mode=signup&email=${encodeURIComponent(quickScanEmail)}`);
    } else {
      navigate('/auth?mode=signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 selection:bg-blue-500/30 selection:text-white">
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Ambient Canvas Glow */}
        <FlowingRibbonCanvas />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-semibold text-blue-300 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Autonomous Privacy & Data Removal Project</span>
              </div>

              {/* Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-[1.12]">
                Find where your data is leaked.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                  Delete it automatically.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-base sm:text-lg text-slate-300 font-sans max-w-xl leading-relaxed">
                FootprintZero scans online data brokers and security leaks to see what private information is exposed. Our multi-agent AI drafts legally binding deletion requests under India's <strong className="text-white font-medium">DPDPA 2023</strong>, <strong className="text-white font-medium">GDPR</strong>, and <strong className="text-white font-medium">CCPA</strong>, then waits for your 1-click approval before sending.
              </p>

              {/* Quick Scan Input */}
              <form
                onSubmit={handleQuickScan}
                className="mt-8 w-full max-w-lg flex items-center gap-2 p-1.5 rounded-full bg-slate-900/90 border border-white/[0.12] shadow-xl focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
              >
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email to check leaks..."
                    value={quickScanEmail}
                    onChange={(e) => setQuickScanEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary text-xs font-semibold px-6 py-3 rounded-full"
                >
                  Check Leaks
                </button>
              </form>

              {/* Trust Features */}
              <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free & Open Source</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>You Review Before Any Email is Sent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-400" />
                  <span>Your Data Never Leaves Your Control</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive Questions Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <HeroAskLoop />
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (4 SIMPLE STEPS)
          ========================================================================= */}
      <section id="how-it-works" className="py-20 border-t border-white/[0.08] bg-[#0C111D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge-pill mb-3">Simple Process</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              How FootprintZero works
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              From discovering leaks to removing your records from commercial databases, the entire workflow is clear and under your control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="app-card-interactive p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  Scan Your Footprint
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We check your email and phone against verified breach datasets (HaveIBeenPwned) and major Indian & global broker registries.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-blue-400 font-semibold">
                <Search className="w-3.5 h-3.5" />
                <span>Automated Discovery</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="app-card-interactive p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  Analyze Sensitivity
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculates an objective 0–100 risk score based on what was exposed (phone numbers, addresses, passwords, financial profiles).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                <Activity className="w-3.5 h-3.5" />
                <span>Risk Scoring</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="app-card-interactive p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  Draft Legal Demands
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our legal agent automatically retrieves real statutory sections (DPDPA 2023 Sec 12, GDPR Art 17) to draft formal removal letters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>Precise Legal Citations</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="app-card-interactive p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  You Review & Dispatch
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You have full authority. Review the letter, edit anything you want, and click "Approve" to send. We track the 30-day statutory response clock.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Human-in-the-Loop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE AGENT PIPELINE SIMULATOR
          ========================================================================= */}
      <section className="py-20 border-t border-white/[0.08] bg-[#090D16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="badge-pill mb-2">Real-Time Simulation</span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Live agent pipeline in action
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Hover over data tokens below to see how our autonomous agents identify brokers and pair them with exact legal sections.
              </p>
            </div>
            <Link
              to="/auth?mode=signup"
              className="btn-primary text-xs font-semibold px-6 py-3 rounded-full self-start md:self-auto"
            >
              <span>Test Your Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <LivePipelineCanvas />

          {/* Legal Frameworks Bar */}
          <div className="mt-10 p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Supported Legal Frameworks:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-300">
              <span className="text-blue-400 font-bold">DPDPA 2023 (India)</span>
              <span>GDPR Article 17 (EU)</span>
              <span>CCPA / CPRA (California)</span>
              <span>TRAI Do-Not-Disturb (DND)</span>
              <span>California SB 362 (DELETE Act)</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MINI PROJECT CALL TO ACTION
          ========================================================================= */}
      <section className="py-20 border-t border-white/[0.08] bg-gradient-to-b from-[#090D16] to-[#0D1424]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-6 shadow-glow-blue">
            <Shield className="w-7 h-7" />
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Ready to check your privacy footprint?
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create a test account, run an autonomous scan, and see the full LangGraph legal drafting pipeline in action.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth?mode=signup"
              className="btn-primary text-sm font-semibold px-8 py-4 rounded-full w-full sm:w-auto"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/AdityaRawat00189/FootPrint-Zero"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary-dark text-sm font-semibold px-8 py-4 rounded-full w-full sm:w-auto"
            >
              <span>View Source Code</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
