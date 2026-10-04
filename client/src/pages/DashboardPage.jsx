import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  Database,
  CheckSquare,
  RefreshCw,
  Search,
  ArrowRight,
  Zap,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { RiskScoreGauge } from '../components/RiskScoreGauge';
import { ExposureCard } from '../components/ExposureCard';
import { StatusBadge } from '../components/StatusBadge';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [exposures, setExposures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [startingCaseId, setStartingCaseId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, expRes] = await Promise.all([
        axiosClient.get('/exposures/summary'),
        axiosClient.get('/exposures'),
      ]);

      if (sumRes.data.success) {
        setSummary(sumRes.data.data);
      }
      if (expRes.data.success) {
        setExposures(expRes.data.data);
      }
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerScan = async () => {
    try {
      setScanning(true);
      setNotification({ type: 'info', message: 'Discovery & Risk Ranking agents scanning footprint...' });
      const res = await axiosClient.post('/exposures/scan');
      if (res.data.success) {
        setNotification({
          type: 'success',
          message: `Scan complete! Discovered ${res.data.data.exposures.length} exposures across breach logs and broker directories.`,
        });
        await fetchData();
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Footprint scan failed.',
      });
    } finally {
      setScanning(false);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const handleStartCase = async (exposureId) => {
    try {
      setStartingCaseId(exposureId);
      const res = await axiosClient.post('/cases/start', { exposureId });
      if (res.data.success) {
        setNotification({
          type: 'success',
          message: `Case ${res.data.data.caseNumber} initialized! Drafted deletion letter ready in Approval Queue.`,
        });
        await fetchData();
        navigate('/approvals');
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to start erasure case.',
      });
    } finally {
      setStartingCaseId(null);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const filteredExposures = exposures.filter((exp) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'broker' && exp.sourceType === 'broker') ||
      (activeTab === 'breach' && exp.sourceType === 'breach');

    const matchesSearch =
      exp.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.exposedDataCategories || []).some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 bg-[#0D0D11] text-gray-100 selection:bg-brand-orange/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="section-badge mb-1">
              REAL-TIME PRIVACY INTELLIGENCE
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Digital Footprint Dashboard
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Active profile: <span className="text-white font-bold">{user?.email}</span> (Jurisdiction: {user?.state || 'CA'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerScan}
              disabled={scanning}
              className="btn-primary-orange flex items-center gap-2 text-xs font-semibold px-6 py-3.5 rounded-full disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Scanning Footprint...' : 'Run Footprint Scan'}</span>
            </button>
          </div>
        </div>

        {/* Notifications Toast */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 text-xs font-mono ${
              notification.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                : 'bg-brand-orange/15 border-brand-orange/30 text-brand-orange'
            }`}
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Risk Score & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Main Risk Score Card */}
          <div className="lg:col-span-4 novacraft-card-dark p-8 rounded-4xl flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10">
              <span className="section-badge text-[11px]">
                COMPOSITE RISK
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange font-bold">
                LIVE METRIC
              </span>
            </div>

            <div className="my-6">
              <RiskScoreGauge score={summary?.overallRiskScore || 0} size={190} />
            </div>

            <p className="text-xs font-mono text-gray-400 text-center">
              Evaluated across {summary?.totalExposures || 0} identified data broker profiles and breach repositories.
            </p>
          </div>

          {/* Metric Overview Cards (Novacraft Reference Style) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="novacraft-card-dark p-7 rounded-3xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Data Brokers Holding Info
                </span>
                <div className="w-9 h-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-5">
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight">
                  {summary?.brokerCount || 0}
                </span>
                <span className="text-xs font-mono text-gray-400 block mt-1">
                  Active commercial data aggregators
                </span>
              </div>
            </div>

            <div className="novacraft-card-dark p-7 rounded-3xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Breach Exposures
                </span>
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-5">
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-rose-400 tracking-tight">
                  {summary?.breachCount || 0}
                </span>
                <span className="text-xs font-mono text-gray-400 block mt-1">
                  Public security breaches detected
                </span>
              </div>
            </div>

            <div className="novacraft-card-dark p-7 rounded-3xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Pending Human Approval
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <span className="font-display font-extrabold text-4xl sm:text-5xl text-amber-400 tracking-tight">
                    {summary?.pendingApprovals || 0}
                  </span>
                  <span className="text-xs font-mono text-gray-400 block mt-1">
                    Statutory letters ready for review
                  </span>
                </div>
                {summary?.pendingApprovals > 0 && (
                  <button
                    onClick={() => navigate('/approvals')}
                    className="text-xs font-semibold text-brand-orange hover:underline flex items-center gap-1"
                  >
                    <span>Open Queue →</span>
                  </button>
                )}
              </div>
            </div>

            <div className="novacraft-card-dark p-7 rounded-3xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Active Statutory Cases
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-5">
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-emerald-400 tracking-tight">
                  {summary?.activeCases || 0}
                </span>
                <span className="text-xs font-mono text-gray-400 block mt-1">
                  Dispatched under 45-day SLA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Exposures List Section */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="section-badge mb-1">
                DISCOVERED TARGETS
              </div>
              <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Identified Exposure Vectors
              </h3>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-[#141419] p-1.5 rounded-full border border-white/10">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'all'
                      ? 'bg-brand-orange text-white shadow-glow-orange-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All ({exposures.length})
                </button>
                <button
                  onClick={() => setActiveTab('broker')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'broker'
                      ? 'bg-brand-orange text-white shadow-glow-orange-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Data Brokers ({summary?.brokerCount || 0})
                </button>
                <button
                  onClick={() => setActiveTab('breach')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === 'breach'
                      ? 'bg-brand-orange text-white shadow-glow-orange-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Breaches ({summary?.breachCount || 0})
                </button>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#141419] border border-white/10">
                <Search className="w-3.5 h-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Filter entities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none w-32 sm:w-44"
                />
              </div>
            </div>
          </div>

          {/* Exposures Grid */}
          {loading ? (
            <div className="py-24 text-center font-mono text-xs text-gray-400 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-brand-orange" />
              <span>Loading digital footprint telemetry...</span>
            </div>
          ) : filteredExposures.length === 0 ? (
            <div className="novacraft-card-dark p-14 rounded-4xl text-center mt-8">
              <Shield className="w-12 h-12 text-brand-orange mx-auto mb-4" />
              <h4 className="font-display font-bold text-white text-xl">
                No Exposures in Current View
              </h4>
              <p className="text-xs font-mono text-gray-400 mt-2 max-w-md mx-auto">
                Trigger a digital footprint scan to query Have I Been Pwned and the California Data Broker Registry.
              </p>
              <button
                onClick={handleTriggerScan}
                className="btn-primary-orange mt-6 text-xs font-semibold px-7 py-3 rounded-full"
              >
                Run Discovery Scan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredExposures.map((exp) => (
                <ExposureCard
                  key={exp._id}
                  exposure={exp}
                  onStartCase={handleStartCase}
                  onViewCase={(caseId) => navigate(`/cases/${caseId}`)}
                  isStarting={startingCaseId === exp._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
