import { motion } from 'framer-motion';

/**
 * GoalProgress — Future savings goals with progress bars.
 * Shows how much the player's remaining savings contribute toward aspirational goals.
 */
export default function GoalProgress({ goals = [], savingsRemaining = 0, className = '' }) {
  return (
    <motion.div
      className={`glass-strong rounded-3xl p-5 sm:p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-sm font-bold text-starlight mb-1 text-center">🎯 Future Goals Protected</h3>
      <p className="text-xs text-dim text-center mb-4">
        Your savings of <span className="font-bold text-plasma-blue coin-value">{savingsRemaining} Units</span> per month could grow toward...
      </p>

      <div className="space-y-3">
        {goals.map((goal, i) => {
          // Simulate 6-month projection
          const projected = savingsRemaining * 6;
          const progressPct = Math.min(100, (projected / goal.cost) * 100);
          const monthsNeeded = savingsRemaining > 0 ? Math.ceil(goal.cost / savingsRemaining) : Infinity;
          const isReachable = monthsNeeded <= 12;

          return (
            <motion.div
              key={goal.id}
              className="rounded-2xl p-3"
              style={{
                background: 'rgba(42, 48, 96, 0.4)',
                border: `1px solid rgba(79,140,255, ${isReachable ? 0.15 : 0.06})`,
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{goal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-starlight">{goal.title}</div>
                  <div className="text-xs text-dim">{goal.cost} Units total</div>
                </div>
                <div className="text-right">
                  {isReachable ? (
                    <div className="text-xs text-nova-green font-medium">{monthsNeeded} months</div>
                  ) : (
                    <div className="text-xs text-dim">Keep saving!</div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div
                className="h-2.5 rounded-full overflow-hidden"
                style={{ background: 'rgba(42,48,96,0.6)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
                  style={{
                    background: isReachable
                      ? 'linear-gradient(90deg, rgba(52,211,153,0.7), rgba(79,140,255,0.6))'
                      : 'linear-gradient(90deg, rgba(100,116,139,0.4), rgba(100,116,139,0.2))',
                    boxShadow: isReachable ? '0 0 8px rgba(52,211,153,0.2)' : 'none',
                  }}
                />
              </div>

              <div className="text-[10px] text-dim mt-1 text-right">
                {Math.round(progressPct)}% in 6 months
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational footer */}
      {savingsRemaining > 0 ? (
        <motion.p
          className="text-xs text-nova-green/80 text-center mt-4 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          💡 Consistent saving is the path to big goals!
        </motion.p>
      ) : (
        <motion.p
          className="text-xs text-solar-yellow/80 text-center mt-4 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          💡 Even small savings each month can grow into something amazing.
        </motion.p>
      )}
    </motion.div>
  );
}
