import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for canvas-based particle system
 * Creates floating, drifting particles with parallax mouse interaction
 */
export function useParticles(canvasRef, options = {}) {
  const {
    particleCount = 60,
    colors = ['#4f8cff', '#a855f7', '#34d399', '#fbbf24', '#ec4899'],
    minSize = 1,
    maxSize = 3,
    speed = 0.3,
    mouseInfluence = 0.02,
    connected = false,
    connectionDistance = 120,
  } = options;

  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);

  const initParticles = useCallback((width, height) => {
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: minSize + Math.random() * (maxSize - minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.2 + Math.random() * 0.5,
      twinkleSpeed: 0.005 + Math.random() * 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }));
  }, [particleCount, colors, minSize, maxSize, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.parentElement.clientWidth;
    let height = canvas.parentElement.clientHeight;

    const resize = () => {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
      if (particlesRef.current.length === 0) {
        initParticles(width, height);
      }
    };

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        // Mouse influence
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += dx * mouseInfluence * 0.01;
          p.vy += dy * mouseInfluence * 0.01;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Twinkle
        p.twinklePhase += p.twinkleSpeed;
        const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase);
        const currentOpacity = p.opacity * twinkle;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();

        // Optional glow
        if (p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.globalAlpha = currentOpacity * 0.2;
          ctx.fill();
        }
      });

      // Draw connections
      if (connected) {
        ctx.globalAlpha = 1;
        particlesRef.current.forEach((a, i) => {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const b = particlesRef.current[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = a.color;
              ctx.globalAlpha = 0.1 * (1 - dist / connectionDistance);
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, [canvasRef, initParticles, mouseInfluence, connected, connectionDistance]);

  return particlesRef;
}
