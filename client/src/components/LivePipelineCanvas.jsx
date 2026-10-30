import React, { useEffect, useRef, useState } from 'react';

const LANES = [
  { id: 'discovery', label: '1. Scan & Discovery', xRatio: 0.14 },
  { id: 'ranking', label: '2. Risk Assessment', xRatio: 0.38 },
  { id: 'drafting', label: '3. Legal Drafting', xRatio: 0.62 },
  { id: 'dispatch', label: '4. Human Review & Send', xRatio: 0.86 },
];

const DATA_VECTORS = [
  { label: 'Mobile Record', target: 'Truecaller Directory', clause: 'DPDPA 2023 § 12', risk: '78/100', color: '#3B82F6' },
  { label: 'Tax Profile', target: 'Credit Bureau', clause: 'DPDPA 2023 § 6(4)', risk: '85/100', color: '#6366F1' },
  { label: 'Identity Record', target: 'Commercial Dialer', clause: 'DPDPA Erasure Notice', risk: '92/100', color: '#EF4444' },
  { label: 'Work Profile', target: 'B2B Database', clause: 'GDPR Art. 17 / CCPA', risk: '64/100', color: '#06B6D4' },
  { label: 'Address Tag', target: 'Local Business Directory', clause: 'DPDPA Removal', risk: '70/100', color: '#10B981' },
];

export const LivePipelineCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredParticle, setHoveredParticle] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Particles state
    const particles = [];
    const maxParticles = window.innerWidth < 768 ? 20 : 38;

    for (let i = 0; i < maxParticles; i++) {
      const vector = DATA_VECTORS[i % DATA_VECTORS.length];
      particles.push({
        x: Math.random() * width,
        y: height * 0.2 + Math.random() * (height * 0.6),
        speed: 0.5 + Math.random() * 0.7,
        radius: 3.5 + Math.random() * 2,
        vector,
        pulse: Math.random() * Math.PI,
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (isVisible = e.isIntersecting));
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let lastTime = 0;
    const fpsInterval = 1000 / 30;

    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;
      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, width, height);

      // Draw horizontal connector tracks
      const trackY1 = height * 0.35;
      const trackY2 = height * 0.65;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);

      ctx.beginPath();
      ctx.moveTo(0, trackY1);
      ctx.lineTo(width, trackY1);
      ctx.moveTo(0, trackY2);
      ctx.lineTo(width, trackY2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Lane Divider Columns
      LANES.forEach((lane) => {
        const lx = width * lane.xRatio;
        ctx.strokeStyle = 'rgba(255, 91, 34, 0.12)';
        ctx.beginPath();
        ctx.moveTo(lx, 20);
        ctx.lineTo(lx, height - 20);
        ctx.stroke();

        // Lane node dot
        ctx.fillStyle = 'rgba(255, 91, 34, 0.4)';
        ctx.beginPath();
        ctx.arc(lx, trackY1, 3, 0, Math.PI * 2);
        ctx.arc(lx, trackY2, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update & render particles
      particles.forEach((p) => {
        p.pulse += 0.04;
        p.x += p.speed;
        if (p.x > width + 10) {
          p.x = -10;
          p.y = height * 0.2 + Math.random() * (height * 0.6);
        }

        // Draw particle halo
        const halo = p.radius + Math.sin(p.pulse) * 1.5;
        ctx.fillStyle = p.vector.color + '22';
        ctx.beginPath();
        ctx.arc(p.x, p.y, halo + 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = p.vector.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw small label snippet on prominent particles
        if (p.radius > 4.5 && width > 640) {
          ctx.font = '10px JetBrains Mono';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.fillText(p.vector.label.slice(0, 14), p.x + 8, p.y + 3);
        }
      });
    };

    animationFrameId = requestAnimationFrame(render);

    // Mouse hover collision detection
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = null;
      for (const p of particles) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        if (Math.sqrt(dx * dx + dy * dy) < 18) {
          found = p;
          break;
        }
      }

      if (found) {
        setHoveredParticle(found.vector);
        setTooltipPos({ x: found.x, y: found.y });
      } else {
        setHoveredParticle(null);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[220px] rounded-3xl bg-[#0C1220] border border-white/[0.08] overflow-hidden shadow-inner">
      {/* Top Header Labels */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10 text-[11px] text-slate-400">
        <span className="font-semibold text-blue-400">Autonomous Agent Pipeline</span>
        <span className="hidden sm:inline">Hover over moving items to see broker & legal routing</span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

      {/* Lane Labels along bottom */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-around pointer-events-none z-10 px-4 text-[11px] text-slate-400">
        {LANES.map((l) => (
          <span key={l.id} className="text-center font-medium text-slate-300">
            {l.label}
          </span>
        ))}
      </div>

      {/* Interactive Tooltip */}
      {hoveredParticle && (
        <div
          style={{
            left: `${Math.min(Math.max(tooltipPos.x + 10, 10), 320)}px`,
            top: `${Math.max(tooltipPos.y - 80, 10)}px`,
          }}
          className="absolute z-30 p-3 rounded-2xl bg-slate-900 border border-blue-500/50 shadow-2xl text-xs text-white pointer-events-none min-w-[220px]"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08] mb-1.5">
            <span className="text-blue-400 font-bold text-[10px]">
              DATA EXPOSURE
            </span>
            <span className="text-[10px] text-slate-400">{hoveredParticle.risk} Risk</span>
          </div>
          <div className="text-white font-bold">{hoveredParticle.label}</div>
          <div className="text-slate-300 text-[11px] mt-0.5">Target: {hoveredParticle.target}</div>
          <div className="text-blue-400 text-[10px] mt-1 font-semibold">{hoveredParticle.clause}</div>
        </div>
      )}
    </div>
  );
};
