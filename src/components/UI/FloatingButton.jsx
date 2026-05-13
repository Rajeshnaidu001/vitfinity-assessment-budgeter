import { motion } from 'framer-motion';

/**
 * Primary action button with gradient, glow, and spring animation
 */
export default function FloatingButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  fullWidth = false,
  ...props
}) {
  const variants = {
    primary: 'gradient-blue-purple text-white',
    success: 'gradient-green-blue text-white',
    warning: 'gradient-yellow-orange text-void',
    danger: 'gradient-pink-purple text-white',
    ghost: 'bg-transparent border border-stardust text-starlight hover:border-plasma-blue',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
    xl: 'px-10 py-5 text-xl rounded-3xl',
  };

  return (
    <motion.button
      className={`
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        font-semibold
        relative overflow-hidden
        transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      onClick={disabled || loading ? undefined : onClick}
      whileHover={
        disabled
          ? undefined
          : {
              scale: 1.05,
              boxShadow: '0 0 25px rgba(79, 140, 255, 0.3), 0 8px 30px rgba(0, 0, 0, 0.3)',
            }
      }
      whileTap={disabled ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled}
      {...props}
    >
      {/* Shimmer overlay */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <motion.span
            className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {icon && <span className="text-lg">{icon}</span>}
            {children}
          </>
        )}
      </span>
    </motion.button>
  );
}
