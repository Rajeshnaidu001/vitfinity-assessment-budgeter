import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { PHASES } from '../utils/gameData';
import GlassCard from '../components/UI/GlassCard';
import CoinDisplay from '../components/UI/CoinDisplay';
import ProgressBar from '../components/UI/ProgressBar';
import FloatingButton from '../components/UI/FloatingButton';

/**
 * Dashboard — the central hub between phases
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { player, budget, progress } = state;

  const remaining =
    budget.needs - budget.needsSpent +
    (budget.wants - budget.wantsSpent) +
    (budget.savings - budget.savingsUsed);

  const overallProgress = (progress.phasesCompleted.length / PHASES.length) * 100;

  const isPhaseAccessible = (phaseId) => {
    if (phaseId === 1) return true;
    return progress.phasesCompleted.includes(phaseId - 1);
  };

  const getPhaseStatus = (phaseId) => {
    if (progress.phasesCompleted.includes(phaseId)) return 'completed';
    if (progress.currentPhase === phaseId) return 'current';
    if (isPhaseAccessible(phaseId)) return 'accessible';
    return 'locked';
  };

  return (
    <div className="min-h-screen py-10 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* ─── Header ─── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            <span className="gradient-blue-purple gradient-text">Mission Control</span>
          </h1>
          <p className="text-moonbeam text-lg">
            Welcome back, <span className="text-starlight font-semibold">{player.name}</span>! 
            Choose your next mission.
          </p>
        </motion.div>

        {/* ─── Stats Overview ─── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="!p-5 flex flex-col items-center justify-center text-center min-h-[120px]" delay={0.1} hover={false}>
            <CoinDisplay amount={player.pocketMoney} label="Total Budget" size="sm" />
          </GlassCard>
          <GlassCard className="!p-5 flex flex-col items-center justify-center text-center min-h-[120px]" delay={0.2} hover={false}>
            <div className="text-2xl mb-1">
              {progress.happiness >= 70 ? '😊' : progress.happiness >= 40 ? '😐' : '😟'}
            </div>
            <div className="text-lg font-bold text-starlight">{progress.happiness}%</div>
            <div className="text-xs text-moonbeam mt-0.5">Happiness</div>
          </GlassCard>
          <GlassCard className="!p-5 flex flex-col items-center justify-center text-center min-h-[120px]" delay={0.3} hover={false}>
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-lg font-bold text-plasma-blue">{progress.score}</div>
            <div className="text-xs text-moonbeam mt-0.5">Score</div>
          </GlassCard>
          <GlassCard className="!p-5 flex flex-col items-center justify-center text-center min-h-[120px]" delay={0.4} hover={false}>
            <div className="text-2xl mb-1">🎖️</div>
            <div className="text-lg font-bold text-nova-green">
              {progress.phasesCompleted.length}/{PHASES.length}
            </div>
            <div className="text-xs text-moonbeam mt-0.5">Missions Done</div>
          </GlassCard>
        </motion.div>

        {/* ─── Overall Progress ─── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ProgressBar
            value={progress.phasesCompleted.length}
            max={PHASES.length}
            label="Overall Progress"
            variant="purple"
            size="lg"
          />
        </motion.div>

        {/* ─── Phase Cards ─── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((phase, i) => {
            const status = getPhaseStatus(phase.id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';

            return (
              <GlassCard
                key={phase.id}
                delay={0.1 * i + 0.3}
                glow={isCurrent}
                glowColor="blue"
                className={`relative overflow-hidden flex flex-col min-h-[200px] ${
                  isLocked ? 'opacity-50' : ''
                } ${isCurrent ? '!border-plasma-blue/30' : ''}`}
                onClick={
                  !isLocked
                    ? () => {
                        dispatch({ type: 'SET_PHASE', payload: phase.id });
                        navigate(`/phase/${phase.id}`);
                      }
                    : undefined
                }
                hover={!isLocked}
              >
                {/* Status badge — absolute top-right */}
                <div className="absolute top-3 right-3">
                  {isCompleted && (
                    <motion.div
                      className="bg-nova-green/20 text-nova-green text-xs px-2.5 py-1 rounded-full font-semibold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓ Done
                    </motion.div>
                  )}
                  {isCurrent && (
                    <motion.div
                      className="bg-plasma-blue/20 text-plasma-blue text-xs px-2.5 py-1 rounded-full font-semibold"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ● Active
                    </motion.div>
                  )}
                  {isLocked && (
                    <div className="text-dim text-lg">🔒</div>
                  )}
                </div>

                {/* Card body — flex-grow pushes action hint to bottom */}
                <div className="flex-1">
                  {/* Phase icon */}
                  <motion.div
                    className="text-4xl mb-3"
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {phase.icon}
                  </motion.div>

                  {/* Phase info */}
                  <div className="text-xs text-moonbeam font-medium mb-1 uppercase tracking-wider">
                    Phase {phase.id}
                  </div>
                  <h3 className="text-lg font-bold text-starlight mb-1.5">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-moonbeam leading-relaxed">
                    {phase.description}
                  </p>
                </div>

                {/* Action hint — always at the bottom */}
                {!isLocked && !isCompleted && (
                  <motion.div
                    className="mt-4 flex items-center gap-1 text-plasma-blue text-sm font-medium"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {isCurrent ? 'Continue →' : 'Start →'}
                  </motion.div>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* ─── Reset button ─── */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <FloatingButton
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all progress?')) {
                dispatch({ type: 'RESET_GAME' });
                navigate('/');
              }
            }}
          >
            🔄 Reset Game
          </FloatingButton>
        </motion.div>
      </div>
    </div>
  );
}
