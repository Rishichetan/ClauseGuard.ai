import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSequenceProps {
  isLoading: boolean;
}

const STATUS_MESSAGES = [
  "Parsing legal language...",
  "Identifying risk factors...",
  "Calculating exposure score...",
  "Finalizing report...",
];

export default function LoadingSequence({ isLoading }: LoadingSequenceProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentMessageIndex(0);
      setProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15 + 5;
      });
    }, 400);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev >= STATUS_MESSAGES.length - 1) return prev;
        return prev + 1;
      });
    }, 900);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-obsidian/95 backdrop-blur-xl"
        >
          {/* Circular progress */}
          <div className="relative w-[200px] h-[200px] mb-12">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="6"
                fill="none"
              />
              {/* Progress ring */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#0EA5E9"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.6))',
                }}
              />
            </svg>

            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-3xl font-bold text-white"
                key={Math.floor(progress)}
              >
                {Math.floor(Math.min(progress, 100))}%
              </motion.span>
            </div>
          </div>

          {/* Status messages with typing effect */}
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <span className="font-mono text-lg text-neon-blue">
                  {STATUS_MESSAGES[currentMessageIndex]}
                </span>
                <motion.span
                  className="font-mono text-lg text-neon-blue ml-0.5"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                >
                  |
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtle progress dots */}
          <div className="flex gap-2 mt-8">
            {STATUS_MESSAGES.map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor: i <= currentMessageIndex ? '#0EA5E9' : 'rgba(255,255,255,0.2)',
                  scale: i === currentMessageIndex ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
