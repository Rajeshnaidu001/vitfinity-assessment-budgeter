import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { PHASES } from '../../utils/gameData';
import { useNavigate } from 'react-router-dom';

/**
 * Persistent heads-up display bar showing player stats
 */
export default function TopBar() {
  const { state } = useGame();
  const { player, budget, progress } = state;
  const navigate = useNavigate();

  const remaining =
    budget.needs - budget.needsSpent +
    (budget.wants - budget.wantsSpent) +
    (budget.savings - budget.savingsUsed);

  const currentPhase = PHASES.find((p) => p.id === progress.currentPhase);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Player info */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-9 h-9 rounded-full gradient-blue-purple flex items-center justify-center text-lg">
            {player.avatar || '🚀'}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-starlight leading-tight">
              {player.name || 'Explorer'}
            </div>
            <div className="text-xs text-moonbeam leading-tight">
              Age {player.age} · Level {progress.phasesCompleted.length + 1}
            </div>
          </div>
        </motion.div>

        {/* Center: Current phase */}
        {currentPhase && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-lg">{currentPhase.icon}</span>
            <span className="text-sm font-medium text-moonbeam">{currentPhase.title}</span>
          </div>
        )}

        {/* Right: Stats */}
        <div className="flex items-center gap-4">
          {/* Money */}
          <div className="flex items-center gap-1.5">
            <span className="text-base">💰</span>
            <span className="coin-value text-solar-yellow font-bold text-sm">
              {remaining}
            </span>
          </div>

          {/* Happiness */}
          <div className="flex items-center gap-1.5">
            <span className="text-base">
              {progress.happiness >= 70 ? '😊' : progress.happiness >= 40 ? '😐' : '😟'}
            </span>
            <div className="w-16 h-2 rounded-full overflow-hidden bg-stardust/50 hidden sm:block">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    progress.happiness >= 70
                      ? 'linear-gradient(90deg, #34d399, #6ee7b7)'
                      : progress.happiness >= 40
                        ? 'linear-gradient(90deg, #fbbf24, #fcd34d)'
                        : 'linear-gradient(90deg, #f87171, #fca5a5)',
                }}
                animate={{ width: `${progress.happiness}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5">
            <span className="text-base">⭐</span>
            <span className="coin-value text-plasma-blue font-bold text-sm">
              {progress.score}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
