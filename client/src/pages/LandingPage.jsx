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
  ExternalLink,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { RiskScoreGauge } from '../components/RiskScoreGauge';
import { StatusBadge } from '../components/StatusBadge';

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
    <div className="min-h-screen bg-[#0D0D11] text-gray-100 selection:bg-brand-orange/30">
      {/* 1. HERO SECTION (Novacraft Reference Image 5) */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Subtle Warm Background Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              <div className="section-badge mb-6">
                AUTONOMOUS PRIVACY PIPELINE — INDIA (DPDPA 2023) & GLOBAL
              </div>

              <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-[1.05]">
                We Erase <br />
                Digital Footprints <br />
                That <span className="text-brand-orange">Expose You.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-gray-400 font-sans max-w-xl leading-relaxed">
                India's first autonomous multi-agent privacy pipeline built for the <strong className="text-gray-200">Digital Personal Data Protection Act (DPDPA 2023)</strong> with cross-border support for GDPR & CCPA. We scan commercial aggregators (Truecaller, Justdial, CIBIL, IndiaMART, Apollo.io), synthesize enforceable erasure demands, and track compliance until your personal data is purged.
              </p>

              {/* Dual Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link
                  to="/auth?mode=signup"
                  className="btn-primary-orange flex items-center justify-center gap-2 text-sm font-semibold px-8 py-4 rounded-full"
                >
                  <span>Explore Our Work</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-secondary-dark flex items-center justify-center gap-2.5 text-sm font-semibold px-7 py-4 rounded-full"
                >
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-brand-orange text-xs">
                    ▷
                  </span>
                  <span>How Agents Work</span>
                </button>
              </div>

              {/* Quick Scan Input */}
              <form
                onSubmit={handleQuickScan}
                className="mt-8 w-full max-w-lg flex items-center gap-2 p-2 rounded-full bg-[#18181E] border border-white/10 focus-within:border-brand-orange transition-colors"
              >
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Enter email to check exposure..."
                    value={quickScanEmail}
                    onChange={(e) => setQuickScanEmail(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary-orange text-xs font-semibold px-5 py-2.5 rounded-full"
                >
                  Scan Now
                </button>
              </form>
            </motion.div>

            {/* Right Hero Visual Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="novacraft-card-dark p-7 rounded-4xl border border-white/10 relative shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                    <span className="text-xs font-display font-bold text-white uppercase tracking-wider">
                      LIVE RISK RADAR
                    </span>
                  </div>
                  <StatusBadge status="pending_approval" />
                </div>

                {/* Gauge & Score Preview */}
                <div className="py-6 flex items-center justify-around">
                  <RiskScoreGauge score={78} size={150} />
                  <div className="flex flex-col gap-3 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Brokers Mapped</span>
                      <span className="text-white font-bold text-base">15 Entities</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Breach Vectors</span>
                      <span className="text-rose-400 font-bold text-base">3 Sources</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Statutory SLA</span>
                      <span className="text-brand-orange font-bold text-base">45 Days</span>
                    </div>
                  </div>
                </div>

                {/* Pipeline State Snippet */}
                <div className="bg-[#111115] rounded-2xl p-4 border border-white/5 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1 border-b border-white/5">
                    <span className="text-brand-orange font-bold">LANGGRAPH PIPELINE</span>
                    <span>ACTIVE</span>
                  </div>
                  <div className="text-gray-300 text-[11px]">
                    01. Discovery: 15 Brokers identified in CA Registry
                  </div>
                  <div className="text-gray-300 text-[11px]">
                    02. Risk Ranking: SSN & Phone weighted (78/100)
                  </div>
                  <div className="text-brand-orange text-[11px] font-bold">
                    03. Legal Drafting: CCPA § 1798.105 notice ready
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Partner & Regulatory Logos Bar (Novacraft Reference Image 5 Bottom) */}
          <div className="mt-20 pt-8 border-t border-white/5">
            <div className="bg-[#141419] rounded-2xl py-6 px-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider text-center md:text-left">
                Statutory Frameworks & Regulatory Bodies:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-display font-bold text-gray-400">
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

      {/* 2. "WHAT WE DO" SECTION (Novacraft Reference Image 1) */}
      <section id="how-it-works" className="py-24 bg-[#FAF8F5] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <div className="section-badge mb-3">
                WHAT WE DO
              </div>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-950 tracking-tight leading-[1.08]">
                Smart Solutions <br />
                For Data Privacy
              </h2>
            </div>
            <p className="text-base text-gray-600 max-w-md leading-relaxed font-sans">
              We combine autonomous multi-agent intelligence, ChromaDB statutory legal RAG, and automated compliance tracking to restore consumer privacy rights.
            </p>
          </div>

          {/* 4 Cards Grid (3 Light Cards + 1 Inverted Black Card) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Discovery */}
            <div className="novacraft-card-light p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-950 mb-3">
                  Footprint Discovery
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans mb-8">
                  Scanning breach indices and the California Data Broker Registry for exposed personal information.
                </p>
              </div>
              <Link to="/auth?mode=signup" className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-brand-orange transition-colors">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Risk Ranking */}
            <div className="novacraft-card-light p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-950 mb-3">
                  Sensitivity Scoring
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans mb-8">
                  Objective 0-100 risk scoring evaluating vulnerability across phone, home address, SSN, and financials.
                </p>
              </div>
              <Link to="/auth?mode=signup" className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-brand-orange transition-colors">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Legal Drafting */}
            <div className="novacraft-card-light p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-orange-light text-brand-orange flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-950 mb-3">
                  Statutory Drafting
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans mb-8">
                  RAG-powered synthesis of legally binding CCPA § 1798.105 and GDPR Article 17 erasure demands.
                </p>
              </div>
              <Link to="/auth?mode=signup" className="flex items-center gap-2 text-xs font-bold text-gray-900 hover:text-brand-orange transition-colors">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Inverted Black Card (Highlighted) */}
            <div className="novacraft-card-dark p-8 flex flex-col justify-between border-brand-orange/40 bg-[#141419]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center mb-6 shadow-glow-orange-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-brand-orange mb-3">
                  Enforcement & SLA
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed font-sans mb-8">
                  Tracking the statutory 45-day response window and automating CPPA/FTC regulatory escalations.
                </p>
              </div>
              <Link to="/auth?mode=signup" className="flex items-center gap-2 text-xs font-bold text-white hover:text-brand-orange transition-colors">
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "OUR IMPACT" SECTION (Novacraft Reference Image 3) */}
      <section className="py-24 bg-[#0D0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#141419] rounded-4xl p-8 sm:p-14 border border-white/10 shadow-card-dark">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Metrics Column */}
              <div className="lg:col-span-6 flex flex-col items-start">
                <div className="section-badge mb-4">
                  OUR IMPACT
                </div>

                <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                  We Enforce Privacy That Protects You.
                </h2>

                {/* 4 Impact Metric Rows */}
                <div className="mt-10 grid grid-cols-2 gap-8 w-full">
                  <div>
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                      15+
                    </span>
                    <span className="text-xs font-mono text-gray-400 block mt-1">
                      Data Brokers Indexed
                    </span>
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                      600M+
                    </span>
                    <span className="text-xs font-mono text-gray-400 block mt-1">
                      Exposed Records Mapped
                    </span>
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                      45 Days
                    </span>
                    <span className="text-xs font-mono text-gray-400 block mt-1">
                      Statutory SLA Compliance
                    </span>
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                      100%
                    </span>
                    <span className="text-xs font-mono text-gray-400 block mt-1">
                      Human Review Control
                    </span>
                  </div>
                </div>

                <Link
                  to="/auth?mode=signup"
                  className="btn-primary-orange mt-10 flex items-center gap-2 text-xs font-semibold px-8 py-3.5 rounded-full"
                >
                  <span>View All Monitored Brokers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right Visual Showcase Cards (Image 3 Right Layout) */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Orange Showcase Card */}
                <div className="novacraft-card-orange p-7 rounded-3xl flex flex-col justify-between min-h-[200px]">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-white/80 block mb-1">
                      Targeted Erasure
                    </span>
                    <h4 className="font-display font-bold text-2xl text-white">
                      People Search Platforms
                    </h4>
                    <span className="text-xs text-white/90 block mt-2">
                      Whitepages, Radaris, Spokeo
                    </span>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-white text-gray-950 flex items-center justify-center font-bold">
                      →
                    </div>
                  </div>
                </div>

                {/* Dark Showcase Card */}
                <div className="bg-[#1C1C23] p-7 rounded-3xl border border-white/10 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-orange block mb-1">
                      Commercial Profiling
                    </span>
                    <h4 className="font-display font-bold text-2xl text-white">
                      B2B & Ad Networks
                    </h4>
                    <span className="text-xs text-gray-400 block mt-2">
                      Apollo.io, ZoomInfo, Acxiom
                    </span>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold">
                      →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "TESTIMONIAL & ACTION BANNER" SECTION (Novacraft Reference Image 4) */}
      <section className="py-24 bg-[#FAF8F5] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Testimonial / Compliance Authority Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10">
              <div>
                <div className="section-badge mb-3">
                  STATUTORY AUTHORITY
                </div>
                <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight mb-8">
                  What Privacy Laws Guarantee You.
                </h3>
                <div className="text-5xl font-serif text-brand-orange leading-none mb-3">
                  “
                </div>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-sans mb-8">
                  Under the California DELETE Act and GDPR Article 17, consumer erasure demands are legally enforceable. FootprintZero automates the complex procedural filing so consumers don't have to navigate 100+ separate opt-out mazes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-orange text-white flex items-center justify-center font-display font-bold text-sm">
                  CCPA
                </div>
                <div>
                  <span className="font-display font-bold text-gray-950 block text-sm">
                    California Consumer Privacy Act
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    Statutory Erasure Mandate (§ 1798.105)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Big Orange Callout Container (Novacraft Reference Image 4 Right) */}
            <div className="lg:col-span-7 novacraft-card-orange p-10 sm:p-14 rounded-4xl flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                  Let's Reclaim Your Privacy Together.
                </h3>
                <p className="mt-4 text-base sm:text-lg text-white/90 max-w-md leading-relaxed font-sans">
                  Ready to audit and delete your digital footprint? Launch your multi-agent scan in under 30 seconds.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center gap-2 text-sm font-semibold bg-[#111115] text-white px-8 py-4 rounded-full hover:bg-black transition-colors"
                >
                  <span>Get Started Now</span>
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
