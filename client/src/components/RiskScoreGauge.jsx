import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const RiskScoreGauge = ({ score = 0, size = 180, showLabel = true }) => {
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    stiffness: 45,
    damping: 15,
  });

  useEffect(() => {
    springValue.set(score);
  }, [score, springValue]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
  }, [springValue]);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorFrom = '#10B981';
  let colorTo = '#34D399';
  let statusText = 'SECURE / MINIMAL';
  let StatusIcon = ShieldCheck;
  let textColor = 'text-emerald-400';

  if (score >= 75) {
    colorFrom = '#EF4444';
    colorTo = '#F87171';
    statusText = 'CRITICAL EXPOSURE';
    StatusIcon = ShieldAlert;
    textColor = 'text-rose-400';
  } else if (score >= 45) {
    colorFrom = '#FF5B22';
    colorTo = '#FF8A5B';
    statusText = 'ELEVATED RISK';
    StatusIcon = AlertTriangle;
    textColor = 'text-brand-orange';
  } else if (score >= 20) {
    colorFrom = '#F59E0B';
    colorTo = '#FBBF24';
    statusText = 'MODERATE EXPOSURE';
    StatusIcon = AlertTriangle;
    textColor = 'text-amber-400';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-15 pointer-events-none"
          style={{ background: colorFrom }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`gauge-grad-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gauge-grad-${score})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            {displayValue}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mt-0.5">
            / 100 RISK
          </span>
        </div>
      </div>

      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center gap-1.5 mt-3 text-xs font-mono font-semibold tracking-wider ${textColor}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{statusText}</span>
        </motion.div>
      )}
    </div>
  );
};
