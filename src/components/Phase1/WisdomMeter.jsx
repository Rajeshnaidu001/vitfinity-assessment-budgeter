import { motion } from 'framer-motion';

/**
 * WisdomMeter — Animated progress bar showing sorting progress.
 * Fills as items are correctly sorted. Glows on each correct answer.
 */
export default function WisdomMeter({ current = 0, total = 6, className = '' }) {
  const percentage = Math.max(0, Math.min(100, (current / total) * 100));
  const isFull = current >= total;

  return (
    <motion.div
      className={`w-full max-w-md mx-auto ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg"
            animate={isFull ? { scale: [1, 1.3, 1], rotate: [0, 20, -20, 0] } : {}}
            transition={{ duration: 0.6, repeat: isFull ? 3 : 0 }}
          >
            🧠
          </motion.span>
          <span className="text-sm font-semibold text-starlight">Money Wisdom Meter</span>
        </div>
        <span className="text-sm font-bold coin-value text-plasma-blue">
          {current}/{total}
        </span>
      </div>

      {/* Progress bar track */}
      <div
        className="relative w-full h-5 rounded-full overflow-hidden"
        style={{ background: 'rgba(42, 48, 96, 0.6)' }}
      >
        {/* Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: isFull
              ? 'linear-gradient(90deg, #34d399, #4f8cff, #a855f7, #fbbf24)'
              : 'linear-gradient(90deg, #4f8cff, #a855f7)',
            boxShadow: isFull
              ? '0 0 20px rgba(168,85,247,0.5), 0 0 40px rgba(79,140,255,0.3)'
              : '0 0 12px rgba(79,140,255,0.4)',
          }}
        />

        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['-200% center', '200% center'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />

        {/* Segments */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-stardust/20 last:border-r-0"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
