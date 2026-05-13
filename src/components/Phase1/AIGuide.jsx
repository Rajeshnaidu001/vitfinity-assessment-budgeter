import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AIGuide — Typewriter-style text bubble for the AI guide character.
 * Shows messages one at a time with character-by-character reveal.
 */
export default function AIGuide({
  messages = [],
  avatar = '🤖',
  onComplete,
  speed = 30,
  autoAdvance = true,
  className = '',
}) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const currentMessage = messages[messageIndex] || '';
  const displayedText = currentMessage.slice(0, charIndex);
  const isDone = messageIndex >= messages.length;

  // Typewriter effect
  useEffect(() => {
    if (isDone) return;
    if (charIndex < currentMessage.length) {
      const timer = setTimeout(() => setCharIndex((c) => c + 1), speed);
      return () => clearTimeout(timer);
    }
    // Message fully typed
    setIsTyping(false);
    if (autoAdvance && messageIndex < messages.length - 1) {
      const timer = setTimeout(() => {
        setMessageIndex((i) => i + 1);
        setCharIndex(0);
        setIsTyping(true);
      }, 1800);
      return () => clearTimeout(timer);
    } else if (messageIndex === messages.length - 1) {
      // Last message done
      const timer = setTimeout(() => onComplete?.(), 1200);
      return () => clearTimeout(timer);
    }
  }, [charIndex, currentMessage, messageIndex, messages, speed, autoAdvance, isDone, onComplete]);

  // Reset on new messages
  useEffect(() => {
    setMessageIndex(0);
    setCharIndex(0);
    setIsTyping(true);
  }, [messages]);

  if (isDone || messages.length === 0) return null;

  return (
    <motion.div
      className={`flex items-start gap-3 max-w-lg mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      {/* Avatar */}
      <motion.div
        className="flex-shrink-0 w-12 h-12 rounded-full glass-strong flex items-center justify-center text-2xl"
        animate={{ scale: isTyping ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 0.6, repeat: isTyping ? Infinity : 0 }}
      >
        {avatar}
      </motion.div>

      {/* Text bubble */}
      <div className="glass rounded-2xl rounded-tl-sm px-5 py-3.5 flex-1 min-h-[56px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            className="text-starlight text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {displayedText}
            {isTyping && (
              <motion.span
                className="inline-block w-0.5 h-4 bg-plasma-blue ml-0.5 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
