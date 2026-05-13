import { motion } from 'framer-motion';

/**
 * Animated progress bar with gradient fill and glow effect
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercentage = true,
  variant = 'blue',
  size = 'md',
  className = '',
  animated = true,
}) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  const variants = {
    blue: {
      gradient: 'linear-gradient(90deg, #4f8cff, #7aaaff)',
      glow: 'rgba(79, 140, 255, 0.4)',
      text: 'text-plasma-blue',
    },
    green: {
      gradient: 'linear-gradient(90deg, #34d399, #6ee7b7)',
      glow: 'rgba(52, 211, 153, 0.4)',
      text: 'text-nova-green',
    },
    yellow: {
      gradient: 'linear-gradient(90deg, #fbbf24, #fcd34d)',
      glow: 'rgba(251, 191, 36, 0.4)',
      text: 'text-solar-yellow',
    },
    red: {
      gradient: 'linear-gradient(90deg, #f87171, #fca5a5)',
      glow: 'rgba(248, 113, 113, 0.4)',
      text: 'text-comet-red',
    },
    purple: {
      gradient: 'linear-gradient(90deg, #a855f7, #c084fc)',
      glow: 'rgba(168, 85, 247, 0.4)',
      text: 'text-plasma-purple',
    },
    pink: {
      gradient: 'linear-gradient(90deg, #ec4899, #f472b6)',
      glow: 'rgba(236, 72, 153, 0.4)',
      text: 'text-cosmic-pink',
    },
  };

  const v = variants[variant] || variants.blue;

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-moonbeam font-medium">{label}</span>}
          {showPercentage && (
            <span className={`text-sm font-semibold coin-value ${v.text}`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${heights[size] || heights.md} rounded-full overflow-hidden`}
        style={{ background: 'rgba(42, 48, 96, 0.5)' }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
          style={{
            background: v.gradient,
            boxShadow: `0 0 12px ${v.glow}`,
          }}
        />
      </div>
    </div>
  );
}
