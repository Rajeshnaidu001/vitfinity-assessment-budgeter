import { motion } from 'framer-motion';

/**
 * StabilityMeter — Financial stability indicator.
 * High = calm, Low = flickering warning.
 */
export default function StabilityMeter({ value = 70, className = '' }) {
  const clamped = Math.max(0, Math.min(100, value));

  let emoji, label, rgb;
  if (clamped >= 70) {
    emoji = '🛡️';
    label = 'Stable';
    rgb = '52,211,153';
  } else if (clamped >= 40) {
    emoji = '⚡';
    label = 'Cautious';
    rgb = '251,191,36';
  } else {
    emoji = '🔥';
    label = 'At Risk';
    rgb = '248,113,113';
  }

  return (
    <motion.div
      className={`glass rounded-2xl p-4 text-center ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-xs font-semibold text-moonbeam mb-2">Financial Stability</div>

      {/* Emoji */}
      <motion.div
        className="text-3xl mb-1"
        key={emoji}
        initial={{ scale: 1.4 }}
        animate={
          clamped < 40
            ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
            : { scale: 1 }
        }
        transition={
          clamped < 40
            ? { duration: 1, repeat: Infinity }
            : { type: 'spring', stiffness: 300 }
        }
      >
        {emoji}
      </motion.div>

      {/* Label */}
      <div
        className="text-xs font-medium mb-2"
        style={{ color: `rgb(${rgb})` }}
      >
        {label}
      </div>

      {/* Bar */}
      <div
        className="w-full h-3 rounded-full overflow-hidden"
        style={{ background: 'rgba(42, 48, 96, 0.6)' }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: '70%' }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, rgba(${rgb}, 0.7), rgba(${rgb}, 0.4))`,
            boxShadow: `0 0 8px rgba(${rgb}, 0.3)`,
          }}
        />
      </div>

      <div className="text-xs text-dim mt-1">{clamped}%</div>

      {/* Warning flicker at low stability */}
      {clamped < 40 && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: '1px solid rgba(248,113,113,0.2)' }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
