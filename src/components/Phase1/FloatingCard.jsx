import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingCard — A draggable item card with anti-gravity idle animation.
 * Uses Framer Motion drag; on drop, parent determines if it landed on a zone.
 */
export default function FloatingCard({
  item,
  index = 0,
  onDragStart,
  onDragEnd,
  state = 'idle', // idle | dragging | sorted | shaking
  dragConstraints,
  className = '',
}) {
  const [isDragging, setIsDragging] = useState(false);

  // Random idle animation values (memoized per item)
  const idle = useMemo(() => ({
    yOffset: 6 + Math.random() * 8,
    xOffset: 3 + Math.random() * 5,
    rotation: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 2,
    delay: index * 0.3 + Math.random() * 0.5,
  }), [index]);

  if (state === 'sorted') return null;

  return (
    <motion.div
      className={`cursor-grab active:cursor-grabbing touch-none select-none ${className}`}
      // Entry animation
      initial={{
        opacity: 0,
        scale: 0.5,
        x: (Math.random() - 0.5) * 200,
        y: -100 - Math.random() * 100,
        rotate: (Math.random() - 0.5) * 30,
      }}
      animate={
        state === 'shaking'
          ? {
              opacity: 1,
              scale: 1,
              x: [0, -12, 12, -8, 8, 0],
              y: 0,
              rotate: [0, -5, 5, -3, 3, 0],
            }
          : {
              opacity: 1,
              scale: isDragging ? 1.1 : 1,
              x: isDragging ? 0 : [0, idle.xOffset, -idle.xOffset, 0],
              y: isDragging ? 0 : [0, -idle.yOffset, idle.yOffset * 0.5, 0],
              rotate: isDragging ? 0 : [0, idle.rotation, -idle.rotation, 0],
            }
      }
      transition={
        state === 'shaking'
          ? { duration: 0.5, ease: 'easeInOut' }
          : isDragging
            ? { duration: 0.15 }
            : {
                opacity: { duration: 0.6, delay: idle.delay },
                scale: { duration: 0.4, delay: idle.delay },
                x: { duration: idle.duration, repeat: Infinity, ease: 'easeInOut', delay: idle.delay },
                y: { duration: idle.duration * 1.2, repeat: Infinity, ease: 'easeInOut', delay: idle.delay + 0.5 },
                rotate: { duration: idle.duration * 1.5, repeat: Infinity, ease: 'easeInOut', delay: idle.delay },
              }
      }
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.8}
      dragSnapToOrigin
      dragMomentum={false}
      onDragStart={(e, info) => {
        setIsDragging(true);
        onDragStart?.(item, info);
      }}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        onDragEnd?.(item, info, e);
      }}
      whileDrag={{
        scale: 1.12,
        zIndex: 50,
        boxShadow: '0 20px 60px rgba(79, 140, 255, 0.3), 0 0 30px rgba(168, 85, 247, 0.2)',
      }}
      style={{ zIndex: isDragging ? 50 : 1 }}
    >
      {/* Card content */}
      <div
        className={`glass-strong rounded-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 transition-all ${
          isDragging
            ? 'border-plasma-blue/40 shadow-lg'
            : 'border-stardust/20 hover:border-plasma-blue/20'
        }`}
        style={{
          border: `1px solid ${isDragging ? 'rgba(79,140,255,0.4)' : 'rgba(79,140,255,0.1)'}`,
          minWidth: '160px',
        }}
      >
        <motion.span
          className="text-2xl sm:text-3xl flex-shrink-0"
          animate={isDragging ? {} : { y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: idle.delay }}
        >
          {item.icon}
        </motion.span>
        <div className="flex-1 min-w-0">
          <div className="text-sm sm:text-base font-semibold text-starlight truncate">
            {item.name}
          </div>
          <div className="text-xs text-moonbeam coin-value">
            {item.cost === 0 ? 'FREE' : `${item.cost} Units`}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
