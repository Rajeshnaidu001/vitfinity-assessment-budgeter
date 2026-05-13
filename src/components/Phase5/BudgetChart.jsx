import { motion } from 'framer-motion';

/**
 * BudgetChart — Animated side-by-side bar chart showing plan vs actual.
 * Custom Framer Motion bars — no external chart library needed.
 */
export default function BudgetChart({ planData, actualData, title, className = '' }) {
  const categories = planData.map((p, i) => ({
    ...p,
    actual: actualData[i]?.value || 0,
    actualLabel: actualData[i]?.label || '',
  }));

  const maxVal = Math.max(...categories.flatMap((c) => [c.value, c.actual]), 1);

  return (
    <motion.div
      className={`glass-strong rounded-3xl p-5 sm:p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm font-bold text-starlight mb-4 text-center">{title}</h3>

      <div className="space-y-4">
        {categories.map((cat, i) => {
          const planPct = (cat.value / maxVal) * 100;
          const actualPct = (cat.actual / maxVal) * 100;
          const diff = cat.actual - cat.value;

          return (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              {/* Category label */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-xs font-semibold text-starlight">{cat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-dim">Plan: {cat.value}</span>
                  <span className="text-xs font-medium" style={{ color: `rgb(${cat.rgb})` }}>
                    Actual: {cat.actual}
                  </span>
                  {diff !== 0 && (
                    <span className={`text-[10px] font-bold ${diff > 0 ? 'text-comet-red' : 'text-nova-green'}`}>
                      ({diff > 0 ? '+' : ''}{diff})
                    </span>
                  )}
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-1">
                {/* Plan bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-dim w-8">Plan</span>
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'rgba(42,48,96,0.5)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${planPct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                      style={{
                        background: `linear-gradient(90deg, rgba(${cat.rgb}, 0.3), rgba(${cat.rgb}, 0.15))`,
                        border: `1px solid rgba(${cat.rgb}, 0.2)`,
                      }}
                    />
                  </div>
                </div>

                {/* Actual bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] w-8" style={{ color: `rgb(${cat.rgb})` }}>Real</span>
                  <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'rgba(42,48,96,0.5)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${actualPct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                      style={{
                        background: `linear-gradient(90deg, rgba(${cat.rgb}, 0.7), rgba(${cat.rgb}, 0.4))`,
                        boxShadow: `0 0 10px rgba(${cat.rgb}, 0.2)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
