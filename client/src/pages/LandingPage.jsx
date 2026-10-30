import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Search,
  Activity,
  FileText,
  Send,
  Lock,
  CheckCircle2,
  Database,
  Clock,
  Zap,
  Scale,
  Sparkles,
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
    <div className="min-h-screen bg-bg-base text-gray-100 selection:bg-brand-orange/30">
      {/* =========================================================================
          ZONE 1: AMBIENT SLATE CORE (#141622) — THE INTELLIGENCE & HERO ENGINE
          ========================================================================= */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Flowing Ribbon Texture Canvas */}
        <FlowingRibbonCanvas />

        {/* Luminous Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-brand-orange/20 via-amber-500/10 to-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Full-Viewport Split: 1.04fr / 0.96fr */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Editorial Masthead */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Order-ticket Signature Eyebrow */}
              <div className="order-ticket-eyebrow mb-5">
                / 01 PIPELINE_STATE · DPDPA 2023 & GLOBAL ARCHITECTURE
              </div>

              {/* Semibold 600 Sentence Case Headline (Last line highlighted in orange) */}
              <h1 className="font-display font-semibold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08]">
                We erase digital footprints <br />
                that <span className="text-brand-orange font-bold">expose you</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-gray-300 font-sans max-w-xl leading-relaxed">
                India's first autonomous multi-agent privacy pipeline built for the <strong className="text-white font-semibold">Digital Personal Data Protection Act (DPDPA 2023)</strong> with cross-border support for GDPR & CCPA. We scan commercial aggregators (Truecaller, Justdial, CIBIL, IndiaMART, Apollo.io), synthesize enforceable erasure demands, and track compliance until your personal data is purged.
              </p>

              {/* Dual Action Buttons */}
              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link
                  to="/auth?mode=signup"
                  className="btn-primary-orange flex items-center justify-center gap-2 text-xs font-semibold px-8 py-4 rounded-full micro-interactive"
                >
                  <span>Explore our work</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-secondary-dark flex items-center justify-center gap-2.5 text-xs font-semibold px-7 py-4 rounded-full micro-interactive"
                >
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-brand-orange text-xs">
                    ▷
                  </span>
                  <span>How agents work</span>
                </button>
              </div>

              {/* Quick Scan Input */}
              <form
                onSubmit={handleQuickScan}
                className="mt-7 w-full max-w-lg flex items-center gap-2 p-1.5 rounded-full bg-[#1C1E2D] border border-white/15 shadow-xl focus-within:border-brand-orange transition-colors"
              >
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter email to check exposure..."
                    value={quickScanEmail}
                    onChange={(e) => setQuickScanEmail(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary-orange text-xs font-semibold px-5 py-2.5 rounded-full"
                >
                  Scan now
                </button>
              </form>
            </motion.div>

            {/* Right Column: Signature Hero Ask Loop (Demonstration of Real Artifact) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <HeroAskLoop />
            </motion.div>
          </div>

          {/* Three Pillar Props Sitting Under a Hairline */}
          <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-[#1C1E2D]/50 border border-white/5 micro-interactive">
              <span className="order-ticket-eyebrow block mb-1">/ 01 AUTONOMOUS_CORRELATION</span>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Correlates credential leaks with 16+ verified Indian (Truecaller, Justdial, CIBIL) & Global data broker registries.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#1C1E2D]/50 border border-white/5 micro-interactive">
              <span className="order-ticket-eyebrow block mb-1">/ 02 RAG_STATUTORY_SYNTHESIS</span>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                ChromaDB vector retrieval embeds precise DPDPA § 12, § 6(4), and GDPR Art 17 legal clauses with human-in-the-loop review.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#1C1E2D]/50 border border-white/5 micro-interactive">
              <span className="order-ticket-eyebrow block mb-1">/ 03 ENFORCEABLE_30D_CLOCK</span>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Automated statutory SLA countdown with auto-escalation to the Data Protection Board of India (DPBI) and CERT-In.
              </p>
            </div>
          </div>

          {/* Live Agent Dispatch Particle Machine */}
          <div className="mt-8">
            <LivePipelineCanvas />
          </div>

          {/* Statutory Frameworks & Regulatory Bodies Bar */}
          <div className="mt-8">
            <div className="bg-[#1C1E2D]/90 backdrop-blur-md rounded-2xl py-5 px-8 border border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-5">
              <span className="text-xs font-mono text-gray-300 uppercase tracking-wider text-center md:text-left font-semibold">
                Statutory Frameworks & Regulatory Bodies:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-7 text-xs sm:text-sm font-display font-semibold text-gray-300">
                <span className="text-brand-orange hover:text-white transition-colors">DPDPA 2023 (India)</span>
                <span className="hover:text-white transition-colors">Data Protection Board of India (DPBI)</span>
                <span className="hover:text-white transition-colors">CERT-In Directives</span>
                <span className="hover:text-white transition-colors">TRAI DND Registry</span>
                <span className="hover:text-white transition-colors">GDPR Article 17</span>
                <span className="hover:text-white transition-colors">CCPA / CPRA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ZONE 2: WARM PAPER SURFACE (#FAF8F3) — EDITORIAL, HUMAN & PROCEDURAL
          ========================================================================= */}
      <section id="how-it-works" className="py-24 bg-[#FAF8F3] text-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <div className="order-ticket-eyebrow mb-2">
                / 02 STATUTORY_PROCEDURES
              </div>
              <h2 className="font-display font-semibold text-3xl sm:text-5xl text-gray-950 tracking-tight leading-[1.1]">
                Smart privacy solutions <br />
                for data principals
              </h2>
            </div>
            <p className="text-base text-gray-600 max-w-md leading-relaxed font-sans">
              We combine autonomous multi-agent intelligence, ChromaDB statutory legal RAG, and automated compliance tracking to restore fundamental privacy rights.
            </p>
          </div>

          {/* 4 Cards Grid (3 Light Paper Cards + 1 Inverted Dark Specular Card) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Discovery */}
            <div className="novacraft-card-light p-8 flex flex-col justify-between micro-interactive">
              <div>
                <span className="order-ticket-eyebrow mb-3 block">/ 01 EXPOSURE_SCAN</span>
                <div className="w-11 h-11 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mb-5">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-950 mb-2">
                  Footprint discovery
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans mb-8">
                  Scanning breach indices and India's caller & credit repositories (Truecaller, Justdial, CIBIL) for exposed records.
                </p>
              </div>
              <Link to="/auth?mode=signup" className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-brand-orange transition-colors">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Risk Ranking */}
            <div className="novacraft-card-light p-8 flex flex-col justify-between micro-interactive">
              <div>
                <span className="order-ticket-eyebrow mb-3 block">/ 02 SENSITIVITY_RANK</span>
                <div className="w-11 h-11 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mb-5">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-950 mb-2">
                  Sensitivity scoring
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans mb-8">
                  Objective 0–100 risk scoring evaluating vulnerability across Aadhaar, PAN card, phone numbers, and financials.
                </p>
              </div>
              <Link to="/auth?mode=signup" className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-brand-orange transition-colors">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Legal Drafting */}
            <div className="novacraft-card-light p-8 flex flex-col justify-between micro-interactive">
              <div>
                <span className="order-ticket-eyebrow mb-3 block">/ 03 RAG_SYNTHESIS</span>
                <div className="w-11 h-11 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mb-5">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-xl text-gray-950 mb-2">
                  Statutory drafting
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans mb-8">
                  RAG-powered synthesis of legally binding DPDPA 2023 Sec 12, GDPR Art 17, and CCPA erasure demands.
                </p>
              </div>
              <Link to="/auth?mode=signup" className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-brand-orange transition-colors">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Inverted Dark Card with Specular Hairline */}
            <div className="novacraft-card-dark specular-hairline p-8 flex flex-col justify-between border-brand-orange/50 bg-[#1C1E2D] text-white shadow-xl micro-interactive">
              <div>
                <span className="order-ticket-eyebrow mb-3 block text-brand-orange">/ 04 ENFORCE_30D</span>
                <div className="w-11 h-11 rounded-2xl bg-brand-orange text-white flex items-center justify-center mb-5 shadow-glow-orange-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-xl text-brand-orange mb-2">
                  Enforcement & SLA
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed font-sans mb-8">
                  Tracking the statutory 30-day response window and automating Data Protection Board (DPBI) escalations.
                </p>
              </div>
              <Link to="/auth?mode=signup" className="flex items-center gap-2 text-xs font-bold text-white hover:text-brand-orange transition-colors">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ZONE 3: INSTITUTIONAL SLATE BAND (#1C1E2D / #141622) — AUDIT & PROOF
          ========================================================================= */}
      <section className="py-24 bg-bg-base relative overflow-hidden">
        {/* Soft Ambient Radial Light */}
        <div className="absolute top-1/2 right-10 w-[600px] h-[450px] bg-gradient-to-bl from-brand-orange/15 to-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#1C1E2D] specular-hairline rounded-3xl p-8 sm:p-14 border border-white/15 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Metrics Column */}
              <div className="lg:col-span-6 flex flex-col items-start">
                <div className="order-ticket-eyebrow mb-3">
                  / 03 ENFORCEABLE_IMPACT
                </div>

                <h2 className="font-display font-semibold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                  We enforce privacy rights <br />
                  that protect you
                </h2>

                {/* 4 Impact Metric Rows with Tabular Figures */}
                <div className="mt-10 grid grid-cols-2 gap-8 w-full">
                  <div>
                    <span className="font-mono font-bold text-4xl sm:text-5xl text-white tracking-tight tabular-nums">
                      16+
                    </span>
                    <span className="text-xs font-mono text-gray-300 block mt-1">
                      Data Aggregators Indexed
                    </span>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-4xl sm:text-5xl text-white tracking-tight tabular-nums">
                      600M+
                    </span>
                    <span className="text-xs font-mono text-gray-300 block mt-1">
                      Exposed Records Mapped
                    </span>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-4xl sm:text-5xl text-white tracking-tight tabular-nums">
                      30 Days
                    </span>
                    <span className="text-xs font-mono text-gray-300 block mt-1">
                      Statutory SLA (DPDPA 2023)
                    </span>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-4xl sm:text-5xl text-white tracking-tight tabular-nums">
                      100%
                    </span>
                    <span className="text-xs font-mono text-gray-300 block mt-1">
                      Human Review Control
                    </span>
                  </div>
                </div>

                <Link
                  to="/auth?mode=signup"
                  className="btn-primary-orange mt-10 flex items-center gap-2 text-xs font-semibold px-8 py-3.5 rounded-full micro-interactive"
                >
                  <span>View all monitored brokers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right Visual Showcase Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Orange Showcase Card */}
                <div className="novacraft-card-orange p-7 rounded-2xl flex flex-col justify-between min-h-[210px] micro-interactive">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-white/80 block mb-1">
                      Targeted Erasure
                    </span>
                    <h4 className="font-display font-semibold text-2xl text-white">
                      People search platforms
                    </h4>
                    <span className="text-xs text-white/90 block mt-2">
                      Truecaller India, Justdial, Spokeo
                    </span>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-white text-gray-950 flex items-center justify-center font-bold shadow-md">
                      →
                    </div>
                  </div>
                </div>

                {/* Luminous Elevated Showcase Card */}
                <div className="bg-[#24273A] p-7 rounded-2xl border border-white/15 shadow-xl flex flex-col justify-between min-h-[210px] micro-interactive">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-orange block mb-1 font-semibold">
                      Commercial Profiling
                    </span>
                    <h4 className="font-display font-semibold text-2xl text-white">
                      B2B & credit bureaus
                    </h4>
                    <span className="text-xs text-gray-300 block mt-2">
                      TransUnion CIBIL, IndiaMART, Apollo.io
                    </span>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center font-bold">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ZONE 4: STATUTORY AUTHORITY & ACTION (#FAF8F3 WARM PAPER)
          ========================================================================= */}
      <section className="py-24 bg-[#FAF8F3] text-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Testimonial / Compliance Authority Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10">
              <div>
                <div className="order-ticket-eyebrow mb-3">
                  / 04 STATUTORY_MANDATE
                </div>
                <h3 className="font-display font-semibold text-3xl sm:text-4xl text-gray-950 tracking-tight mb-6">
                  What privacy laws guarantee you
                </h3>
                <div className="text-5xl font-serif text-brand-orange leading-none mb-3">
                  “
                </div>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-sans mb-8">
                  Rooted in the Supreme Court's landmark <em>Puttaswamy</em> privacy judgment and codified in Section 12 of India's DPDPA 2023, data erasure demands are statutory citizen rights. FootprintZero bridges the "rights without tools" gap.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-orange text-white flex items-center justify-center font-display font-bold text-sm">
                  DPDPA
                </div>
                <div>
                  <span className="font-display font-semibold text-gray-950 block text-sm">
                    Digital Personal Data Protection Act, 2023
                  </span>
                  <span className="text-xs font-mono text-gray-600">
                    Statutory Erasure Mandate (§ 12) & DPBI Oversight (§ 33)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Big Orange Callout Container */}
            <div className="lg:col-span-7 novacraft-card-orange p-10 sm:p-14 rounded-3xl flex flex-col justify-between min-h-[380px] micro-interactive">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-white/80 block mb-2 font-semibold">
                  / ZERO_FOOTPRINT_INITIATIVE
                </span>
                <h3 className="font-display font-semibold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                  Reclaim your digital privacy today
                </h3>
                <p className="mt-4 text-base sm:text-lg text-white/90 max-w-md leading-relaxed font-sans">
                  Ready to audit and delete your digital footprint? Launch your multi-agent scan in under 30 seconds.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center gap-2 text-xs font-semibold bg-[#141622] text-white px-8 py-4 rounded-full hover:bg-[#1C1E2D] border border-white/10 shadow-xl transition-all"
                >
                  <span>Get started now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
