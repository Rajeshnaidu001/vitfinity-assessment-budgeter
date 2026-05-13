import { motion, AnimatePresence } from 'framer-motion';

/**
 * EventCard — A spending event with optional choices.
 * Handles mandatory expenses (auto-pay) and choice events (multi-option).
 */
export default function EventCard({
  event,
  onPay,
  onChoose,
  selectedChoice = null,
  disabled = false,
  className = '',
}) {
  const isMandatory = event.type === 'mandatory';
  const isChoice = event.type === 'choice';
  const hasChosen = selectedChoice !== null;

  return (
    <motion.div
      className={`glass-strong rounded-3xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    >
      {/* Header bar */}
      <div
        className={`px-5 py-3 flex items-center gap-3 ${
          isMandatory
            ? 'bg-comet-red/10 border-b border-comet-red/15'
            : 'bg-plasma-blue/10 border-b border-plasma-blue/15'
        }`}
      >
        <span className="text-2xl">{event.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-starlight">{event.title}</div>
          <div className="text-xs text-moonbeam">
            {isMandatory ? '⚠️ Mandatory Expense' : '🤔 Your Choice'}
          </div>
        </div>
        {isMandatory && (
          <div className="text-sm font-bold text-comet-red coin-value">
            −{event.cost} Units
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-moonbeam text-sm leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Mandatory: Pay button */}
        {isMandatory && !hasChosen && (
          <motion.button
            className="w-full py-3 rounded-xl font-bold text-white cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #f87171, #ef4444)',
              boxShadow: '0 4px 15px rgba(248,113,113,0.3)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPay?.(event)}
            disabled={disabled}
          >
            💳 Pay {event.cost} Units from {event.category === 'needs' ? 'Needs' : 'Wants'}
          </motion.button>
        )}

        {/* Mandatory: Paid receipt */}
        {isMandatory && hasChosen && (
          <motion.div
            className="bg-nova-green/10 rounded-xl p-3 text-center border border-nova-green/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-nova-green text-sm font-semibold">✅ Paid — Receipt confirmed</span>
          </motion.div>
        )}

        {/* Choice: Options */}
        {isChoice && !hasChosen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {event.choices.map((choice) => (
              <motion.button
                key={choice.id}
                className="text-left p-3.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: 'rgba(42, 48, 96, 0.4)',
                  border: '1px solid rgba(79, 140, 255, 0.12)',
                }}
                whileHover={{
                  scale: 1.02,
                  borderColor: 'rgba(79, 140, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(79, 140, 255, 0.1)',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoose?.(event, choice)}
                disabled={disabled}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{choice.icon}</span>
                  <span className="text-sm font-semibold text-starlight">{choice.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  {choice.cost > 0 ? (
                    <span className="text-xs text-comet-red font-medium coin-value">
                      −{choice.cost} Units
                    </span>
                  ) : (
                    <span className="text-xs text-nova-green font-medium">FREE</span>
                  )}
                  <span className={`text-xs ${choice.happiness >= 0 ? 'text-solar-yellow' : 'text-dim'}`}>
                    {choice.happiness > 0 ? `+${choice.happiness}` : choice.happiness} 😊
                  </span>
                </div>
                {choice.badge && (
                  <div className="mt-1.5 text-xs text-plasma-blue">
                    🏅 Earns: {choice.badge.title}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}

        {/* Choice: Selected feedback */}
        {isChoice && hasChosen && (
          <motion.div
            className="rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: selectedChoice.cost > 0
                ? 'rgba(251, 191, 36, 0.08)'
                : 'rgba(52, 211, 153, 0.08)',
              border: `1px solid ${selectedChoice.cost > 0 ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)'}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{selectedChoice.icon}</span>
              <span className="text-sm font-bold text-starlight">
                {selectedChoice.label}
              </span>
              {selectedChoice.cost > 0 && (
                <span className="text-xs text-comet-red font-medium coin-value ml-auto">
                  −{selectedChoice.cost} Units
                </span>
              )}
            </div>
            <p className="text-sm text-moonbeam">{selectedChoice.feedback}</p>
            {selectedChoice.badge && (
              <motion.div
                className="mt-2 inline-flex items-center gap-1.5 bg-plasma-blue/10 px-3 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
              >
                <span>{selectedChoice.badge.icon}</span>
                <span className="text-xs font-semibold text-plasma-blue">
                  {selectedChoice.badge.title} +{selectedChoice.badge.points}pts
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Lesson tip */}
        {hasChosen && event.lesson && (
          <motion.div
            className="mt-3 text-xs text-dim italic flex items-start gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>💡</span>
            <span>{event.lesson}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
