import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#12131D] py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white font-display font-extrabold text-sm shadow-glow-orange-sm">
                FP
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                FOOTPRINT<span className="text-brand-orange">ZERO</span>
              </span>
            </div>
            <p className="text-xs text-gray-300 max-w-sm mt-1">
              Autonomous multi-agent privacy pipeline scanning digital footprint exposures and enforcing statutory personal data erasure.
            </p>
          </div>

          {/* Nav quick links */}
          <div className="flex items-center gap-8 text-xs font-medium text-gray-300">
            <Link to="/" className="hover:text-brand-orange transition-colors">Overview</Link>
            <Link to="/dashboard" className="hover:text-brand-orange transition-colors">Dashboard</Link>
            <Link to="/approvals" className="hover:text-brand-orange transition-colors">Approval Queue</Link>
            <a
              href="https://github.com/AdityaRawat00189/FootPrint-Zero"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <span>© 2026 FootprintZero. India-First & Global Privacy Engineering Platform (DPDPA 2023 / GDPR / CCPA).</span>
          <span>Powered by LangGraph Multi-Agent Pipeline & Google Gemini</span>
        </div>
      </div>
    </footer>
  );
};
