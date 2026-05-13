import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * EmergencyAlert — Dramatic emergency notification with glitch/pulse effects.
 * Shows a cinematic alert sequence before revealing the emergency details.
 */
export default function EmergencyAlert({
  emergency,
  onRevealComplete,
  className = '',
}) {
  const [phase, setPhase] = useState('flash'); // flash → glitch → reveal

  useEffect(() => {
    // Flash (screen flicker) → glitch text → reveal card
    const t1 = setTimeout(() => setPhase('glitch'), 800);
    const t2 = setTimeout(() => setPhase('reveal'), 2200);
    const t3 = setTimeout(() => onRevealComplete?.(), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onRevealComplete]);

  return (
    <div className={`relative ${className}`}>
      {/* Screen flash overlay */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0, 0.4, 0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, times: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1] }}
            style={{ background: 'radial-gradient(circle, rgba(248,113,113,0.4), rgba(248,113,113,0.1))' }}
          />
        )}
      </AnimatePresence>

      {/* Glitch text */}
      <AnimatePresence>
        {phase === 'glitch' && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="text-4xl sm:text-6xl font-black text-comet-red mb-4"
              animate={{
                x: [0, -4, 3, -2, 4, 0],
                skewX: [0, -2, 3, -1, 2, 0],
                opacity: [1, 0.7, 1, 0.8, 1],
              }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              ⚠️ EMERGENCY ⚠️
            </motion.div>
            <motion.div
              className="text-sm text-comet-red/70 font-mono"
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 0.3, repeat: 4 }}
            >
              ALERT — UNEXPECTED EXPENSE DETECTED
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed emergency card */}
      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.div
            className="glass-strong rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {/* Red alert header */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, rgba(248,113,113,0.2), rgba(248,113,113,0.05))',
                borderBottom: '1px solid rgba(248,113,113,0.2)',
              }}
            >
              <motion.span
                className="text-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {emergency.alertIcon}
              </motion.span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-comet-red">
                  {emergency.title}
                </h2>
                <div className="text-xs text-comet-red/70 font-mono">
                  IMMEDIATE ATTENTION REQUIRED
                </div>
              </div>
              <motion.div
                className="w-3 h-3 rounded-full bg-comet-red"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className="text-5xl flex-shrink-0"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {emergency.icon}
                </motion.div>
                <div>
                  <p className="text-moonbeam text-sm leading-relaxed mb-3">
                    {emergency.description}
                  </p>
                  <div className="flex gap-4">
                    <div className="glass rounded-lg px-3 py-2 text-center">
                      <div className="text-xs text-dim">Replace</div>
                      <div className="text-sm font-bold text-comet-red coin-value">
                        {emergency.replaceCost} Units
                      </div>
                    </div>
                    <div className="glass rounded-lg px-3 py-2 text-center">
                      <div className="text-xs text-dim">Repair</div>
                      <div className="text-sm font-bold text-solar-yellow coin-value">
                        {emergency.repairCost} Units
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pulsing border */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ border: '2px solid rgba(248,113,113,0.3)' }}
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(248,113,113,0)',
                  '0 0 20px 4px rgba(248,113,113,0.2)',
                  '0 0 0 0 rgba(248,113,113,0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
