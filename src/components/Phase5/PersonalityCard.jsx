import { motion } from 'framer-motion';

/**
 * PersonalityCard — Financial personality reveal with animated entrance.
 */
export default function PersonalityCard({ personality, className = '' }) {
  if (!personality) return null;

  return (
    <motion.div
      className={`glass-strong rounded-3xl overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Colored header */}
      <div
        className="px-6 py-5 text-center"
        style={{
          background: `linear-gradient(135deg, rgba(${personality.rgb}, 0.2), rgba(${personality.rgb}, 0.05))`,
          borderBottom: `1px solid rgba(${personality.rgb}, 0.2)`,
        }}
      >
        <motion.div
          className="text-5xl sm:text-6xl mb-2"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
        >
          {personality.emoji}
        </motion.div>
        <motion.div
          className="text-xs font-mono text-dim mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          YOUR FINANCIAL PERSONALITY
        </motion.div>
        <motion.h2
          className={`text-xl sm:text-2xl font-black text-${personality.color}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {personality.title}
        </motion.h2>
      </div>

      {/* Description */}
      <div className="px-6 py-5">
        <motion.p
          className="text-moonbeam text-sm sm:text-base leading-relaxed text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {personality.description}
        </motion.p>
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ border: `2px solid rgba(${personality.rgb}, 0.15)` }}
        animate={{
          boxShadow: [
            `0 0 0 0 rgba(${personality.rgb}, 0)`,
            `0 0 25px 3px rgba(${personality.rgb}, 0.15)`,
            `0 0 0 0 rgba(${personality.rgb}, 0)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}
