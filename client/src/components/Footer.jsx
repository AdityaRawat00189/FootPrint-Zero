import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#070A12] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/[0.08]">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-glow-blue">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                Footprint<span className="text-blue-400">Zero</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              Autonomous privacy assistant that scans data leaks, drafts enforceable deletion notices, and helps you remove your data from brokers.
            </p>
          </div>

          {/* Nav quick links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-slate-300">
            <Link to="/" className="hover:text-blue-400 transition-colors">Overview</Link>
            <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link to="/approvals" className="hover:text-blue-400 transition-colors">Review Queue</Link>
            <a
              href="https://github.com/AdityaRawat00189/FootPrint-Zero"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-blue-400 font-semibold"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Project Repository</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <span>FootprintZero Mini Project — Built with React, Node.js, LangGraph & FastAPI</span>
          <span className="text-slate-400">Supports DPDPA (India), GDPR (EU) & CCPA (California)</span>
        </div>
      </div>
    </footer>
  );
};

