import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Share2, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { RiskItem } from './RiskCards';

interface ShareableReportProps {
  score: number;
  risks: RiskItem[];
  isVisible: boolean;
}

function getScoreColor(score: number): string {
  if (score <= 40) return '#10B981';
  if (score <= 70) return '#F59E0B';
  return '#EF4444';
}

function getScoreLabel(score: number): string {
  if (score <= 40) return 'LOW RISK';
  if (score <= 70) return 'MODERATE RISK';
  return 'HIGH RISK';
}

export default function ShareableReport({ score, risks, isVisible }: ShareableReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const highRisks = risks.filter((r) => r.severity === 'high').length;
  const moderateRisks = risks.filter((r) => r.severity === 'moderate').length;
  const lowRisks = risks.filter((r) => r.severity === 'low').length;

  const handleGenerate = useCallback(async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    
    try {
      const dataUrl = await toPng(reportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0B0F1A',
      });
      setDownloadUrl(dataUrl);
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.download = `clauseguard-report-${Date.now()}.png`;
    link.href = downloadUrl;
    link.click();
  }, [downloadUrl]);

  if (!isVisible) return null;

  return (
    <section className="relative py-20 px-4 bg-obsidian">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-sm text-neon-blue tracking-widest uppercase">SHARE YOUR RESULTS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
            Shareable Report
          </h2>
          <p className="text-muted-foreground mt-3">
            Generate a visual summary to share with your team or on social media
          </p>
        </div>

        {/* Report card (visible to user) */}
        <div className="flex flex-col items-center gap-8">
          {/* The actual report card that gets captured */}
          <div 
            ref={reportRef}
            className="relative w-full max-w-[600px] aspect-[1200/630] rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0B0F1A 0%, #111827 50%, #0B0F1A 100%)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
            }}
          >
            {/* Background accents */}
            <div 
              className="absolute w-[300px] h-[300px] rounded-full opacity-30"
              style={{
                background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                top: '-50px',
                right: '-50px',
              }}
            />
            <div 
              className="absolute w-[200px] h-[200px] rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                bottom: '-30px',
                left: '-30px',
              }}
            />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-wide">CLAUSEGUARD</span>
              </div>

              {/* Score circle */}
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={339.292}
                    strokeDashoffset={339.292 - (339.292 * score / 100)}
                    style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color }}>{score}</span>
                  <span className="text-[10px] text-muted-foreground">/ 100</span>
                </div>
              </div>

              {/* Label */}
              <div 
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6"
                style={{
                  background: `${color}20`,
                  color,
                  border: `1px solid ${color}40`,
                }}
              >
                {label}
              </div>

              {/* Mini breakdown */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-neon-red" />
                  <span className="text-xs text-white/80">{highRisks} High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-neon-amber" />
                  <span className="text-xs text-white/80">{moderateRisks} Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-neon-green" />
                  <span className="text-xs text-white/80">{lowRisks} Low</span>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[10px] text-muted-foreground/60 font-mono">clauseguard.ai</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            {!downloadUrl ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-full 
                           hover:brightness-110 transition-all duration-300 shadow-glow flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-full 
                             hover:brightness-110 transition-all duration-300 shadow-glow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDownloadUrl(null)}
                  className="px-6 py-3 bg-white/5 text-white font-medium rounded-full 
                             hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  Regenerate
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
