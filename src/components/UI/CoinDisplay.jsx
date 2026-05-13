import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * Animated currency display with coin icon and count-up animation
 */
export default function CoinDisplay({
  amount,
  label,
  size = 'md',
  showChange = false,
  previousAmount,
  className = '',
}) {
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const [displayValue, setDisplayValue] = useState(0);
  const [change, setChange] = useState(null);

  useEffect(() => {
    springValue.set(amount);
  }, [amount, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (v) => {
      setDisplayValue(Math.round(v));
    });
    return unsubscribe;
  }, [springValue]);

  useEffect(() => {
    if (showChange && previousAmount !== undefined && previousAmount !== amount) {
      const diff = amount - previousAmount;
      setChange(diff);
      const timer = setTimeout(() => setChange(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [amount, previousAmount, showChange]);

  const sizes = {
    sm: { text: 'text-lg', icon: 'text-base', gap: 'gap-1.5' },
    md: { text: 'text-2xl', icon: 'text-xl', gap: 'gap-2' },
    lg: { text: 'text-4xl', icon: 'text-3xl', gap: 'gap-3' },
    xl: { text: 'text-5xl', icon: 'text-4xl', gap: 'gap-4' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`flex items-center ${s.gap}`}>
        <motion.span
          className={s.icon}
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        >
          💰
        </motion.span>
        <span className={`coin-value ${s.text} text-solar-yellow font-bold`}>
          {displayValue}
        </span>
      </div>
      {label && (
        <span className="text-moonbeam text-sm mt-1">{label}</span>
      )}

      {/* Change indicator */}
      {change !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: -5 }}
          exit={{ opacity: 0 }}
          className={`text-sm font-semibold mt-1 ${
            change > 0 ? 'text-nova-green' : 'text-comet-red'
          }`}
        >
          {change > 0 ? '+' : ''}{change}
        </motion.div>
      )}
    </div>
  );
}
