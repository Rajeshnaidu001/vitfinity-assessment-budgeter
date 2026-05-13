import { useRef } from 'react';
import { useParticles } from '../../hooks/useParticles';

/**
 * Full-screen animated particle background
 * Creates a space-like starfield with floating, twinkling particles
 */
export default function ParticleField({ className = '', phaseColors }) {
  const canvasRef = useRef(null);

  const defaultColors = ['#4f8cff', '#a855f7', '#34d399', '#fbbf24', '#ec4899'];

  useParticles(canvasRef, {
    particleCount: 70,
    colors: phaseColors || defaultColors,
    minSize: 1,
    maxSize: 3.5,
    speed: 0.25,
    mouseInfluence: 0.03,
  });

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
