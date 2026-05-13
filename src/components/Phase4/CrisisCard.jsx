import { motion } from 'framer-motion';

/**
 * CrisisCard — Resolution option card for the emergency.
 * Shows cost, source, happiness impact, and optional badge.
 */
export default function CrisisCard({
  option,
  onSelect,
  isSelected = false,
  disabled = false,
  className = '',
}) {
  const useSavings = option.source === 'savings';
  const totalCost = option.totalCost || option.cost;

  return (
    <motion.button
      className={`w-full text-left rounded-2xl p-5 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      style={{
        background: isSelected
          ? useSavings
            ? 'linear-gradient(135deg, rgba(79,140,255,0.15), rgba(79,140,255,0.05))'
            : 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))'
          : 'rgba(42, 48, 96, 0.4)',
        border: isSelected
          ? `2px solid ${useSavings ? 'rgba(79,140,255,0.4)' : 'rgba(52,211,153,0.4)'}`
          : '2px solid rgba(79,140,255,0.08)',
        boxShadow: isSelected
          ? `0 0 20px ${useSavings ? 'rgba(79,140,255,0.15)' : 'rgba(52,211,153,0.15)'}`
          : 'none',
      }}
      whileHover={!disabled && !isSelected ? { scale: 1.02, borderColor: 'rgba(79,140,255,0.2)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onSelect?.(option)}
      disabled={disabled}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <motion.span
          className="text-3xl"
          animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {option.icon}
        </motion.span>
        <div className="flex-1">
          <div className="text-base font-bold text-starlight">{option.label}</div>
          <div className={`text-xs ${useSavings ? 'text-plasma-blue' : 'text-nova-green'}`}>
            {option.sublabel}
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <div className="glass rounded-lg px-3 py-1.5">
          <span className="text-xs text-dim">Cost: </span>
          <span className="text-sm font-bold text-comet-red coin-value">−{option.cost}</span>
        </div>

        {option.accessCost && (
          <div className="glass rounded-lg px-3 py-1.5">
            <span className="text-xs text-dim">Access Fee: </span>
            <span className="text-sm font-bold text-solar-yellow coin-value">−{option.accessCost}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-dim">Happiness:</span>
          <span className={`text-xs font-medium ${option.happinessChange >= 0 ? 'text-nova-green' : 'text-comet-red'}`}>
            {option.happinessChange > 0 ? '+' : ''}{option.happinessChange} 😊
          </span>
        </div>
      </div>

      {/* Total for savings options */}
      {option.totalCost && (
        <div className="text-xs text-moonbeam mb-2">
          Total from savings: <span className="font-bold coin-value text-plasma-blue">{totalCost} Units</span>
        </div>
      )}

      {/* Badge */}
      {option.badge && (
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-sm">{option.badge.icon}</span>
          <span className="text-xs text-plasma-blue font-medium">
            Earns: {option.badge.title} +{option.badge.points}pts
          </span>
        </div>
      )}

      {/* Selected state */}
      {isSelected && (
        <motion.div
          className="mt-3 pt-3 border-t border-stardust/15"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <p className="text-sm text-moonbeam">{option.feedback}</p>
          <p className="text-xs text-dim italic mt-2">💡 {option.lesson}</p>
        </motion.div>
      )}
    </motion.button>
  );
}
