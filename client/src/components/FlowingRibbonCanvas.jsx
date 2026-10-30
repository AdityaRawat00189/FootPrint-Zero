import React, { useEffect, useRef } from 'react';

/**
 * FlowingRibbonCanvas: Canvas texture lines blended between fluid curves,
 * drawn at low opacity (~4%) with brand orange & warm amber tints.
 * Performance-disciplined: DPR capped at 2, throttled to ~30fps,
 * runs only when visible via IntersectionObserver.
 */
export const FlowingRibbonCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = true;
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // Throttled to ~30fps

    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Capped at 2
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Only run when visible on screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      if (!isVisible) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      time += 0.008;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle wavy mesh lines
      const lineCount = 7;
      for (let i = 0; i < lineCount; i++) {
        const offset = i * 0.35;
        const alpha = 0.03 + (i % 3) * 0.015;

        ctx.beginPath();
        const yBase = height * 0.35 + i * (height * 0.08);

        ctx.moveTo(0, yBase);
        for (let x = 0; x <= width; x += 30) {
          const wave1 = Math.sin(x * 0.003 + time + offset) * 45;
          const wave2 = Math.cos(x * 0.006 - time * 0.8 + offset) * 25;
          const y = yBase + wave1 + wave2;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = i % 2 === 0 ? `rgba(59, 130, 246, ${alpha})` : `rgba(6, 182, 212, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      style={{
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
      }}
      aria-hidden="true"
    />
  );
};
