import { motion } from 'framer-motion';

/**
 * JarDisplay — Compact jar status showing remaining amounts for all 3 budget categories.
 */
export default function JarDisplay({ needs = 0, wants = 0, savings = 0, className = '' }) {
  const jars = [
    { id: 'needs', label: 'Needs', icon: '✅', amount: needs, max: 55, rgb: '52,211,153', color: 'nova-green' },
    { id: 'wants', label: 'Wants', icon: '⭐', amount: wants, max: 33, rgb: '251,191,36', color: 'solar-yellow' },
    { id: 'savings', label: 'Savings', icon: '💎', amount: savings, max: 22, rgb: '79,140,255', color: 'plasma-blue' },
  ];

  return (
    <motion.div
      className={`glass rounded-2xl p-4 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-xs font-semibold text-moonbeam mb-3 text-center">Budget Jars</div>
      <div className="flex gap-3 sm:gap-4 justify-center">
        {jars.map((jar) => {
          const pct = jar.max > 0 ? (jar.amount / jar.max) * 100 : 0;
          const isEmpty = jar.amount <= 0;

          return (
            <motion.div
              key={jar.id}
              className="flex flex-col items-center gap-1.5"
              layout
            >
              {/* Mini jar */}
              <div
                className="relative w-12 h-16 sm:w-14 sm:h-20 rounded-xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(${jar.rgb}, 0.08), rgba(${jar.rgb}, 0.03))`,
                  border: `1.5px solid rgba(${jar.rgb}, ${isEmpty ? 0.15 : 0.35})`,
                }}
              >
                {/* Fill */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 rounded-b-lg"
                  animate={{ height: `${pct}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    background: `linear-gradient(180deg, rgba(${jar.rgb}, 0.5), rgba(${jar.rgb}, 0.2))`,
                  }}
                />
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-base">
                  {jar.icon}
                </div>
              </div>

              {/* Amount */}
              <motion.div
                className="text-center"
                key={jar.amount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className={`text-sm font-bold text-${jar.color} coin-value`}>
                  {jar.amount}
                </div>
                <div className="text-[10px] text-dim">{jar.label}</div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Total */}
      <div className="text-center mt-2 pt-2 border-t border-stardust/15">
        <span className="text-xs text-dim">Total: </span>
        <span className="text-xs font-bold text-starlight coin-value">
          {needs + wants + savings} Units
        </span>
      </div>
    </motion.div>
  );
}
