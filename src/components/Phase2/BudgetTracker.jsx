import { motion } from 'framer-motion';
import { BUDGET_JARS } from '../../utils/gameData';

/**
 * BudgetTracker — Live horizontal bar showing allocation percentages
 * with target markers at the 50/30/20 positions.
 */
export default function BudgetTracker({ allocations = {}, total = 110, className = '' }) {
  const segments = BUDGET_JARS.map((jar) => {
    const amount = allocations[jar.id] || 0;
    const pct = total > 0 ? (amount / total) * 100 : 0;
    const isTarget = amount === jar.targetAmount;
    return { ...jar, amount, pct, isTarget };
  });

  const allCorrect = segments.every((s) => s.isTarget);
  const totalAllocated = segments.reduce((sum, s) => sum + s.amount, 0);
  const totalPct = total > 0 ? Math.round((totalAllocated / total) * 100) : 0;

  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-starlight">Budget Allocation</span>
        <span className={`text-sm font-bold coin-value ${allCorrect ? 'text-nova-green' : 'text-moonbeam'}`}>
          {totalAllocated}/{total} Units ({totalPct}%)
        </span>
      </div>

      {/* Segmented bar */}
      <div
        className="relative w-full h-8 rounded-full overflow-hidden flex"
        style={{ background: 'rgba(42, 48, 96, 0.6)' }}
      >
        {segments.map((seg) => (
          <motion.div
            key={seg.id}
            className="relative h-full flex items-center justify-center overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${seg.pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              background: `linear-gradient(90deg, rgba(${seg.rgb}, 0.6), rgba(${seg.rgb}, 0.35))`,
              borderRight: seg.pct > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              boxShadow: seg.isTarget ? `inset 0 0 15px rgba(${seg.rgb}, 0.3)` : 'none',
            }}
          >
            {seg.pct >= 10 && (
              <span className="text-xs font-bold text-white/80 truncate px-1">
                {Math.round(seg.pct)}%
              </span>
            )}
          </motion.div>
        ))}

        {/* Shimmer */}
        {allCorrect && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['-200% center', '200% center'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        )}
      </div>

      {/* Target markers */}
      <div className="relative w-full h-5 mt-1">
        {/* 50% mark */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ left: '50%' }}>
          <div className="w-px h-2 bg-stardust" />
          <span className="text-[10px] text-dim">50</span>
        </div>
        {/* 80% mark (50+30) */}
        <div className="absolute flex flex-col items-center" style={{ left: '80%' }}>
          <div className="w-px h-2 bg-stardust" />
          <span className="text-[10px] text-dim">80</span>
        </div>
        {/* 100% mark */}
        <div className="absolute right-0 flex flex-col items-center">
          <div className="w-px h-2 bg-stardust" />
          <span className="text-[10px] text-dim">100</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-1">
        {segments.map((seg) => (
          <div key={seg.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: `rgba(${seg.rgb}, 0.7)` }}
            />
            <span className="text-xs text-moonbeam">
              {seg.label}
              {seg.isTarget && <span className="text-nova-green ml-1">✓</span>}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
