import { motion } from 'framer-motion';

/**
 * WeekTimeline — Animated horizontal week progress indicator (Week 1–4).
 */
export default function WeekTimeline({ currentWeek = 1, totalWeeks = 4, weeks = [], className = '' }) {
  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: totalWeeks }, (_, i) => {
          const weekNum = i + 1;
          const week = weeks[i];
          const isActive = weekNum === currentWeek;
          const isCompleted = weekNum < currentWeek;
          const isFuture = weekNum > currentWeek;

          return (
            <div key={weekNum} className="flex-1 flex items-center">
              {/* Week node */}
              <motion.div
                className={`relative flex flex-col items-center ${isActive ? 'z-10' : ''}`}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Circle */}
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                    isCompleted
                      ? 'bg-nova-green/20 text-nova-green border-2 border-nova-green/40'
                      : isActive
                        ? 'bg-plasma-blue/20 text-plasma-blue border-2 border-plasma-blue/50'
                        : 'bg-stardust/20 text-dim border-2 border-stardust/20'
                  }`}
                  style={
                    isActive
                      ? { boxShadow: '0 0 20px rgba(79,140,255,0.3)' }
                      : isCompleted
                        ? { boxShadow: '0 0 12px rgba(52,211,153,0.2)' }
                        : {}
                  }
                >
                  {isCompleted ? '✓' : week?.icon || weekNum}
                </motion.div>

                {/* Label */}
                <div className="mt-1.5 text-center">
                  <div className={`text-xs font-semibold ${
                    isActive ? 'text-plasma-blue' : isCompleted ? 'text-nova-green' : 'text-dim'
                  }`}>
                    Week {weekNum}
                  </div>
                  {week && (
                    <div className="text-[10px] text-moonbeam truncate max-w-[80px]">
                      {week.title}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Connector line */}
              {weekNum < totalWeeks && (
                <div className="flex-1 mx-1">
                  <div className="relative h-1 rounded-full bg-stardust/20 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: isCompleted ? '100%' : isActive ? '50%' : '0%',
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        background: isCompleted
                          ? 'linear-gradient(90deg, #34d399, #4f8cff)'
                          : 'linear-gradient(90deg, #4f8cff, #a855f7)',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
