import { useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * MemoryTimeline — Horizontal scrollable timeline of major financial events.
 */
export default function MemoryTimeline({ events = [], className = '' }) {
  const scrollRef = useRef(null);

  if (events.length === 0) {
    return (
      <motion.div
        className={`glass-strong rounded-3xl p-6 text-center ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-moonbeam text-sm">No major events recorded this month.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`glass-strong rounded-3xl p-5 sm:p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-sm font-bold text-starlight mb-4 text-center">📅 Your Month Timeline</h3>

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-2 scrollbar-thin"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex items-start gap-0 min-w-max px-2">
          {events.map((evt, i) => (
            <motion.div
              key={i}
              className="flex items-start"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              {/* Event node */}
              <div className="flex flex-col items-center w-28 sm:w-32">
                {/* Icon circle */}
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2"
                  style={{
                    background: `linear-gradient(135deg, rgba(${evt.rgb || '79,140,255'}, 0.2), rgba(${evt.rgb || '79,140,255'}, 0.05))`,
                    border: `2px solid rgba(${evt.rgb || '79,140,255'}, 0.3)`,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {evt.icon}
                </motion.div>

                {/* Title */}
                <div className="text-xs font-semibold text-starlight text-center leading-tight mb-0.5">
                  {evt.title}
                </div>

                {/* Detail */}
                <div className="text-[10px] text-dim text-center">{evt.detail}</div>

                {/* Cost badge */}
                {evt.cost !== undefined && (
                  <div className={`text-[10px] font-bold mt-1 ${evt.cost > 0 ? 'text-comet-red' : 'text-nova-green'}`}>
                    {evt.cost > 0 ? `−${evt.cost}` : 'FREE'}
                  </div>
                )}
              </div>

              {/* Connector */}
              {i < events.length - 1 && (
                <div className="flex items-center pt-5">
                  <motion.div
                    className="w-8 sm:w-12 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, rgba(79,140,255,0.3), rgba(168,85,247,0.3))',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
