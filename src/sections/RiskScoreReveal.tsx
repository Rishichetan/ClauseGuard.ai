import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RiskScoreRevealProps {
  score: number;
  isVisible: boolean;
}

function getScoreColor(score: number): string {
  if (score <= 40) return '#10B981';
  if (score <= 70) return '#F59E0B';
  return '#EF4444';
}

function getScoreLabel(score: number): { text: string; icon: React.ReactNode; color: string } {
  if (score <= 40) {
    return { 
      text: 'LOW RISK', 
      icon: <CheckCircle className="w-5 h-5" />, 
      color: '#10B981' 
    };
  }
  if (score <= 70) {
    return { 
      text: 'MODERATE RISK', 
      icon: <AlertTriangle className="w-5 h-5" />, 
      color: '#F59E0B' 
    };
  }
  return { 
    text: 'HIGH RISK', 
    icon: <XCircle className="w-5 h-5" />, 
    color: '#EF4444' 
  };
}

export default function RiskScoreReveal({ score, isVisible }: RiskScoreRevealProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayScore, setDisplayScore] = useState(0);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    if (!isVisible) return;
    
    const controls = animate(count, score, {
      duration: 2,
      ease: 'easeOut',
    });

    return controls.stop;
  }, [isVisible, score, count]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplayScore(v));
    return unsubscribe;
  }, [rounded]);

  if (!isVisible) return null;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-obsidian">
      {/* Background glow matching score color */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Label above score */}
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-mono text-sm tracking-[0.3em] text-muted-foreground mb-6"
        >
          RISK SCORE
        </motion.span>

        {/* Circular score display */}
        <div className="relative w-[300px] h-[300px]">
          {/* Outer glow */}
          <motion.div
            className="absolute inset-[-20px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
            {/* Track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="12"
              fill="none"
            />
            
            {/* Progress ring */}
            <motion.circle
              cx="140"
              cy="140"
              r={radius}
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 12px ${color}80)`,
              }}
            />

            {/* Decorative ticks */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * 360;
              const isMajor = i % 10 === 0;
              const innerR = radius - (isMajor ? 20 : 14);
              const outerR = radius - (isMajor ? 8 : 10);
              const rad = (angle * Math.PI) / 180;
              const x1 = 140 + innerR * Math.cos(rad);
              const y1 = 140 + innerR * Math.sin(rad);
              const x2 = 140 + outerR * Math.cos(rad);
              const y2 = 140 + outerR * Math.sin(rad);
              
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i <= (displayScore / 100) * 60 ? color : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isMajor ? 2 : 1}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Score number in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-7xl font-bold"
              style={{ color }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            >
              {displayScore}
            </motion.span>
            <span className="text-sm text-muted-foreground mt-1">/ 100</span>
          </div>
        </div>

        {/* Risk label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-2 mt-8 px-6 py-3 rounded-full"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}40`,
          }}
        >
          <span style={{ color }}>{label.icon}</span>
          <span className="font-semibold tracking-wider" style={{ color }}>
            {label.text}
          </span>
        </motion.div>

        {/* Subtle description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-muted-foreground text-center max-w-md mt-6 text-sm"
        >
          {score <= 40 
            ? "This contract contains minimal risk factors. Key terms are balanced and fair."
            : score <= 70
            ? "This contract has some concerning clauses that warrant review and potential negotiation."
            : "This contract contains significant risk factors. Several clauses strongly favor the other party."
          }
        </motion.p>
      </motion.div>
    </section>
  );
}
