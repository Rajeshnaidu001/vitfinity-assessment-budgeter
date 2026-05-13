import { motion } from 'framer-motion';

/**
 * BudgetJar — Interactive glass jar with fill level, live counters, and +/- controls.
 * Fill level is animated proportionally to amount/target.
 */
export default function BudgetJar({
  jar,
  amount = 0,
  total = 110,
  onAdd,
  onRemove,
  disabled = false,
  className = '',
}) {
  const { label, icon, emoji, targetPct, targetAmount, purpose, color, rgb, gradient, borderColor } = jar;
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  const fillPct = Math.min(100, (amount / Math.max(targetAmount * 1.3, 1)) * 100);
  const isAtTarget = amount === targetAmount;
  const isOverfilled = amount > targetAmount;
  const isEmpty = amount === 0;

  return (
    <motion.div
      className={`relative flex flex-col items-center ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Jar container */}
      <motion.div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          background: gradient,
          border: `2px solid ${isAtTarget ? borderColor : 'rgba(79,140,255,0.1)'}`,
          boxShadow: isAtTarget
            ? `0 0 25px rgba(${rgb}, 0.4), inset 0 0 15px rgba(${rgb}, 0.1)`
            : isOverfilled
              ? `0 0 20px rgba(248,113,113,0.3)`
              : '0 4px 20px rgba(0,0,0,0.2)',
          minHeight: '220px',
        }}
        animate={
          isOverfilled
            ? { rotate: [0, -1.5, 1.5, -1, 1, 0] }
            : {}
        }
        transition={
          isOverfilled
            ? { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
            : {}
        }
      >
        {/* Fill level */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          initial={{ height: 0 }}
          animate={{ height: `${fillPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(180deg, rgba(${rgb}, 0.35) 0%, rgba(${rgb}, 0.15) 100%)`,
            borderTop: `1px solid rgba(${rgb}, 0.3)`,
          }}
        >
          {/* Bubble effects inside fill */}
          {amount > 0 && (
            <>
              {[...Array(Math.min(5, Math.ceil(amount / 10)))].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 4 + Math.random() * 6,
                    height: 4 + Math.random() * 6,
                    background: `rgba(${rgb}, 0.4)`,
                    left: `${15 + Math.random() * 70}%`,
                    bottom: `${10 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Jar content (above fill) */}
        <div className="relative z-10 flex flex-col items-center justify-center p-5 min-h-[220px]">
          {/* Jar icon */}
          <motion.div
            className="text-4xl mb-2"
            animate={
              isAtTarget
                ? { scale: [1, 1.15, 1] }
                : isEmpty
                  ? { opacity: [0.4, 0.7, 0.4] }
                  : {}
            }
            transition={{ duration: 2, repeat: Infinity }}
          >
            {emoji}
          </motion.div>

          {/* Label */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg">{icon}</span>
            <h3 className={`text-base font-bold text-${color}`}>{label}</h3>
          </div>

          {/* Purpose */}
          <p className="text-xs text-moonbeam text-center mb-3 max-w-[140px] leading-relaxed">
            {purpose}
          </p>

          {/* Amount counter */}
          <motion.div
            className="text-center mb-1"
            key={amount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <span className={`text-2xl font-black coin-value text-${color}`}>
              {amount}
            </span>
            <span className="text-sm text-dim"> / {targetAmount}</span>
          </motion.div>

          {/* Percentage */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-bold ${isAtTarget ? `text-${color}` : 'text-moonbeam'}`}>
              {pct}%
            </span>
            <span className="text-xs text-dim">
              (target: {targetPct}%)
            </span>
          </div>

          {/* Status indicator */}
          {isAtTarget && (
            <motion.div
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full bg-${color}/15 text-${color} mt-1`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              ✓ Perfect!
            </motion.div>
          )}
          {isOverfilled && (
            <motion.div
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-comet-red/15 text-comet-red mt-1"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚠ Too much!
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4">
        <motion.button
          className="w-10 h-10 rounded-xl glass flex items-center justify-center text-lg font-bold text-moonbeam cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          disabled={disabled || amount <= 0}
          aria-label={`Remove coin from ${label}`}
        >
          −
        </motion.button>

        <motion.button
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
          style={{
            background: `linear-gradient(135deg, rgba(${rgb}, 0.8), rgba(${rgb}, 0.5))`,
            boxShadow: `0 2px 10px rgba(${rgb}, 0.3)`,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAdd}
          disabled={disabled}
          aria-label={`Add coin to ${label}`}
        >
          +
        </motion.button>
      </div>
    </motion.div>
  );
}
