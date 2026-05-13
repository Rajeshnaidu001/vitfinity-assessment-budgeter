import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { PHASE3_WEEKS, PHASE3_AI } from '../../utils/gameData';
import AIGuide from '../../components/Phase1/AIGuide';
import WeekTimeline from '../../components/Phase3/WeekTimeline';
import JarDisplay from '../../components/Phase3/JarDisplay';
import EventCard from '../../components/Phase3/EventCard';
import HappinessMeter from '../../components/Phase3/HappinessMeter';

/**
 * Phase 3 — The Expense Run
 *
 * Stages:
 *   intro     → wallet + AI guide
 *   week      → week-by-week events (1–4)
 *   summary   → month-end review
 *   complete  → transition to Phase 4
 */
export default function Phase3() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  // ── Stage ──
  const [stage, setStage] = useState('intro');

  // ── Week / event tracking ──
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [decisions, setDecisions] = useState({}); // { eventId: choiceObject | 'paid' }
  const [showWeekIntro, setShowWeekIntro] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // ── Budget state (local to this phase simulation) ──
  const [jars, setJars] = useState({
    needs: state.budget?.needs || 55,
    wants: state.budget?.wants || 33,
    savings: state.budget?.savings || 22,
  });
  const [happiness, setHappiness] = useState(state.progress?.happiness || 70);

  // Current week data
  const weekData = PHASE3_WEEKS[currentWeek - 1];
  const currentEvent = weekData?.events?.[currentEventIndex] || null;
  const isWeekDone = weekData ? currentEventIndex >= weekData.events.length : false;

  // All weeks done?
  const isMonthDone = currentWeek > 4;

  // ── Handle mandatory payment ──
  const handlePay = useCallback((event) => {
    setJars((prev) => ({
      ...prev,
      [event.category]: Math.max(0, prev[event.category] - event.cost),
    }));
    setDecisions((prev) => ({ ...prev, [event.id]: 'paid' }));

    // Dispatch to global state
    dispatch({
      type: 'SPEND',
      payload: {
        category: event.category,
        amount: event.cost,
        item: { id: event.id, name: event.title, icon: event.icon, cost: event.cost },
      },
    });

    setFeedback({ type: 'info', text: `${event.icon} ${event.title} paid — ${event.cost} Units` });

    // Auto-advance after a moment
    setTimeout(() => {
      setFeedback(null);
      setCurrentEventIndex((i) => i + 1);
    }, 1500);
  }, [dispatch]);

  // ── Handle choice selection ──
  const handleChoose = useCallback((event, choice) => {
    // Deduct cost
    if (choice.cost > 0) {
      setJars((prev) => ({
        ...prev,
        [event.category]: Math.max(0, prev[event.category] - choice.cost),
      }));
      dispatch({
        type: 'SPEND',
        payload: {
          category: event.category,
          amount: choice.cost,
          item: { id: event.id, name: event.title, icon: event.icon, cost: choice.cost },
        },
      });
    } else {
      dispatch({
        type: 'SKIP_ITEM',
        payload: {
          item: { id: event.id, name: event.title, icon: event.icon, cost: 0 },
          category: event.category,
        },
      });
    }

    // Update happiness
    setHappiness((h) => Math.max(0, Math.min(100, h + choice.happiness)));
    dispatch({ type: 'UPDATE_HAPPINESS', payload: Math.max(0, Math.min(100, happiness + choice.happiness)) });

    // Award badge
    if (choice.badge) {
      dispatch({ type: 'ADD_REWARD', payload: choice.badge });
    }

    setDecisions((prev) => ({ ...prev, [event.id]: choice }));
    setFeedback({ type: choice.cost > 0 ? 'warning' : 'success', text: choice.feedback });
  }, [dispatch, happiness]);

  // ── Advance to next event ──
  const handleNextEvent = useCallback(() => {
    setFeedback(null);
    setCurrentEventIndex((i) => i + 1);
  }, []);

  // ── Advance to next week ──
  const handleNextWeek = useCallback(() => {
    const nextWeek = currentWeek + 1;
    if (nextWeek > 4) {
      setStage('summary');
      return;
    }
    setCurrentWeek(nextWeek);
    setCurrentEventIndex(0);
    setShowWeekIntro(true);
    setFeedback(null);
  }, [currentWeek]);

  // ── Start sorting through a week ──
  const handleStartWeek = useCallback(() => {
    setShowWeekIntro(false);
    // If week has no events (week 4), go straight to week end
    if (weekData?.events?.length === 0) {
      setTimeout(() => {
        setStage('summary');
      }, 2000);
    }
  }, [weekData]);

  // ── Finish phase ──
  const handleFinish = useCallback(() => {
    dispatch({ type: 'COMPLETE_PHASE', payload: 3 });
    dispatch({ type: 'ADVANCE_PHASE' });
    dispatch({
      type: 'ADD_REWARD',
      payload: { id: 'r_expense_run', title: 'Month Survivor', description: 'You survived a full month of spending!', icon: '🛡️', points: 60 },
    });
    navigate('/dashboard');
  }, [dispatch, navigate]);

  // Random micro-lesson
  const microLesson = useMemo(
    () => PHASE3_AI.microLessons[Math.floor(Math.random() * PHASE3_AI.microLessons.length)],
    [currentWeek]
  );

  // ── Celebration coins for summary ──
  const summaryCoins = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        emoji: ['🪙', '✨', '⭐', '💎'][i % 4],
        x: (Math.random() - 0.5) * 400,
        y: -(80 + Math.random() * 200),
        rotate: Math.random() * 360,
        delay: Math.random() * 0.5,
      })),
    []
  );

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════
              STAGE: INTRO
             ═══════════════════════════════════ */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-8"
            >
              {/* Jars preview */}
              <motion.div
                className="flex gap-6 sm:gap-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {[
                  { emoji: '🏥', label: 'Needs', amount: jars.needs, color: 'nova-green' },
                  { emoji: '🎮', label: 'Wants', amount: jars.wants, color: 'solar-yellow' },
                  { emoji: '🔮', label: 'Savings', amount: jars.savings, color: 'plasma-blue' },
                ].map((j, i) => (
                  <motion.div
                    key={j.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                  >
                    <motion.div
                      className="text-4xl sm:text-5xl mb-2"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    >
                      {j.emoji}
                    </motion.div>
                    <div className={`text-lg font-bold text-${j.color} coin-value`}>{j.amount}</div>
                    <div className="text-xs text-dim">{j.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Calendar preview */}
              <motion.div
                className="glass rounded-2xl px-6 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <div className="text-sm font-bold text-starlight">Your Month Ahead</div>
                    <div className="text-xs text-moonbeam">Week 1 → Week 4 · Spending Simulation</div>
                  </div>
                </div>
              </motion.div>

              {/* AI Guide */}
              <AIGuide
                messages={PHASE3_AI.intro}
                avatar="🤖"
                speed={25}
                onComplete={() => {
                  setStage('week');
                  setShowWeekIntro(true);
                }}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE: WEEK-BY-WEEK GAMEPLAY
             ═══════════════════════════════════ */}
          {stage === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Timeline */}
              <WeekTimeline
                currentWeek={currentWeek}
                totalWeeks={4}
                weeks={PHASE3_WEEKS}
              />

              {/* Status bar: Jars + Happiness */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                <JarDisplay
                  needs={jars.needs}
                  wants={jars.wants}
                  savings={jars.savings}
                />
                <HappinessMeter value={happiness} />
              </div>

              {/* Week intro */}
              <AnimatePresence mode="wait">
                {showWeekIntro && weekData && (
                  <motion.div
                    key={`week-intro-${currentWeek}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-strong rounded-3xl p-6 sm:p-8 text-center"
                  >
                    <motion.div
                      className="text-5xl mb-3"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {weekData.icon}
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl font-bold text-starlight mb-1">
                      Week {currentWeek}: {weekData.title}
                    </h2>
                    <p className="text-moonbeam text-sm mb-5">{weekData.intro}</p>

                    <motion.button
                      className="px-6 py-3 rounded-xl font-bold text-white cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
                        boxShadow: '0 4px 15px rgba(79,140,255,0.3)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStartWeek}
                    >
                      {weekData.events.length > 0 ? `Start Week ${currentWeek}` : 'View Summary'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Events */}
              {!showWeekIntro && !isWeekDone && currentEvent && (
                <AnimatePresence mode="wait">
                  <EventCard
                    key={currentEvent.id}
                    event={currentEvent}
                    onPay={handlePay}
                    onChoose={handleChoose}
                    selectedChoice={decisions[currentEvent.id] || null}
                    disabled={!!decisions[currentEvent.id]}
                  />
                </AnimatePresence>
              )}

              {/* Feedback toast */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    key={feedback.text}
                    className={`text-center py-2.5 px-5 rounded-xl mx-auto max-w-lg text-sm font-medium ${
                      feedback.type === 'success'
                        ? 'bg-nova-green/15 text-nova-green border border-nova-green/20'
                        : feedback.type === 'warning'
                          ? 'bg-solar-yellow/15 text-solar-yellow border border-solar-yellow/20'
                          : 'bg-plasma-blue/15 text-plasma-blue border border-plasma-blue/20'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {feedback.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* "Next" for choice events after deciding */}
              {!showWeekIntro && currentEvent?.type === 'choice' && decisions[currentEvent.id] && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    className="px-6 py-2.5 rounded-xl font-medium text-white cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #4f8cff, #a855f7)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextEvent}
                  >
                    Continue →
                  </motion.button>
                </motion.div>
              )}

              {/* Week Complete */}
              {!showWeekIntro && isWeekDone && (
                <motion.div
                  key={`week-end-${currentWeek}`}
                  className="glass-strong rounded-3xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="text-lg font-bold text-starlight mb-1">
                    Week {currentWeek} Complete!
                  </h3>
                  <p className="text-moonbeam text-sm mb-2">{weekData.aiEnd}</p>

                  {/* Micro-lesson */}
                  <div className="glass rounded-xl px-4 py-2.5 inline-block mb-4">
                    <p className="text-xs text-dim italic">💡 {microLesson}</p>
                  </div>

                  <div>
                    <motion.button
                      className="px-6 py-3 rounded-xl font-bold text-white cursor-pointer"
                      style={{
                        background: currentWeek >= 4
                          ? 'linear-gradient(135deg, #34d399, #4f8cff)'
                          : 'linear-gradient(135deg, #4f8cff, #a855f7)',
                        boxShadow: '0 4px 15px rgba(79,140,255,0.3)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextWeek}
                    >
                      {currentWeek >= 4 ? '📊 See Month Summary' : `→ Start Week ${currentWeek + 1}`}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE: MONTH SUMMARY
             ═══════════════════════════════════ */}
          {stage === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-6 relative overflow-hidden"
            >
              {/* Celebratory particles */}
              {summaryCoins.map((c) => (
                <motion.div
                  key={c.id}
                  className="absolute text-xl pointer-events-none"
                  style={{ left: '50%', top: '35%' }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: c.x, y: c.y, opacity: 0, rotate: c.rotate }}
                  transition={{ duration: 1.5, delay: c.delay, ease: 'easeOut' }}
                >
                  {c.emoji}
                </motion.div>
              ))}

              {/* Summary card */}
              <motion.div
                className="glass-strong rounded-3xl p-6 sm:p-8 max-w-lg w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <h2 className="text-2xl sm:text-3xl font-black text-center mb-5">
                  <span className="gradient-blue-purple gradient-text">Month Complete!</span>
                </h2>

                {/* Final jar status */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Needs', icon: '✅', amount: jars.needs, start: 55, color: 'nova-green', rgb: '52,211,153' },
                    { label: 'Wants', icon: '⭐', amount: jars.wants, start: 33, color: 'solar-yellow', rgb: '251,191,36' },
                    { label: 'Savings', icon: '💎', amount: jars.savings, start: 22, color: 'plasma-blue', rgb: '79,140,255' },
                  ].map((j) => (
                    <motion.div
                      key={j.label}
                      className="text-center p-3 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(${j.rgb}, 0.1), transparent)`,
                        border: `1px solid rgba(${j.rgb}, 0.15)`,
                      }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-lg mb-1">{j.icon}</div>
                      <div className={`text-xl font-black text-${j.color} coin-value`}>{j.amount}</div>
                      <div className="text-[10px] text-dim">of {j.start} left</div>
                      <div className="text-xs text-moonbeam mt-1">{j.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Happiness */}
                <motion.div
                  className="text-center mb-5 p-3 rounded-2xl glass"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-2xl mb-1">
                    {happiness >= 70 ? '😄' : happiness >= 50 ? '😊' : '😐'}
                  </div>
                  <div className="text-sm text-starlight font-semibold">
                    Happiness: {happiness}%
                  </div>
                  <div className="text-xs text-dim">
                    {happiness >= 70
                      ? 'Feeling great! Good balance.'
                      : happiness >= 50
                        ? 'Doing okay. Room to improve.'
                        : 'A bit tight. Budgeting helps next time!'}
                  </div>
                </motion.div>

                {/* Savings status */}
                <motion.div
                  className="text-center mb-5 p-3 rounded-2xl"
                  style={{
                    background: jars.savings >= 22
                      ? 'rgba(52,211,153,0.08)'
                      : jars.savings > 0
                        ? 'rgba(79,140,255,0.08)'
                        : 'rgba(248,113,113,0.08)',
                    border: `1px solid ${
                      jars.savings >= 22
                        ? 'rgba(52,211,153,0.15)'
                        : jars.savings > 0
                          ? 'rgba(79,140,255,0.15)'
                          : 'rgba(248,113,113,0.15)'
                    }`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-lg mb-1">💎</div>
                  <div className={`text-sm font-semibold ${
                    jars.savings >= 22 ? 'text-nova-green' : jars.savings > 0 ? 'text-plasma-blue' : 'text-comet-red'
                  }`}>
                    {jars.savings >= 22
                      ? 'Savings Untouched! 🎉'
                      : jars.savings > 0
                        ? `${jars.savings} Units saved`
                        : 'Savings depleted!'}
                  </div>
                  <div className="text-xs text-dim mt-1">
                    {jars.savings >= 22
                      ? 'Your future self is protected.'
                      : 'Remember: savings protect you from surprises.'}
                  </div>
                </motion.div>

                {/* AI message */}
                <motion.div
                  className="glass rounded-xl p-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-sm text-moonbeam italic">
                    🤖 "You made it through the month. But surprises can happen anytime..."
                  </p>
                </motion.div>
              </motion.div>

              {/* Continue button */}
              <motion.button
                className="px-8 py-3.5 rounded-2xl font-bold text-white cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #34d399, #4f8cff)',
                  boxShadow: '0 4px 20px rgba(52,211,153,0.3)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: [1, 1.03, 1] }}
                transition={{ delay: 1.5, scale: { duration: 1.5, repeat: Infinity } }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinish}
              >
                🚀 Mission Complete — Continue to Phase 4!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
