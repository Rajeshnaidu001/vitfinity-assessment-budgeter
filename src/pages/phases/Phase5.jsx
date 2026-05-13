import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import {
  PHASE5_PERSONALITIES,
  PHASE5_GOALS,
  PHASE5_AI,
} from '../../utils/gameData';
import AIGuide from '../../components/Phase1/AIGuide';
import BudgetChart from '../../components/Phase5/BudgetChart';
import MemoryTimeline from '../../components/Phase5/MemoryTimeline';
import PersonalityCard from '../../components/Phase5/PersonalityCard';
import GoalProgress from '../../components/Phase5/GoalProgress';

/**
 * Phase 5 — The Financial Review
 *
 * Stages:
 *   intro        → AI guide + status overview
 *   charts       → plan vs actual comparison charts
 *   personality  → financial personality reveal
 *   timeline     → month memory timeline
 *   goals        → future savings goals
 *   celebration  → final achievement + replay option
 */
export default function Phase5() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  const [stage, setStage] = useState('intro');

  // ── Derive player stats from global state ──
  const stats = useMemo(() => {
    const b = state.budget || {};
    const p = state.progress || {};
    const h = state.history || {};

    const needsSpent = b.needsSpent || 0;
    const wantsSpent = b.wantsSpent || 0;
    const savingsUsed = b.savingsUsed || 0;

    const needsRemaining = Math.max(0, (b.needs || 55) - needsSpent);
    const wantsRemaining = Math.max(0, (b.wants || 33) - wantsSpent);
    const savingsRemaining = Math.max(0, (b.savings || 22) - savingsUsed);

    const totalSpent = needsSpent + wantsSpent + savingsUsed;
    const totalRemaining = needsRemaining + wantsRemaining + savingsRemaining;
    const happiness = p.happiness || 65;
    const score = p.score || 0;

    // Badges / rewards
    const rewards = h.rewards || [];
    const badgeCount = rewards.length;
    const decisions = h.decisions || [];
    const emergencies = h.emergencies || [];

    return {
      needsSpent,
      wantsSpent,
      savingsUsed,
      needsRemaining,
      wantsRemaining,
      savingsRemaining,
      totalSpent,
      totalRemaining,
      happiness,
      score,
      rewards,
      badgeCount,
      decisions,
      emergencies,
    };
  }, [state]);

  // ── Determine personality ──
  const personality = useMemo(() => {
    return PHASE5_PERSONALITIES.find((p) => p.condition(stats)) || PHASE5_PERSONALITIES[PHASE5_PERSONALITIES.length - 1];
  }, [stats]);

  // ── Build chart data ──
  const planData = useMemo(() => [
    { label: 'Needs', value: 55, icon: '✅', rgb: '52,211,153' },
    { label: 'Wants', value: 33, icon: '⭐', rgb: '251,191,36' },
    { label: 'Savings', value: 22, icon: '💎', rgb: '79,140,255' },
  ], []);

  const actualData = useMemo(() => [
    { label: 'Needs Spent', value: stats.needsSpent, icon: '✅', rgb: '52,211,153' },
    { label: 'Wants Spent', value: stats.wantsSpent, icon: '⭐', rgb: '251,191,36' },
    { label: 'Savings Used', value: stats.savingsUsed, icon: '💎', rgb: '79,140,255' },
  ], [stats]);

  // ── Build timeline events from decisions + emergencies ──
  const timelineEvents = useMemo(() => {
    const events = [];

    // Mandatory bills
    const needsDecisions = stats.decisions.filter((d) => d.category === 'needs' && d.purchased);
    needsDecisions.forEach((d) => {
      events.push({
        icon: d.icon || '📋',
        title: d.name || 'Bill Paid',
        detail: 'Mandatory',
        cost: d.cost || d.amount,
        rgb: '52,211,153',
      });
    });

    // Wants decisions
    const wantsDecisions = stats.decisions.filter((d) => d.category === 'wants');
    wantsDecisions.forEach((d) => {
      events.push({
        icon: d.icon || '🛒',
        title: d.name || 'Purchase',
        detail: d.purchased ? 'Bought' : 'Skipped',
        cost: d.purchased ? (d.cost || d.amount) : undefined,
        rgb: d.purchased ? '251,191,36' : '100,116,139',
      });
    });

    // Emergencies
    stats.emergencies.forEach((e) => {
      events.push({
        icon: '🎒',
        title: e.title || 'Emergency',
        detail: 'Crisis Handled',
        cost: e.cost,
        rgb: '248,113,113',
      });
    });

    // Badges
    stats.rewards.forEach((r) => {
      events.push({
        icon: r.icon || '🏅',
        title: r.title || 'Badge Earned',
        detail: `+${r.points || 0}pts`,
        rgb: '168,85,247',
      });
    });

    return events.length > 0 ? events : [
      { icon: '📋', title: 'Bills Paid', detail: 'Needs covered', cost: 55, rgb: '52,211,153' },
      { icon: '🎮', title: 'Fun Spending', detail: 'Wants used', cost: stats.wantsSpent, rgb: '251,191,36' },
      { icon: '💎', title: 'Savings', detail: `${stats.savingsRemaining} remaining`, rgb: '79,140,255' },
    ];
  }, [stats]);

  // ── AI feedback message ──
  const aiFeedback = useMemo(() => {
    if (stats.savingsRemaining >= 18 && stats.wantsSpent <= 20) return PHASE5_AI.wellManaged;
    if (stats.badgeCount >= 2) return PHASE5_AI.smartChoices;
    return PHASE5_AI.overspent;
  }, [stats]);

  // ── Celebration particles ──
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        emoji: ['🏆', '✨', '🪙', '⭐', '💎', '🎉', '🛡️'][i % 7],
        x: (Math.random() - 0.5) * 600,
        y: -(100 + Math.random() * 350),
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.8,
        scale: 0.5 + Math.random() * 0.7,
      })),
    []
  );

  // ── Handle replay ──
  const handleReplay = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
  }, [dispatch, navigate]);

  // ── Handle completion ──
  const handleComplete = useCallback(() => {
    dispatch({
      type: 'ADD_REWARD',
      payload: { id: 'r_financial_explorer', title: 'Financial Explorer', description: 'Completed the full financial simulation!', icon: '🏆', points: 150 },
    });
    dispatch({ type: 'COMPLETE_PHASE', payload: 5 });
    setStage('celebration');
  }, [dispatch]);

  // Micro-lesson
  const microLesson = useMemo(
    () => PHASE5_AI.microLessons[Math.floor(Math.random() * PHASE5_AI.microLessons.length)],
    [stage]
  );

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
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
              className="flex flex-col items-center justify-center min-h-[70vh] gap-6"
            >
              {/* Final status */}
              <motion.div
                className="glass-strong rounded-3xl p-6 sm:p-8 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="text-5xl sm:text-6xl mb-3"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🔬
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-starlight mb-4">
                  Financial Lab — Month Report
                </h2>

                {/* Quick stats */}
                <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
                  {[
                    { label: 'Wants Left', value: stats.wantsRemaining, icon: '⭐', color: 'solar-yellow' },
                    { label: 'Savings Left', value: stats.savingsRemaining, icon: '💎', color: 'plasma-blue' },
                    { label: 'Happiness', value: `${stats.happiness}%`, icon: stats.happiness >= 60 ? '😊' : '😐', color: 'nova-green' },
                    { label: 'Score', value: stats.score, icon: '🏆', color: 'plasma-purple' },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className={`text-lg font-bold text-${s.color} coin-value`}>{s.value}</div>
                      <div className="text-[10px] text-dim">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* AI Guide */}
              <AIGuide
                messages={PHASE5_AI.intro}
                avatar="🤖"
                speed={25}
                onComplete={() => setStage('charts')}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 2: CHARTS
             ═══════════════════════════════════ */}
          {stage === 'charts' && (
            <motion.div
              key="charts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              <motion.h2
                className="text-xl sm:text-2xl font-bold text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="gradient-blue-purple gradient-text">Budget Plan vs Reality</span>
              </motion.h2>

              {/* AI feedback */}
              <motion.div
                className="text-center py-2.5 px-5 rounded-xl mx-auto max-w-lg text-sm font-medium bg-plasma-blue/15 text-plasma-blue border border-plasma-blue/20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                🤖 {aiFeedback}
              </motion.div>

              {/* Chart */}
              <BudgetChart
                title="Your Starting Plan vs What Actually Happened"
                planData={planData}
                actualData={actualData}
              />

              {/* Remaining summary */}
              <motion.div
                className="glass rounded-2xl p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-center gap-6">
                  {[
                    { label: 'Needs Remaining', value: stats.needsRemaining, rgb: '52,211,153' },
                    { label: 'Wants Remaining', value: stats.wantsRemaining, rgb: '251,191,36' },
                    { label: 'Savings Remaining', value: stats.savingsRemaining, rgb: '79,140,255' },
                  ].map((r) => (
                    <div key={r.label} className="text-center">
                      <div className="text-lg font-bold coin-value" style={{ color: `rgb(${r.rgb})` }}>
                        {r.value}
                      </div>
                      <div className="text-[10px] text-dim">{r.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Micro-lesson */}
              <motion.div
                className="glass rounded-xl px-4 py-2.5 text-center max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-xs text-dim italic">💡 {microLesson}</p>
              </motion.div>

              <motion.div
                className="text-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.button
                  className="px-8 py-3.5 rounded-2xl font-bold text-white cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
                    boxShadow: '0 4px 15px rgba(79,140,255,0.3)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStage('personality')}
                >
                  🧠 Discover Your Financial Personality
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 3: PERSONALITY
             ═══════════════════════════════════ */}
          {stage === 'personality' && (
            <motion.div
              key="personality"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 min-h-[60vh] justify-center"
            >
              <PersonalityCard personality={personality} className="max-w-md w-full" />

              {/* Badges earned */}
              {stats.rewards.length > 0 && (
                <motion.div
                  className="glass-strong rounded-2xl p-5 max-w-md w-full"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h4 className="text-sm font-bold text-starlight text-center mb-3">🏅 Badges Earned</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {stats.rewards.map((r, i) => (
                      <motion.div
                        key={i}
                        className="glass rounded-lg px-3 py-2 flex items-center gap-1.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, delay: 0.7 + i * 0.1 }}
                      >
                        <span className="text-base">{r.icon}</span>
                        <span className="text-xs font-medium text-starlight">{r.title}</span>
                        <span className="text-[10px] text-plasma-blue">+{r.points || 0}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.button
                className="px-8 py-3 rounded-2xl font-bold text-white cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
                  boxShadow: '0 4px 15px rgba(79,140,255,0.3)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStage('timeline')}
              >
                📅 View Your Month Timeline
              </motion.button>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 4: TIMELINE
             ═══════════════════════════════════ */}
          {stage === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              <motion.h2
                className="text-xl sm:text-2xl font-bold text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="gradient-blue-purple gradient-text">Your Month in Review</span>
              </motion.h2>

              <MemoryTimeline events={timelineEvents} />

              {/* Happiness vs Money insight */}
              <motion.div
                className="glass-strong rounded-3xl p-5 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-bold text-starlight mb-4 text-center">
                  😊 Happiness vs 💰 Money
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Happiness bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-moonbeam">Happiness</span>
                      <span className="text-xs font-bold text-nova-green">{stats.happiness}%</span>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(42,48,96,0.5)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.happiness}%` }}
                        transition={{ duration: 1 }}
                        style={{
                          background: 'linear-gradient(90deg, rgba(52,211,153,0.7), rgba(52,211,153,0.4))',
                        }}
                      />
                    </div>
                  </div>

                  {/* Money remaining bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-moonbeam">Money Left</span>
                      <span className="text-xs font-bold text-plasma-blue">{stats.totalRemaining}/110</span>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(42,48,96,0.5)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.totalRemaining / 110) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{
                          background: 'linear-gradient(90deg, rgba(79,140,255,0.7), rgba(79,140,255,0.4))',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-dim text-center mt-3 italic">
                  Balanced spending preserves both happiness and security.
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  className="px-8 py-3 rounded-2xl font-bold text-white cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
                    boxShadow: '0 4px 15px rgba(79,140,255,0.3)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStage('goals')}
                >
                  🎯 See Your Future Goals
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 5: GOALS
             ═══════════════════════════════════ */}
          {stage === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              <motion.h2
                className="text-xl sm:text-2xl font-bold text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="gradient-blue-purple gradient-text">Future Goals</span>
              </motion.h2>

              <GoalProgress
                goals={PHASE5_GOALS}
                savingsRemaining={stats.savingsRemaining}
              />

              <motion.div
                className="text-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  className="px-8 py-3.5 rounded-2xl font-bold text-white cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #34d399, #4f8cff)',
                    boxShadow: '0 4px 25px rgba(52,211,153,0.4)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ scale: { duration: 1.5, repeat: Infinity } }}
                  onClick={handleComplete}
                >
                  🏆 Complete Financial Review!
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 6: CELEBRATION
             ═══════════════════════════════════ */}
          {stage === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-6 relative overflow-hidden"
            >
              {/* Particle burst */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute pointer-events-none"
                  style={{ left: '50%', top: '35%', fontSize: 18 * p.scale }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
                  transition={{ duration: 2, delay: p.delay, ease: 'easeOut' }}
                >
                  {p.emoji}
                </motion.div>
              ))}

              {/* Achievement card */}
              <motion.div
                className="glass-strong rounded-3xl p-8 sm:p-10 text-center max-w-lg w-full relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              >
                <motion.div
                  className="text-6xl sm:text-7xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  🏆
                </motion.div>

                <motion.h2
                  className="text-3xl sm:text-4xl font-black mb-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="gradient-blue-purple gradient-text">Financial Explorer</span>
                </motion.h2>

                <motion.p
                  className="text-moonbeam text-base mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  You completed your first financial month simulation!
                </motion.p>

                <motion.p
                  className="text-dim text-sm mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Every month teaches something new. Keep exploring!
                </motion.p>

                {/* Final score */}
                <motion.div
                  className="glass rounded-2xl px-5 py-3 inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <span className="text-sm text-dim">Total Score: </span>
                  <span className="text-xl font-black coin-value" style={{
                    background: 'linear-gradient(90deg, #fbbf24, #f97316)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}>
                    {stats.score + 150}
                  </span>
                </motion.div>

                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ border: '2px solid rgba(52,211,153,0.15)' }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(52,211,153,0)',
                      '0 0 30px 5px rgba(52,211,153,0.15)',
                      '0 0 0 0 rgba(52,211,153,0)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <motion.button
                  className="px-6 py-3 rounded-xl font-bold text-white cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
                    boxShadow: '0 4px 15px rgba(79,140,255,0.3)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                >
                  📊 View Dashboard
                </motion.button>

                <motion.button
                  className="px-6 py-3 rounded-xl font-bold text-starlight cursor-pointer glass"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReplay}
                >
                  🔄 Try Another Month
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
