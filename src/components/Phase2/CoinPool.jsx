import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * CoinPool — Displays remaining unallocated coins as a floating visual grid.
 */
export default function CoinPool({ remaining = 0, total = 110, className = '' }) {
  // Create visual coin dots (max 55 displayed, scaled)
  const displayCount = Math.min(55, remaining);
  const coins = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        x: (i % 11) * 28 + Math.random() * 6,
        y: Math.floor(i / 11) * 28 + Math.random() * 6,
        delay: i * 0.02,
      })),
    []
  );

  return (
    <motion.div
      className={`glass rounded-2xl p-5 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💰
          </motion.span>
          <span className="text-sm font-semibold text-starlight">Unallocated Coins</span>
        </div>
        <motion.span
          className={`text-lg font-bold coin-value ${
            remaining === 0 ? 'text-nova-green' : 'text-solar-yellow'
          }`}
          key={remaining}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {remaining}
        </motion.span>
      </div>

      {/* Visual coin grid */}
      <div className="relative h-[140px] w-full overflow-hidden rounded-xl"
        style={{ background: 'rgba(15, 20, 50, 0.3)' }}
      >
        {coins.map((coin, i) => (
          <motion.div
            key={coin.id}
            className="absolute"
            style={{
              left: coin.x,
              top: coin.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: i < displayCount ? 0.9 : 0.1,
              scale: i < displayCount ? 1 : 0.5,
              y: i < displayCount ? [0, -3, 0] : 0,
            }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
              y: {
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: coin.delay,
                ease: 'easeInOut',
              },
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
              style={{
                background: i < displayCount
                  ? 'linear-gradient(135deg, #fbbf24, #f97316)'
                  : 'rgba(100,116,139,0.2)',
                boxShadow: i < displayCount
                  ? '0 0 6px rgba(251,191,36,0.4)'
                  : 'none',
              }}
            >
              {i < displayCount ? '🪙' : ''}
            </div>
          </motion.div>
        ))}

        {/* "All allocated" overlay */}
        {remaining === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="glass rounded-xl px-4 py-2">
              <span className="text-nova-green text-sm font-semibold">✓ All coins allocated!</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress hint */}
      <p className="text-xs text-dim mt-2">
        {remaining > 0
          ? `Distribute ${remaining} more coin${remaining !== 1 ? 's' : ''} to the jars`
          : 'Check if your allocation matches the targets!'
        }
      </p>
    </motion.div>
  );
}
