import { motion } from 'framer-motion';

/**
 * Reusable glassmorphic card with Framer Motion animations
 */
export default function GlassCard({
  children,
  className = '',
  floating = false,
  glow = false,
  glowColor = 'blue',
  hover = true,
  delay = 0,
  onClick,
  as = 'div',
  ...props
}) {
  const glowClasses = {
    blue: 'glow-blue',
    green: 'glow-green',
    yellow: 'glow-yellow',
    red: 'glow-red',
    purple: 'glow-purple',
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      className={`glass rounded-2xl p-6 ${glow ? glowClasses[glowColor] || '' : ''} ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: floating ? [0, -8, 0] : 0,
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: floating
          ? { duration: 4, repeat: Infinity, ease: 'easeInOut', delay }
          : { duration: 0.5, delay },
        scale: { duration: 0.4, delay },
      }}
      whileHover={
        hover
          ? {
              scale: 1.02,
              boxShadow: '0 12px 40px rgba(79, 140, 255, 0.15)',
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
      {...props}
    >
      {children}
    </Component>
  );
}
