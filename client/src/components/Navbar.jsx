import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, CheckSquare, Layers, LogOut, ArrowRight, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StatutoryTelemetryModal } from './StatutoryTelemetryModal';

export const Navbar = ({ pendingApprovalCount = 0 }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Layers },
    {
      path: '/approvals',
      label: 'Review Queue',
      icon: CheckSquare,
      badge: pendingApprovalCount > 0 ? pendingApprovalCount : null,
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090D16]/85 border-b border-white/[0.08] shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-blue group-hover:scale-105 transition-all">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Footprint<span className="text-blue-400">Zero</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Privacy & Data Erasure
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Overview
            </Link>
            {isAuthenticated &&
              navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors relative flex items-center gap-2 ${
                      isActive ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Tech Architecture Modal Button */}
            <button
              onClick={() => setShowTelemetryModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white hover:border-blue-500/40 transition-all"
              title="View multi-agent pipeline and legal framework schema"
            >
              <Code className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">How Agents Work</span>
              <span className="sm:hidden">Architecture</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/[0.08] text-xs text-slate-200 hover:border-blue-500/30 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-medium">{user?.name || user?.email}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Sign out"
                  className="p-2.5 rounded-full bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="btn-primary text-xs font-semibold px-5 py-2.5 rounded-full"
                >
                  <span>Check Leaks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Architecture Telemetry Modal */}
      <StatutoryTelemetryModal
        isOpen={showTelemetryModal}
        onClose={() => setShowTelemetryModal(false)}
      />
    </>
  );
};
