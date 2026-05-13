import { motion } from 'framer-motion';

/**
 * HappinessMeter — Animated mood indicator showing the player's current happiness.
 */
export default function HappinessMeter({ value = 70, className = '' }) {
  const clampedValue = Math.max(0, Math.min(100, value));

  // Determine mood emoji and color
  let emoji, label, color;
  if (clampedValue >= 80) {
    emoji = '😄';
    label = 'Very Happy';
    color = '52,211,153';
  } else if (clampedValue >= 60) {
    emoji = '😊';
    label = 'Happy';
    color = '79,140,255';
  } else if (clampedValue >= 40) {
    emoji = '😐';
    label = 'Okay';
    color = '251,191,36';
  } else if (clampedValue >= 20) {
    emoji = '😟';
    label = 'Worried';
    color = '248,113,113';
  } else {
    emoji = '😢';
    label = 'Stressed';
    color = '248,113,113';
  }

  return (
    <motion.div
      className={`glass rounded-2xl p-4 text-center ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-xs font-semibold text-moonbeam mb-2">Happiness</div>

      {/* Emoji */}
      <motion.div
        className="text-3xl sm:text-4xl mb-1"
        key={emoji}
        initial={{ scale: 1.4, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {emoji}
      </motion.div>

      {/* Label */}
      <div className="text-xs font-medium mb-2" style={{ color: `rgb(${color})` }}>
        {label}
      </div>

      {/* Bar */}
      <div
        className="w-full h-3 rounded-full overflow-hidden"
        style={{ background: 'rgba(42, 48, 96, 0.6)' }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedValue}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, rgba(${color}, 0.7), rgba(${color}, 0.4))`,
            boxShadow: `0 0 8px rgba(${color}, 0.3)`,
          }}
        />
      </div>

      {/* Value */}
      <div className="text-xs text-dim mt-1">{clampedValue}%</div>
    </motion.div>
  );
}
