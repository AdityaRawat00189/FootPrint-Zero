import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('CA');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name || !email || !password) {
          setError('Please complete all required fields.');
          setLoading(false);
          return;
        }
        const res = await register({ name, email, password, state });
        if (!res.success) {
          setError(res.message || 'Registration failed.');
        } else {
          navigate('/dashboard');
        }
      } else {
        if (!email || !password) {
          setError('Please provide email and password.');
          setLoading(false);
          return;
        }
        const res = await login(email, password);
        if (!res.success) {
          setError(res.message || 'Invalid credentials.');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 relative bg-[#0D0D11]">
      {/* Background Subtle Orange Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="novacraft-card-dark p-8 sm:p-10 rounded-4xl max-w-md w-full border border-white/10 relative z-10 shadow-2xl"
      >
        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center text-white font-display font-extrabold text-xl shadow-glow-orange mb-4">
            FP
          </div>
          <div className="section-badge mb-1">
            {isSignUp ? 'NEW ACCOUNT' : 'SECURE ACCESS'}
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isSignUp
              ? 'Initialize autonomous multi-agent privacy protection'
              : 'Sign in to access your cases and exposure monitor'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#111115] rounded-full border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-full transition-all ${
              !isSignUp
                ? 'bg-brand-orange text-white shadow-glow-orange-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-full transition-all ${
              isSignUp
                ? 'bg-brand-orange text-white shadow-glow-orange-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-xs text-rose-400 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                Full Legal Name
              </label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#111115] border border-white/10 focus-within:border-brand-orange transition-colors">
                <User className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#111115] border border-white/10 focus-within:border-brand-orange transition-colors">
              <Mail className="w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#111115] border border-white/10 focus-within:border-brand-orange transition-colors">
              <Lock className="w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                Primary Jurisdiction
              </label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#111115] border border-white/10">
                <MapPin className="w-4 h-4 text-gray-500" />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono text-white focus:outline-none"
                >
                  <option value="CA" className="bg-[#141419] text-white">
                    California (CCPA / CPRA Mandate)
                  </option>
                  <option value="NY" className="bg-[#141419] text-white">
                    New York (SHIELD / State Standards)
                  </option>
                  <option value="TX" className="bg-[#141419] text-white">
                    Texas (TDPSA)
                  </option>
                  <option value="EU" className="bg-[#141419] text-white">
                    European Union / UK (GDPR Art. 17)
                  </option>
                  <option value="OTHER" className="bg-[#141419] text-white">
                    Other US State / Global
                  </option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-orange w-full mt-4 flex items-center justify-center gap-2 text-xs font-semibold py-4 rounded-full disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create & Launch Scanner' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
