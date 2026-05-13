import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Achievement/reward celebration popup
 * Shows a modal overlay with particle burst animation
 */
export default function RewardPopup({ reward, onDismiss, autoDismiss = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss && reward) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onDismiss?.(), 500);
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [reward, autoDismiss, onDismiss]);

  if (!reward) return null;

  // Generate burst particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    angle: (i / 20) * 360,
    distance: 80 + Math.random() * 60,
    size: 4 + Math.random() * 8,
    color: ['#fbbf24', '#4f8cff', '#a855f7', '#34d399', '#ec4899'][i % 5],
    delay: Math.random() * 0.3,
  }));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-void/60 backdrop-blur-sm"
            onClick={() => {
              setVisible(false);
              setTimeout(() => onDismiss?.(), 300);
            }}
          />

          {/* Reward card */}
          <motion.div
            className="relative glass-strong rounded-3xl p-8 max-w-sm mx-4 text-center"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Burst particles */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  left: '50%',
                  top: '30%',
                }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                  y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 1,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Icon */}
            <motion.div
              className="text-6xl mb-4"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {reward.icon || '🏆'}
            </motion.div>

            {/* Title */}
            <motion.h3
              className="text-2xl font-bold coin-shimmer mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {reward.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              className="text-moonbeam mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {reward.description}
            </motion.p>

            {/* Points */}
            {reward.points && (
              <motion.div
                className="inline-flex items-center gap-2 bg-solar-yellow/10 px-4 py-2 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span>⭐</span>
                <span className="coin-value text-solar-yellow font-bold">
                  +{reward.points} pts
                </span>
              </motion.div>
            )}

            {/* Auto-dismiss progress */}
            {autoDismiss && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
                style={{ background: 'linear-gradient(90deg, #4f8cff, #a855f7)' }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoDismiss / 1000, ease: 'linear' }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
