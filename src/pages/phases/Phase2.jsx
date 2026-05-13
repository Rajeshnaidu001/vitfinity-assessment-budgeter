import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { BUDGET_JARS, PHASE2_AI } from '../../utils/gameData';
import AIGuide from '../../components/Phase1/AIGuide';
import BudgetJar from '../../components/Phase2/BudgetJar';
import CoinPool from '../../components/Phase2/CoinPool';
import BudgetTracker from '../../components/Phase2/BudgetTracker';

const TOTAL_BUDGET = 110;

/**
 * Phase 2 — Budget Allocation
 *
 * 4 stages:
 *   intro        → wallet display + AI guide
 *   allocation   → 3 jars with +/- controls + coin pool + tracker
 *   celebration  → cinematic completion animation
 *   lessons      → educational cards per jar
 */
export default function Phase2() {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  // ── Stage management ──
  const [stage, setStage] = useState('intro');

  // ── Allocation state ──
  const [allocations, setAllocations] = useState({ needs: 0, wants: 0, savings: 0 });
  const [aiFeedback, setAiFeedback] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(0);

  // ── Celebration state ──
  const [walletDisplay, setWalletDisplay] = useState(TOTAL_BUDGET);

  // Derived values
  const totalAllocated = allocations.needs + allocations.wants + allocations.savings;
  const remaining = TOTAL_BUDGET - totalAllocated;
  const isComplete = BUDGET_JARS.every((jar) => allocations[jar.id] === jar.targetAmount);

  // ── Add coin to jar ──
  const handleAdd = useCallback(
    (jarId) => {
      if (remaining <= 0) return;
      setAllocations((prev) => ({ ...prev, [jarId]: prev[jarId] + 1 }));
    },
    [remaining]
  );

  // ── Remove coin from jar ──
  const handleRemove = useCallback((jarId) => {
    setAllocations((prev) => {
      if (prev[jarId] <= 0) return prev;
      return { ...prev, [jarId]: prev[jarId] - 1 };
    });
  }, []);

  // ── Quick-fill buttons ──
  const handleQuickFill = useCallback(
    (jarId, amount) => {
      setAllocations((prev) => {
        const currentTotal = Object.values(prev).reduce((s, v) => s + v, 0);
        const currentJar = prev[jarId];
        const diff = amount - currentJar;
        const newTotal = currentTotal + diff;
        if (newTotal > TOTAL_BUDGET) return prev; // can't exceed total
        return { ...prev, [jarId]: amount };
      });
    },
    []
  );

  // ── AI Feedback based on allocation state ──
  useEffect(() => {
    if (stage !== 'allocation') return;

    // Check for imbalances
    if (allocations.wants > 40 && allocations.needs < 50) {
      setAiFeedback({ type: 'warning', text: PHASE2_AI.overfillWants });
    } else if (totalAllocated > 60 && allocations.savings < 5) {
      setAiFeedback({ type: 'warning', text: PHASE2_AI.neglectSavings });
    } else if (totalAllocated > 60 && allocations.needs < 20) {
      setAiFeedback({ type: 'warning', text: PHASE2_AI.neglectNeeds });
    } else if (isComplete) {
      setAiFeedback({ type: 'success', text: PHASE2_AI.goodBalance });
    } else if (remaining === 0 && !isComplete) {
      setAiFeedback({ type: 'info', text: PHASE2_AI.nearTarget });
    } else {
      setAiFeedback(null);
    }
  }, [allocations, totalAllocated, remaining, isComplete, stage]);

  // ── Celebration wallet count-down ──
  useEffect(() => {
    if (stage !== 'celebration') return;
    let current = TOTAL_BUDGET;
    const timer = setInterval(() => {
      current -= 3;
      if (current <= 0) {
        current = 0;
        clearInterval(timer);
      }
      setWalletDisplay(current);
    }, 40);
    return () => clearInterval(timer);
  }, [stage]);

  // ── Handle start allocation ──
  const handleStartAllocation = useCallback(() => {
    setStage('allocation');
  }, []);

  // ── Handle confirm budget ──
  const handleConfirm = useCallback(() => {
    if (!isComplete) return;
    setStage('celebration');
  }, [isComplete]);

  // ── Handle finish ──
  const handleFinish = useCallback(() => {
    dispatch({ type: 'ALLOCATE_BUDGET', payload: { needsPct: 50, wantsPct: 30, savingsPct: 20 } });
    dispatch({ type: 'ADD_REWARD', payload: { id: 'r2', title: 'Budget Master', description: 'You stayed within all budget categories!', icon: '🏆', points: 100 } });
    dispatch({ type: 'COMPLETE_PHASE', payload: 2 });
    dispatch({ type: 'ADVANCE_PHASE' });
    navigate('/dashboard');
  }, [dispatch, navigate]);

  // ── Confetti coins ──
  const celebrationCoins = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        emoji: ['💰', '🪙', '✨', '💎', '⭐'][i % 5],
        x: (Math.random() - 0.5) * 500,
        y: -(120 + Math.random() * 300),
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.6,
        scale: 0.5 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════
              STAGE 1: INTRO
             ═══════════════════════════════════ */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-8"
            >
              {/* Wallet */}
              <motion.div
                className="glass-strong rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  💰
                </motion.div>
                <div className="text-xl font-bold text-starlight mb-1">Wallet Balance</div>
                <motion.div
                  className="text-4xl font-black coin-value"
                  style={{
                    background: 'linear-gradient(90deg, #fbbf24, #f97316, #fbbf24)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {TOTAL_BUDGET} Units
                </motion.div>

                {/* Scanning line */}
                <motion.div
                  className="absolute inset-x-0 h-0.5 bg-nova-green/30"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* AI Guide intro */}
              <AIGuide
                messages={PHASE2_AI.intro}
                avatar="🤖"
                speed={25}
                onComplete={handleStartAllocation}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 2: ALLOCATION
             ═══════════════════════════════════ */}
          {stage === 'allocation' && (
            <motion.div
              key="allocation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Budget Tracker */}
              <BudgetTracker allocations={allocations} total={TOTAL_BUDGET} />

              {/* AI Feedback */}
              <AnimatePresence mode="wait">
                {aiFeedback && (
                  <motion.div
                    key={aiFeedback.text}
                    className={`text-center py-2.5 px-5 rounded-xl mx-auto max-w-lg text-sm font-medium ${
                      aiFeedback.type === 'success'
                        ? 'bg-nova-green/15 text-nova-green border border-nova-green/20'
                        : aiFeedback.type === 'warning'
                          ? 'bg-solar-yellow/15 text-solar-yellow border border-solar-yellow/20'
                          : 'bg-plasma-blue/15 text-plasma-blue border border-plasma-blue/20'
                    }`}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {aiFeedback.type === 'warning' && '⚠️ '}
                    {aiFeedback.type === 'success' && '✨ '}
                    {aiFeedback.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The 50-30-20 Rule Label */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-1">
                  <span className="gradient-blue-purple gradient-text">The 50-30-20 Rule</span>
                </h2>
                <p className="text-moonbeam text-sm">
                  Allocate your {TOTAL_BUDGET} coins wisely across the three jars
                </p>
              </motion.div>

              {/* Jars grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {BUDGET_JARS.map((jar, i) => (
                  <motion.div
                    key={jar.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                  >
                    <BudgetJar
                      jar={jar}
                      amount={allocations[jar.id]}
                      total={TOTAL_BUDGET}
                      onAdd={() => handleAdd(jar.id)}
                      onRemove={() => handleRemove(jar.id)}
                      disabled={remaining <= 0 && allocations[jar.id] >= jar.targetAmount}
                    />

                    {/* Quick-fill slider */}
                    <div className="mt-3 px-2">
                      <input
                        type="range"
                        min={0}
                        max={Math.min(
                          TOTAL_BUDGET,
                          allocations[jar.id] + remaining
                        )}
                        value={allocations[jar.id]}
                        onChange={(e) => handleQuickFill(jar.id, Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(90deg, rgba(${jar.rgb}, 0.6) ${(allocations[jar.id] / Math.max(1, allocations[jar.id] + remaining)) * 100}%, rgba(42,48,96,0.6) 0%)`,
                          accentColor: `rgb(${jar.rgb})`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-dim">0</span>
                        <motion.button
                          className={`text-[10px] font-semibold text-${jar.color} cursor-pointer hover:underline`}
                          onClick={() => handleQuickFill(jar.id, jar.targetAmount)}
                          whileTap={{ scale: 0.95 }}
                        >
                          Set to {jar.targetAmount}
                        </motion.button>
                        <span className="text-[10px] text-dim">{allocations[jar.id] + remaining}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Coin Pool */}
              <CoinPool remaining={remaining} total={TOTAL_BUDGET} />

              {/* Confirm button */}
              <motion.div
                className="text-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  className={`px-8 py-3.5 rounded-2xl font-bold text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed`}
                  style={{
                    background: isComplete
                      ? 'linear-gradient(135deg, #34d399, #4f8cff)'
                      : 'linear-gradient(135deg, rgba(100,116,139,0.3), rgba(100,116,139,0.2))',
                    boxShadow: isComplete
                      ? '0 4px 25px rgba(52,211,153,0.4)'
                      : 'none',
                  }}
                  whileHover={isComplete ? { scale: 1.05 } : {}}
                  whileTap={isComplete ? { scale: 0.95 } : {}}
                  animate={isComplete ? { scale: [1, 1.03, 1] } : {}}
                  transition={isComplete ? { duration: 1.5, repeat: Infinity } : {}}
                  onClick={handleConfirm}
                  disabled={!isComplete}
                >
                  {isComplete ? '✨ Lock In Budget!' : remaining > 0 ? `${remaining} coins left to allocate` : 'Adjust to match targets'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 3: CELEBRATION
             ═══════════════════════════════════ */}
          {stage === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-6 relative overflow-hidden"
            >
              {/* Coin burst */}
              {celebrationCoins.map((coin) => (
                <motion.div
                  key={coin.id}
                  className="absolute text-2xl pointer-events-none"
                  style={{ left: '50%', top: '40%', scale: coin.scale }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: coin.x,
                    y: coin.y,
                    opacity: 0,
                    rotate: coin.rotate,
                  }}
                  transition={{
                    duration: 1.8,
                    delay: coin.delay,
                    ease: 'easeOut',
                  }}
                >
                  {coin.emoji}
                </motion.div>
              ))}

              {/* Wallet count-down */}
              <motion.div
                className="glass-strong rounded-3xl p-8 sm:p-10 text-center relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              >
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  🏦
                </motion.div>
                <div className="text-xl font-bold text-starlight mb-2">Budget Locked</div>
                <div className="text-4xl font-black text-dim coin-value mb-3">
                  {walletDisplay} Available
                </div>

                {/* Jar summary */}
                <div className="flex gap-4 justify-center mt-4">
                  {BUDGET_JARS.map((jar) => (
                    <motion.div
                      key={jar.id}
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + BUDGET_JARS.indexOf(jar) * 0.2 }}
                    >
                      <div className="text-2xl mb-1">{jar.emoji}</div>
                      <div className={`text-sm font-bold text-${jar.color}`}>
                        {jar.targetAmount}
                      </div>
                      <div className="text-xs text-dim">{jar.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Congratulations text */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <h2 className="text-3xl sm:text-4xl font-black mb-2">
                  <span className="gradient-blue-purple gradient-text">Budget Complete!</span>
                </h2>
                <p className="text-moonbeam text-lg max-w-md mx-auto mb-1">
                  Every Unit now has a purpose.
                </p>
                <p className="text-dim text-sm max-w-sm mx-auto">
                  You mastered the 50-30-20 rule — needs first, wants balanced, savings protected.
                </p>
              </motion.div>

              {/* Continue button */}
              <motion.button
                className="mt-4 px-8 py-3.5 rounded-2xl font-bold text-white cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
                  boxShadow: '0 4px 20px rgba(79, 140, 255, 0.3)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage('lessons')}
              >
                📚 What Did You Learn?
              </motion.button>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 4: LESSONS
             ═══════════════════════════════════ */}
          {stage === 'lessons' && (
            <motion.div
              key="lessons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-4"
            >
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="gradient-blue-purple gradient-text">
                  Budget Wisdom
                </span>
              </motion.h2>

              {/* Lesson carousel */}
              <div className="w-full max-w-lg">
                <AnimatePresence mode="wait">
                  {BUDGET_JARS[lessonIndex] && (
                    <motion.div
                      key={lessonIndex}
                      className="glass-strong rounded-3xl p-6 sm:p-8"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Jar header */}
                      <div className="flex items-center gap-4 mb-5">
                        <motion.div
                          className="text-5xl"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {BUDGET_JARS[lessonIndex].emoji}
                        </motion.div>
                        <div>
                          <h3 className={`text-xl font-bold text-${BUDGET_JARS[lessonIndex].color}`}>
                            {BUDGET_JARS[lessonIndex].icon} {BUDGET_JARS[lessonIndex].label}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-sm font-bold text-${BUDGET_JARS[lessonIndex].color}`}>
                              {BUDGET_JARS[lessonIndex].targetPct}% — {BUDGET_JARS[lessonIndex].targetAmount} Units
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Purpose */}
                      <div
                        className="rounded-2xl p-4 mb-4"
                        style={{
                          background: `linear-gradient(135deg, rgba(${BUDGET_JARS[lessonIndex].rgb}, 0.08), transparent)`,
                          border: `1px solid rgba(${BUDGET_JARS[lessonIndex].rgb}, 0.15)`,
                        }}
                      >
                        <p className="text-moonbeam text-sm">
                          📋 <strong>Purpose:</strong> {BUDGET_JARS[lessonIndex].purpose}
                        </p>
                      </div>

                      {/* Lesson */}
                      <div
                        className="rounded-2xl p-4"
                        style={{
                          background: 'rgba(79, 140, 255, 0.05)',
                          border: '1px solid rgba(79, 140, 255, 0.1)',
                        }}
                      >
                        <p className="text-starlight text-sm sm:text-base leading-relaxed">
                          💡 {BUDGET_JARS[lessonIndex].lesson}
                        </p>
                      </div>

                      {/* Card counter */}
                      <div className="text-center text-xs text-dim mt-4">
                        {lessonIndex + 1} of {BUDGET_JARS.length}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-5 gap-3">
                  <motion.button
                    className="px-5 py-2.5 rounded-xl glass text-sm font-medium text-moonbeam cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLessonIndex((i) => Math.max(0, i - 1))}
                    disabled={lessonIndex === 0}
                  >
                    ← Previous
                  </motion.button>

                  {/* Dots */}
                  <div className="flex gap-1.5">
                    {BUDGET_JARS.map((_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          i === lessonIndex
                            ? 'w-5 bg-plasma-blue'
                            : 'bg-stardust hover:bg-moonbeam'
                        }`}
                        onClick={() => setLessonIndex(i)}
                      />
                    ))}
                  </div>

                  {lessonIndex < BUDGET_JARS.length - 1 ? (
                    <motion.button
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLessonIndex((i) => i + 1)}
                    >
                      Next →
                    </motion.button>
                  ) : (
                    <motion.button
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #34d399, #4f8cff)',
                        boxShadow: '0 4px 20px rgba(52, 211, 153, 0.3)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFinish}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🚀 Mission Complete!
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
