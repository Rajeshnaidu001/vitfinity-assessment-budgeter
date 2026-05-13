import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import {
  SORTING_ITEMS,
  SORTING_ZONES,
  AI_GUIDE,
  PHASES,
} from '../../utils/gameData';
import AIGuide from '../../components/Phase1/AIGuide';
import WisdomMeter from '../../components/Phase1/WisdomMeter';
import DropZone from '../../components/Phase1/DropZone';
import FloatingCard from '../../components/Phase1/FloatingCard';

/**
 * Phase 1 — The Sorting Ceremony
 *
 * 4 stages:
 *   intro       → wallet + AI guide intro
 *   sorting     → drag-and-drop gameplay
 *   celebration → wallet unlock + confetti
 *   learning    → educational explanation cards
 */
export default function Phase1() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  // ── Stage management ──
  const [stage, setStage] = useState('intro');

  // ── Sorting state ──
  const [sortedMap, setSortedMap] = useState({});     // { itemId: zoneId }
  const [cardStates, setCardStates] = useState({});   // { itemId: 'idle'|'shaking'|'sorted' }
  const [highlightedZone, setHighlightedZone] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentDragItem, setCurrentDragItem] = useState(null);
  const [learningIndex, setLearningIndex] = useState(0);

  // ── Celebration state ──
  const [walletUnits, setWalletUnits] = useState(0);
  const [showCoins, setShowCoins] = useState(false);

  // ── Refs for zone hit testing ──
  const zoneRefs = useRef({});
  const arenaRef = useRef(null);

  // Items not yet sorted
  const unsortedItems = useMemo(
    () => SORTING_ITEMS.filter((item) => cardStates[item.id] !== 'sorted'),
    [cardStates]
  );

  // Items per zone
  const zoneItems = useMemo(() => {
    const map = { need: [], want: [], smart: [] };
    Object.entries(sortedMap).forEach(([itemId, zoneId]) => {
      const item = SORTING_ITEMS.find((i) => i.id === itemId);
      if (item && map[zoneId]) map[zoneId].push(item);
    });
    return map;
  }, [sortedMap]);

  // ── Zone hit testing ──
  const getZoneAtPoint = useCallback((pointX, pointY) => {
    for (const zone of SORTING_ZONES) {
      const el = zoneRefs.current[zone.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        pointX >= rect.left &&
        pointX <= rect.right &&
        pointY >= rect.top &&
        pointY <= rect.bottom
      ) {
        return zone.id;
      }
    }
    return null;
  }, []);

  // ── Highlight zone on drag move ──
  useEffect(() => {
    if (!currentDragItem) {
      setHighlightedZone(null);
      return;
    }

    const handlePointer = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const zone = getZoneAtPoint(clientX, clientY);
      setHighlightedZone(zone);
    };

    window.addEventListener('pointermove', handlePointer);
    window.addEventListener('touchmove', handlePointer, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('touchmove', handlePointer);
    };
  }, [currentDragItem, getZoneAtPoint]);

  // ── Handle drag start ──
  const handleDragStart = useCallback((item) => {
    setCurrentDragItem(item);
    setFeedbackMessage(null);
  }, []);

  // ── Handle drop ──
  const handleDragEnd = useCallback(
    (item, info, event) => {
      setCurrentDragItem(null);
      setHighlightedZone(null);

      // Get pointer position
      const clientX = event.clientX ?? (event.changedTouches?.[0]?.clientX ?? 0);
      const clientY = event.clientY ?? (event.changedTouches?.[0]?.clientY ?? 0);
      const droppedZone = getZoneAtPoint(clientX, clientY);

      if (!droppedZone) return; // Dropped outside any zone

      if (droppedZone === item.correctZone) {
        // ✅ Correct!
        setSortedMap((prev) => ({ ...prev, [item.id]: droppedZone }));
        setCardStates((prev) => ({ ...prev, [item.id]: 'sorted' }));
        setCorrectCount((c) => {
          const newCount = c + 1;
          // Check completion
          if (newCount >= SORTING_ITEMS.length) {
            setTimeout(() => setStage('celebration'), 1200);
          }
          return newCount;
        });

        // Random positive feedback
        const msg = AI_GUIDE.correct[Math.floor(Math.random() * AI_GUIDE.correct.length)];
        setFeedbackMessage({ type: 'correct', text: msg });
      } else {
        // ❌ Wrong — bounce back with shake
        setCardStates((prev) => ({ ...prev, [item.id]: 'shaking' }));
        setTimeout(() => {
          setCardStates((prev) => ({ ...prev, [item.id]: 'idle' }));
        }, 600);

        // Specific wrong feedback
        const wrongMsg = item.wrongFeedback?.[droppedZone] ||
          AI_GUIDE.wrong[droppedZone] ||
          'Not quite right. Try again!';
        setFeedbackMessage({ type: 'wrong', text: wrongMsg });
      }
    },
    [getZoneAtPoint]
  );

  // ── Celebration: animate wallet counter ──
  useEffect(() => {
    if (stage !== 'celebration') return;
    setShowCoins(true);

    const targetUnits = state.player.pocketMoney || 110;
    const step = Math.max(1, Math.floor(targetUnits / 40));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= targetUnits) {
        current = targetUnits;
        clearInterval(timer);
      }
      setWalletUnits(current);
    }, 40);

    return () => clearInterval(timer);
  }, [stage, state.player.pocketMoney]);

  // ── Handle phase completion ──
  const handleFinishLearning = useCallback(() => {
    dispatch({ type: 'ADD_REWARD', payload: { id: 'r6', title: 'Needs First', description: 'You prioritized needs over wants!', icon: '💪', points: 40 } });
    dispatch({ type: 'COMPLETE_PHASE', payload: 1 });
    dispatch({ type: 'ADVANCE_PHASE' });
    navigate('/dashboard');
  }, [dispatch, navigate]);

  // ── Confetti particles ──
  const coins = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        emoji: ['💰', '🪙', '✨', '⭐', '💎'][i % 5],
        x: (Math.random() - 0.5) * 400,
        y: -(100 + Math.random() * 300),
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.5,
        scale: 0.6 + Math.random() * 0.8,
      })),
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
              {/* Locked Wallet */}
              <motion.div
                className="glass-strong rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🔒
                </motion.div>
                <div className="text-xl font-bold text-starlight mb-1">Digital Wallet</div>
                <div className="text-3xl font-black coin-value text-dim">0 Units</div>

                {/* Scanning line effect */}
                <motion.div
                  className="absolute inset-x-0 h-0.5 bg-plasma-blue/30"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* AI Guide intro */}
              <AIGuide
                messages={AI_GUIDE.intro}
                avatar="🤖"
                speed={25}
                onComplete={() => setStage('sorting')}
              />
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 2: SORTING GAME
             ═══════════════════════════════════ */}
          {stage === 'sorting' && (
            <motion.div
              key="sorting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              {/* Wisdom Meter */}
              <WisdomMeter current={correctCount} total={SORTING_ITEMS.length} />

              {/* AI Feedback */}
              <AnimatePresence mode="wait">
                {feedbackMessage && (
                  <motion.div
                    key={feedbackMessage.text}
                    className={`text-center py-2.5 px-5 rounded-xl mx-auto max-w-md text-sm font-medium ${
                      feedbackMessage.type === 'correct'
                        ? 'bg-nova-green/15 text-nova-green border border-nova-green/20'
                        : 'bg-comet-red/15 text-comet-red border border-comet-red/20'
                    }`}
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {feedbackMessage.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ─── Floating Cards Area ─── */}
              <div
                ref={arenaRef}
                className="relative rounded-3xl p-6 sm:p-8 min-h-[280px] sm:min-h-[300px] flex flex-wrap items-center justify-center gap-4 content-center"
                style={{
                  background: 'rgba(15, 20, 50, 0.3)',
                  border: '1px solid rgba(79, 140, 255, 0.08)',
                }}
              >
                {/* Arena label */}
                <motion.p
                  className="absolute top-3 left-4 text-xs text-dim font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.5 }}
                >
                  Drag items to the zones below ↓
                </motion.p>

                {unsortedItems.map((item, i) => (
                  <FloatingCard
                    key={item.id}
                    item={item}
                    index={i}
                    state={cardStates[item.id] || 'idle'}
                    dragConstraints={arenaRef}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}

                {unsortedItems.length === 0 && (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-4xl mb-2">✨</div>
                    <p className="text-moonbeam text-sm">All items sorted!</p>
                  </motion.div>
                )}
              </div>

              {/* ─── Drop Zones ─── */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {SORTING_ZONES.map((zone) => (
                  <DropZone
                    key={zone.id}
                    ref={(el) => {
                      zoneRefs.current[zone.id] = el;
                    }}
                    zone={zone}
                    isHighlighted={highlightedZone === zone.id}
                    sortedItems={zoneItems[zone.id]}
                  />
                ))}
              </div>
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
              {showCoins &&
                coins.map((coin) => (
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
                      duration: 1.5,
                      delay: coin.delay,
                      ease: 'easeOut',
                    }}
                  >
                    {coin.emoji}
                  </motion.div>
                ))}

              {/* Unlocked wallet */}
              <motion.div
                className="glass-strong rounded-3xl p-8 sm:p-10 text-center relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              >
                <motion.div
                  className="text-7xl mb-4"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  🔓
                </motion.div>

                <motion.div
                  className="text-xl font-bold text-starlight mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Digital Wallet
                </motion.div>

                <motion.div
                  className="text-5xl font-black coin-value"
                  style={{
                    background: 'linear-gradient(90deg, #fbbf24, #f97316, #fbbf24)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {walletUnits} Units
                </motion.div>
              </motion.div>

              {/* Big congratulations text */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <h2 className="text-3xl sm:text-4xl font-black mb-2">
                  <span className="gradient-blue-purple gradient-text">
                    Congratulations!
                  </span>
                </h2>
                <p className="text-moonbeam text-lg max-w-md mx-auto mb-2">
                  You unlocked your monthly budget!
                </p>
                <p className="text-dim text-sm max-w-sm mx-auto">
                  You proved you can tell the difference between needs, wants, and smart alternatives.
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
                onClick={() => setStage('learning')}
              >
                📚 See What You Learned
              </motion.button>
            </motion.div>
          )}

          {/* ═══════════════════════════════════
              STAGE 4: LEARNING CARDS
             ═══════════════════════════════════ */}
          {stage === 'learning' && (
            <motion.div
              key="learning"
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
                  What You Learned
                </span>
              </motion.h2>

              {/* Card carousel */}
              <div className="w-full max-w-lg">
                <AnimatePresence mode="wait">
                  {SORTING_ITEMS[learningIndex] && (
                    <motion.div
                      key={learningIndex}
                      className="glass-strong rounded-3xl p-6 sm:p-8"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -60 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Item header */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="text-4xl sm:text-5xl">
                          {SORTING_ITEMS[learningIndex].icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-starlight">
                            {SORTING_ITEMS[learningIndex].name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                SORTING_ITEMS[learningIndex].correctZone === 'need'
                                  ? 'bg-nova-green/15 text-nova-green'
                                  : SORTING_ITEMS[learningIndex].correctZone === 'want'
                                    ? 'bg-solar-yellow/15 text-solar-yellow'
                                    : 'bg-plasma-blue/15 text-plasma-blue'
                              }`}
                            >
                              {SORTING_ZONES.find(
                                (z) => z.id === SORTING_ITEMS[learningIndex].correctZone
                              )?.icon}{' '}
                              {SORTING_ZONES.find(
                                (z) => z.id === SORTING_ITEMS[learningIndex].correctZone
                              )?.label}
                            </span>
                            <span className="text-xs text-dim">
                              {SORTING_ITEMS[learningIndex].cost === 0
                                ? 'FREE'
                                : `${SORTING_ITEMS[learningIndex].cost} Units`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div
                        className="rounded-2xl p-4"
                        style={{
                          background: 'rgba(79, 140, 255, 0.05)',
                          border: '1px solid rgba(79, 140, 255, 0.1)',
                        }}
                      >
                        <p className="text-moonbeam text-sm sm:text-base leading-relaxed">
                          💡 {SORTING_ITEMS[learningIndex].explanation}
                        </p>
                      </div>

                      {/* Card counter */}
                      <div className="text-center text-xs text-dim mt-4">
                        {learningIndex + 1} of {SORTING_ITEMS.length}
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
                    onClick={() => setLearningIndex((i) => Math.max(0, i - 1))}
                    disabled={learningIndex === 0}
                  >
                    ← Previous
                  </motion.button>

                  {/* Dot indicators */}
                  <div className="flex gap-1.5">
                    {SORTING_ITEMS.map((_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          i === learningIndex
                            ? 'w-5 bg-plasma-blue'
                            : 'bg-stardust hover:bg-moonbeam'
                        }`}
                        onClick={() => setLearningIndex(i)}
                      />
                    ))}
                  </div>

                  {learningIndex < SORTING_ITEMS.length - 1 ? (
                    <motion.button
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-white cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #4f8cff, #a855f7)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLearningIndex((i) => i + 1)}
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
                      onClick={handleFinishLearning}
                      initial={{ scale: 0.9 }}
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
