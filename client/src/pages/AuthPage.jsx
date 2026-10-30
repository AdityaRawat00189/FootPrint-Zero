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
  const [state, setState] = useState('DL');
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
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-16 relative bg-[#090D16] overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-card p-8 sm:p-10 rounded-3xl max-w-md w-full border border-white/[0.08] relative z-10 shadow-2xl bg-[#0F172A]"
      >
        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-glow-blue mb-4">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div className="badge-pill mb-1.5">
            {isSignUp ? 'New Account' : 'Account Access'}
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp
              ? 'Start checking your data exposure and requesting removals'
              : 'Sign in to access your cases and monitor status'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-full border border-white/[0.08] mb-6 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-full transition-all ${
              !isSignUp
                ? 'bg-blue-600 text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-slate-200'
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
                ? 'bg-blue-600 text-white shadow-glow-blue'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                Full Name
              </label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-white/[0.08] focus-within:border-blue-500 transition-colors shadow-inner">
                <User className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-white/[0.08] focus-within:border-blue-500 transition-colors shadow-inner">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-white/[0.08] focus-within:border-blue-500 transition-colors shadow-inner">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                Location / Applicable Law
              </label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-white/[0.08] shadow-inner">
                <MapPin className="w-4 h-4 text-slate-400" />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                >
                  <option value="DL" className="bg-slate-900 text-white">
                    India — Delhi / NCR (DPDPA 2023)
                  </option>
                  <option value="MH" className="bg-slate-900 text-white">
                    India — Maharashtra / Mumbai (DPDPA 2023)
                  </option>
                  <option value="KA" className="bg-slate-900 text-white">
                    India — Karnataka / Bengaluru (DPDPA 2023)
                  </option>
                  <option value="TN" className="bg-slate-900 text-white">
                    India — Tamil Nadu / Chennai (DPDPA 2023)
                  </option>
                  <option value="UP" className="bg-slate-900 text-white">
                    India — Uttar Pradesh / Noida (DPDPA 2023)
                  </option>
                  <option value="IN-OTHER" className="bg-slate-900 text-white">
                    India — All Other States & UTs (DPDPA 2023)
                  </option>
                  <option value="CA" className="bg-slate-900 text-white">
                    United States — California (CCPA / CPRA)
                  </option>
                  <option value="EU" className="bg-slate-900 text-white">
                    European Union / UK (GDPR Article 17)
                  </option>
                  <option value="GLOBAL" className="bg-slate-900 text-white">
                    Other International
                  </option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-xs font-semibold py-4 rounded-full disabled:opacity-50"
          >
            <span>{loading ? 'Please wait...' : isSignUp ? 'Create Account & Start' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
