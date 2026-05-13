import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { AVATARS } from '../utils/gameData';
import { calculatePocketMoney } from '../utils/calculations';
import FloatingButton from '../components/UI/FloatingButton';
import ParticleField from '../components/Background/ParticleField';

/**
 * Landing/onboarding page
 * Step 0: Welcome → Step 1: Name → Step 2: Age → Step 3: Avatar → Launch
 */
export default function Landing() {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState(null);
  const [avatar, setAvatar] = useState('');

  // Redirect to dashboard if already onboarded (via effect, not during render)
  useEffect(() => {
    if (state.isOnboarded) {
      navigate('/dashboard', { replace: true });
    }
  }, [state.isOnboarded, navigate]);

  // Don't render anything while redirecting
  if (state.isOnboarded) return null;

  const ages = [11, 12, 13, 14, 15, 16];

  const handleLaunch = () => {
    dispatch({
      type: 'SET_PLAYER',
      payload: { name: name.trim() || 'Explorer', age, avatar },
    });
    navigate('/dashboard');
  };

  const stepVariants = {
    initial: { opacity: 0, x: 60, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -60, scale: 0.95 },
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center overflow-hidden">
      <ParticleField />

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79, 140, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 140, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main content — scrollable, padded, centered */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 flex-1 flex flex-col items-center justify-center py-16">
        <AnimatePresence mode="wait">
          {/* ─── STEP 0: Welcome ─── */}
          {step === 0 && (
            <motion.div
              key="welcome"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="text-center w-full flex flex-col items-center"
            >
              {/* Logo / Title */}
              <motion.div
                className="mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="text-7xl mb-4">🚀</div>
                <h1 className="text-5xl sm:text-6xl font-black">
                  <span className="gradient-blue-purple gradient-text gradient-animated">
                    VitFinity
                  </span>
                </h1>
                <p className="text-moonbeam text-lg mt-3 font-medium">
                  Budget Simulator
                </p>
              </motion.div>

              <motion.p
                className="text-starlight/80 text-lg mb-8 max-w-md mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Master your money through an{' '}
                <span className="text-plasma-blue font-semibold">epic space adventure</span>.
                Learn to budget, save, and make smart decisions!
              </motion.p>

              {/* Floating feature cards */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-10 w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { icon: '🎯', label: 'Budget' },
                  { icon: '💎', label: 'Save' },
                  { icon: '🧠', label: 'Decide' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="glass rounded-2xl p-4 text-center flex flex-col items-center justify-center"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.5,
                    }}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs text-moonbeam font-medium">{item.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              <FloatingButton
                onClick={() => setStep(1)}
                size="lg"
                icon="✨"
              >
                Start Your Journey
              </FloatingButton>
            </motion.div>
          )}

          {/* ─── STEP 1: Name ─── */}
          {step === 1 && (
            <motion.div
              key="name"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="text-center w-full flex flex-col items-center"
            >
              <motion.div
                className="text-5xl mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👋
              </motion.div>
              <h2 className="text-3xl font-bold text-starlight mb-2">
                What's your name?
              </h2>
              <p className="text-moonbeam mb-8">Every great explorer needs a name!</p>

              <div className="glass rounded-2xl p-1.5 mb-10 w-full max-w-xs">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  className="w-full bg-transparent text-center text-xl text-starlight 
                    placeholder-dim outline-none py-3 px-4 font-medium"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) setStep(2);
                  }}
                />
              </div>

              <div className="flex gap-4 justify-center">
                <FloatingButton variant="ghost" onClick={() => setStep(0)} size="md">
                  Back
                </FloatingButton>
                <FloatingButton
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  icon="→"
                >
                  Continue
                </FloatingButton>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 2: Age ─── */}
          {step === 2 && (
            <motion.div
              key="age"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="text-center w-full flex flex-col items-center"
            >
              <motion.div
                className="text-5xl mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎂
              </motion.div>
              <h2 className="text-3xl font-bold text-starlight mb-2">
                How old are you, {name.trim() || 'Explorer'}?
              </h2>
              <p className="text-moonbeam mb-8">
                Your age determines your pocket money!
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6 w-full max-w-sm">
                {ages.map((a, i) => (
                  <motion.button
                    key={a}
                    className={`rounded-2xl p-4 font-bold text-xl transition-all cursor-pointer ${
                      age === a
                        ? 'gradient-blue-purple text-white glow-blue'
                        : 'glass text-starlight hover:border-plasma-blue/30'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAge(a)}
                  >
                    {a}
                  </motion.button>
                ))}
              </div>

              {/* Pocket money preview */}
              <AnimatePresence>
                {age && (
                  <motion.div
                    className="glass rounded-2xl p-4 mb-4 w-full max-w-sm"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  >
                    <p className="text-moonbeam text-sm mb-1">Your Monthly Pocket Money</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">💰</span>
                      <span className="coin-value text-3xl text-solar-yellow font-bold">
                        {calculatePocketMoney(age)}
                      </span>
                      <span className="text-moonbeam">Units</span>
                    </div>
                    <p className="text-dim text-xs mt-2">
                      Formula: {age} × 10 = {calculatePocketMoney(age)} Units
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 justify-center mt-2">
                <FloatingButton variant="ghost" onClick={() => setStep(1)}>
                  Back
                </FloatingButton>
                <FloatingButton
                  onClick={() => setStep(3)}
                  disabled={!age}
                  icon="→"
                >
                  Continue
                </FloatingButton>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Avatar ─── */}
          {step === 3 && (
            <motion.div
              key="avatar"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="text-center w-full flex flex-col items-center"
            >
              <motion.div
                className="text-5xl mb-6"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🌟
              </motion.div>
              <h2 className="text-3xl font-bold text-starlight mb-2">
                Choose your avatar
              </h2>
              <p className="text-moonbeam mb-8">
                Pick a character for your journey!
              </p>

              <div className="grid grid-cols-3 gap-3 mb-10 w-full max-w-sm">
                {AVATARS.map((av, i) => (
                  <motion.button
                    key={av.id}
                    className={`rounded-2xl p-5 cursor-pointer transition-all flex flex-col items-center justify-center ${
                      avatar === av.emoji
                        ? 'gradient-blue-purple glow-blue'
                        : 'glass hover:border-plasma-blue/30'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAvatar(av.emoji)}
                  >
                    <div className="text-3xl mb-1">{av.emoji}</div>
                    <div className="text-xs text-moonbeam">{av.label}</div>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <FloatingButton variant="ghost" onClick={() => setStep(2)}>
                  Back
                </FloatingButton>
                <FloatingButton
                  onClick={handleLaunch}
                  disabled={!avatar}
                  size="lg"
                  icon="🚀"
                  variant="success"
                >
                  Launch Mission!
                </FloatingButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicator dots — separated with good margin */}
        <motion.div
          className="flex justify-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? 'w-8 gradient-blue-purple'
                  : s < step
                    ? 'w-2 bg-plasma-blue/50'
                    : 'w-2 bg-stardust'
              }`}
              layout
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
