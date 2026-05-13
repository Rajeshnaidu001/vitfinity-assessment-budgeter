import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * DropZone — A glowing target area where items can be dropped.
 * Uses forwardRef so Phase1 can access the DOM element for hit testing.
 */
const DropZone = forwardRef(function DropZone(
  {
    zone,
    isHighlighted = false,
    sortedItems = [],
    className = '',
  },
  ref
) {
  const { label, icon, description, color, glowClass, bgGradient, borderColor } = zone;

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col items-center min-h-[140px] sm:min-h-[160px] ${
        isHighlighted ? glowClass : ''
      } ${className}`}
      style={{
        background: bgGradient,
        border: `2px solid ${isHighlighted ? borderColor : 'rgba(79,140,255,0.1)'}`,
        boxShadow: isHighlighted
          ? `0 0 30px ${borderColor}, inset 0 0 20px ${borderColor.replace('0.4', '0.1')}`
          : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      animate={{
        scale: isHighlighted ? 1.05 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      {/* Zone header */}
      <div className="text-center mb-2">
        <motion.div
          className="text-2xl sm:text-3xl mb-1"
          animate={isHighlighted ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>
        <h3 className={`text-sm sm:text-base font-bold text-${color}`}>
          {label}
        </h3>
        <p className="text-xs text-moonbeam mt-0.5 hidden sm:block">
          {description}
        </p>
      </div>

      {/* Sorted items stacked here */}
      <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
        {sortedItems.map((item, i) => (
          <motion.div
            key={item.id}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-base"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 400 }}
            title={item.name}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      {/* Empty state hint */}
      {sortedItems.length === 0 && (
        <motion.p
          className="text-xs text-dim mt-1 italic"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Drop items here
        </motion.p>
      )}
    </motion.div>
  );
});

export default DropZone;
