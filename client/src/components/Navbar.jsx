import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, CheckSquare, Layers, LogOut, User, ArrowRight, Terminal } from 'lucide-react';
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
      label: 'Approval Queue',
      icon: CheckSquare,
      badge: pendingApprovalCount > 0 ? pendingApprovalCount : null,
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#141622]/85 border-b border-white/10 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Novacraft-styled Logo Mark */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-glow-orange-sm group-hover:bg-brand-orange-hover transition-all">
            <span className="font-display font-extrabold text-xl tracking-tight">FP</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-brand-orange transition-colors">
              FOOTPRINT<span className="text-brand-orange">ZERO</span>
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-brand-orange font-semibold' : 'text-gray-300 hover:text-white'
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
                  className={`text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                    isActive ? 'text-brand-orange font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-brand-orange text-white font-bold font-mono">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
        </div>

        {/* Right Action Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Audience Wink: Human / Machine Telemetry Toggle */}
          <button
            onClick={() => setShowTelemetryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300 hover:text-white hover:border-brand-orange/50 transition-all micro-interactive"
            title="Inspect raw LangGraph state machine & statutory vector schemas"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            <span className="hidden sm:inline">Machine View</span>
            <span className="sm:hidden">Telemetry</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-surface border border-white/10 text-xs text-gray-200"
              >
                <span className="w-2 h-2 rounded-full bg-brand-orange" />
                <span className="font-mono">{user?.name || user?.email}</span>
                {user?.overallRiskScore !== undefined && (
                  <span className="font-mono text-[11px] font-bold text-brand-orange pl-1 tabular-nums">
                    {user.overallRiskScore}/100 Risk
                  </span>
                )}
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Sign out"
                className="p-2.5 rounded-full bg-bg-surface border border-white/10 text-gray-400 hover:text-brand-orange hover:border-brand-orange/40 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="btn-primary-orange flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full"
              >
                <span>Scan Footprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>

    {/* Statutory Telemetry Modal (Machine View) */}
    <StatutoryTelemetryModal
      isOpen={showTelemetryModal}
      onClose={() => setShowTelemetryModal(false)}
    />
  </>
  );
};
