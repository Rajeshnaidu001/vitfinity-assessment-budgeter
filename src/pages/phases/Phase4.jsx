import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { PHASE4_EMERGENCY, PHASE4_AI } from '../../utils/gameData';
import AIGuide from '../../components/Phase1/AIGuide';
import JarDisplay from '../../components/Phase3/JarDisplay';
import HappinessMeter from '../../components/Phase3/HappinessMeter';
import EmergencyAlert from '../../components/Phase4/EmergencyAlert';
import StabilityMeter from '../../components/Phase4/StabilityMeter';
import CrisisCard from '../../components/Phase4/CrisisCard';

/**
 * Phase 4 — Crisis Management
 *
 * Stages:
 *   intro       → AI guide warns about surprises
 *   emergency   → cinematic alert sequence
 *   resolution  → branching choices based on remaining budget
 *   recovery    → outcome + stability assessment
 *   complete    → educational summary + unlock Phase 5
 */
export default function Phase4() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  // ── Stage ──
  const [stage, setStage] = useState('intro');

  // ── Budget state (import from global state / Phase 3 results) ──
  const initialWants = state.budget?.wants
    ? Math.max(0, state.budget.wants - (state.budget.wantsSpent || 0))
    : 33;
  const initialSavings = state.budget?.savings
    ? Math.max(0, state.budget.savings - (state.budget.savingsUsed || 0))
    : 22;
  const initialNeeds = state.budget?.needs
    ? Math.max(0, state.budget.needs - (state.budget.needsSpent || 0))
    : 0;

  const [jars, setJars] = useState({
    needs: initialNeeds,
    wants: initialWants,
    savings: initialSavings,
  });
  const [happiness, setHappiness] = useState(state.progress?.happiness || 65);
  const [stability, setStability] = useState(70);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isResolved, setIsResolved] = useState(false);

  // ── Determine available options based on player's budget ──
  const availableOptions = useMemo(() => {
    const opts = [];
    const e = PHASE4_EMERGENCY;

    if (jars.wants >= e.replaceCost) {
      // Scenario A: enough wants for full replacement
      opts.push(e.options.find((o) => o.id === 'replace_wants'));
    }
    if (jars.wants >= e.repairCost) {
      // Can repair from wants
      opts.push(e.options.find((o) => o.id === 'repair_wants'));
    }
    if (jars.wants < e.replaceCost && jars.savings >= (e.replaceCost + e.emergencyAccessCost)) {
      // Scenario B: must use savings for replacement
      opts.push(e.options.find((o) => o.id === 'replace_savings'));
    }
    if (jars.wants < e.repairCost && jars.savings >= (e.repairCost + 2)) {
      // Must use savings even for repair
      opts.push(e.options.find((o) => o.id === 'repair_savings'));
    }

    // Deduplicate and remove nulls
    return [...new Map(opts.filter(Boolean).map((o) => [o.id, o])).values()];
  }, [jars]);

  // Scenario type
  const scenarioType = jars.wants >= PHASE4_EMERGENCY.replaceCost ? 'flexible' : 'tight';

  // ── Handle option selection ──
  const handleSelectOption = useCallback((option) => {
    setSelectedOption(option);

    // Deduct from source jar
    const totalCost = option.totalCost || option.cost;
    setJars((prev) => ({
      ...prev,
      [option.source]: Math.max(0, prev[option.source] - totalCost),
    }));

    // Update happiness
    const newHappiness = Math.max(0, Math.min(100, happiness + option.happinessChange));
    setHappiness(newHappiness);
    dispatch({ type: 'UPDATE_HAPPINESS', payload: newHappiness });

    // Update stability
    setStability((s) => Math.max(0, Math.min(100, s + (option.stabilityChange || 0))));

    // Dispatch to global state
    if (option.source === 'savings') {
      dispatch({ type: 'USE_SAVINGS', payload: { amount: totalCost } });
    } else {
      dispatch({
        type: 'SPEND',
        payload: {
          category: option.source,
          amount: totalCost,
          item: { id: 'emergency_bag', name: PHASE4_EMERGENCY.title, icon: '🎒', cost: totalCost },
        },
      });
    }

    dispatch({
      type: 'TRIGGER_EMERGENCY',
      payload: {
        id: 'bag_emergency',
        title: PHASE4_EMERGENCY.title,
        cost: totalCost,
        resolution: option.id,
      },
    });

    // Award badge if applicable
    if (option.badge) {
      dispatch({ type: 'ADD_REWARD', payload: option.badge });
    }

    setIsResolved(true);
  }, [dispatch, happiness]);

  // ── Handle phase completion ──
  const handleFinish = useCallback(() => {
    dispatch({
      type: 'ADD_REWARD',
      payload: { id: 'r_crisis', title: 'Crisis Survivor', description: 'You handled an emergency without panic!', icon: '🛡️', points: 75 },
    });
    dispatch({ type: 'COMPLETE_PHASE', payload: 4 });
    dispatch({ type: 'ADVANCE_PHASE' });
    navigate('/dashboard');
  }, [dispatch, navigate]);

  // ── Celebration particles ──
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        emoji: ['🛡️', '✨', '💎', '⭐', '🪙'][i % 5],
        x: (Math.random() - 0.5) * 400,
        y: -(80 + Math.random() * 250),
        rotate: Math.random() * 500 - 250,
        delay: Math.random() * 0.5,
      })),
    []
  );

  // ── Micro-lesson ──
  const microLesson = useMemo(
    () => PHASE4_AI.microLessons[Math.floor(Math.random() * PHASE4_AI.microLessons.length)],
    []
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
              className="flex flex-col items-center justify-center min-h-[70vh] gap-8"
            >
              {/* Jars preview */}
              <motion.div
                className="flex gap-6 sm:gap-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[
                  { emoji: '🏥', label: 'Needs', amount: jars.needs, color: 'nova-green' },
                  { emoji: '🎮', label: 'Wants', amount: jars.wants, color: 'solar-yellow' },
                  { emoji: '🔮', label: 'Savings', amount: jars.savings, color: 'plasma-blue' },
                ].map((j, i) => (
                  <motion.div
                    key={j.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <motion.div
                      className="text-4xl mb-2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    >
                      {j.emoji}
                    </motion.div>
                    <div className={`text-lg font-bold text-${j.color} coin-value`}>{j.amount}</div>
                    <div className="text-xs text-dim">{j.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* AI Guide */}
              <AIGuide
                messages={PHASE4_AI.intro}
                avatar="🤖"
                speed={30}
                onComplete={() => setStage('emergency')}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 2: EMERGENCY ALERT
             ═══════════════════════════════════ */}
          {stage === 'emergency' && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh]"
            >
              <EmergencyAlert
                emergency={PHASE4_EMERGENCY}
                onRevealComplete={() => setStage('resolution')}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 3: RESOLUTION
             ═══════════════════════════════════ */}
          {stage === 'resolution' && (
            <motion.div
              key="resolution"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Status panels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <JarDisplay
                  needs={jars.needs}
                  wants={jars.wants}
                  savings={jars.savings}
                />
                <HappinessMeter value={happiness} />
                <StabilityMeter value={stability} />
              </div>

              {/* Scenario message */}
              <motion.div
                className={`text-center py-3 px-5 rounded-xl mx-auto max-w-lg text-sm font-medium ${
                  scenarioType === 'flexible'
                    ? 'bg-nova-green/15 text-nova-green border border-nova-green/20'
                    : 'bg-solar-yellow/15 text-solar-yellow border border-solar-yellow/20'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                🤖 {scenarioType === 'flexible' ? PHASE4_AI.hasFlexibility : PHASE4_AI.mustUseSavings}
              </motion.div>

              {/* Savings reassurance for tight budgets */}
              {scenarioType === 'tight' && !isResolved && (
                <motion.div
                  className="text-center text-sm text-plasma-blue/80 italic max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  💡 {PHASE4_AI.savingsReassurance}
                </motion.div>
              )}

              {/* Emergency card reminder */}
              <motion.div
                className="glass rounded-2xl px-5 py-4 flex items-center gap-4 max-w-lg mx-auto w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  border: '1px solid rgba(248,113,113,0.15)',
                  background: 'linear-gradient(135deg, rgba(248,113,113,0.08), transparent)',
                }}
              >
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [0, -3, 3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🎒
                </motion.span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-starlight">{PHASE4_EMERGENCY.title}</div>
                  <div className="text-xs text-moonbeam">{PHASE4_EMERGENCY.description}</div>
                </div>
                {!isResolved && (
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-comet-red flex-shrink-0"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {isResolved && (
                  <span className="text-nova-green text-lg">✅</span>
                )}
              </motion.div>

              {/* Resolution options */}
              {!isResolved && (
                <motion.div
                  className="max-w-lg mx-auto w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-sm font-semibold text-moonbeam mb-3 text-center">
                    Choose how to handle this emergency:
                  </h3>
                  <div className="flex flex-col gap-3">
                    {availableOptions.map((opt, i) => (
                      <CrisisCard
                        key={opt.id}
                        option={opt}
                        onSelect={handleSelectOption}
                        isSelected={selectedOption?.id === opt.id}
                        disabled={isResolved}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Resolution result */}
              {isResolved && selectedOption && (
                <motion.div
                  className="max-w-lg mx-auto w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Selected option displayed */}
                  <CrisisCard
                    option={selectedOption}
                    onSelect={() => {}}
                    isSelected={true}
                    disabled={true}
                  />

                  {/* Micro-lesson */}
                  <motion.div
                    className="glass rounded-xl px-4 py-3 mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-xs text-dim italic">💡 {microLesson}</p>
                  </motion.div>

                  {/* Continue */}
                  <motion.div
                    className="text-center mt-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.button
                      className="px-8 py-3.5 rounded-2xl font-bold text-white cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #34d399, #4f8cff)',
                        boxShadow: '0 4px 20px rgba(52,211,153,0.3)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStage('complete')}
                    >
                      ✨ See Your Recovery
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 4: COMPLETION
             ═══════════════════════════════════ */}
          {stage === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-6 relative overflow-hidden"
            >
              {/* Particles */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute text-xl pointer-events-none"
                  style={{ left: '50%', top: '35%' }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
                  transition={{ duration: 1.5, delay: p.delay, ease: 'easeOut' }}
                >
                  {p.emoji}
                </motion.div>
              ))}

              {/* Recovery card */}
              <motion.div
                className="glass-strong rounded-3xl p-6 sm:p-8 max-w-lg w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <h2 className="text-2xl sm:text-3xl font-black text-center mb-5">
                  <span className="gradient-blue-purple gradient-text">Crisis Resolved!</span>
                </h2>

                {/* Final status */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Wants', icon: '⭐', amount: jars.wants, color: 'solar-yellow', rgb: '251,191,36' },
                    { label: 'Savings', icon: '💎', amount: jars.savings, color: 'plasma-blue', rgb: '79,140,255' },
                    { label: 'Stability', icon: '🛡️', amount: `${stability}%`, color: stability >= 70 ? 'nova-green' : stability >= 40 ? 'solar-yellow' : 'comet-red', rgb: stability >= 70 ? '52,211,153' : stability >= 40 ? '251,191,36' : '248,113,113' },
                  ].map((j) => (
                    <motion.div
                      key={j.label}
                      className="text-center p-3 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(${j.rgb}, 0.1), transparent)`,
                        border: `1px solid rgba(${j.rgb}, 0.15)`,
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-lg mb-1">{j.icon}</div>
                      <div className={`text-xl font-black text-${j.color} coin-value`}>{j.amount}</div>
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
                    {happiness >= 60 ? '😊' : happiness >= 40 ? '😐' : '😟'}
                  </div>
                  <div className="text-sm text-starlight font-semibold">
                    Happiness: {happiness}%
                  </div>
                </motion.div>

                {/* AI Resolution message */}
                <motion.div
                  className="glass rounded-xl p-4 text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className="text-sm text-moonbeam">
                    🤖 "{PHASE4_AI.resolved}"
                  </p>
                </motion.div>

                {/* Educational takeaway */}
                <motion.div
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(79, 140, 255, 0.05)',
                    border: '1px solid rgba(79, 140, 255, 0.1)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <h4 className="text-sm font-bold text-starlight mb-2">💡 What You Learned</h4>
                  <ul className="space-y-1.5">
                    <li className="text-xs text-moonbeam flex items-start gap-2">
                      <span className="text-nova-green">•</span>
                      Emergencies are normal — preparation reduces stress
                    </li>
                    <li className="text-xs text-moonbeam flex items-start gap-2">
                      <span className="text-solar-yellow">•</span>
                      Savings create protection, not restriction
                    </li>
                    <li className="text-xs text-moonbeam flex items-start gap-2">
                      <span className="text-plasma-blue">•</span>
                      Financial resilience means bouncing back from surprises
                    </li>
                    {selectedOption?.id?.includes('repair') && (
                      <li className="text-xs text-moonbeam flex items-start gap-2">
                        <span className="text-cosmic-pink">•</span>
                        Repairing is often smarter than replacing
                      </li>
                    )}
                  </ul>
                </motion.div>
              </motion.div>

              {/* Finish button */}
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
                🚀 Mission Complete — Continue to Phase 5!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
