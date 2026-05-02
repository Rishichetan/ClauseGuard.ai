import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../sections/HeroSection';
import AnalyzerInput from '../sections/AnalyzerInput';
import LoadingSequence from '../sections/LoadingSequence';
import RiskScoreReveal from '../sections/RiskScoreReveal';
import RiskCards, { SAMPLE_RISKS } from '../sections/RiskCards';
import ShareableReport from '../sections/ShareableReport';
import Footer from '../sections/Footer';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const analyzerRef = useRef<HTMLDivElement>(null);

  const scrollToAnalyzer = useCallback(() => {
    analyzerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleAnalyze = useCallback((_text: string) => {
    setIsLoading(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsLoading(false);
      // Calculate a realistic risk score based on the sample (high risk)
      setScore(78);
      setShowResults(true);
      
      // Scroll to results after a short delay
      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' });
      }, 500);
    }, 3500);
  }, []);

  return (
    <main className="relative bg-obsidian min-h-screen overflow-x-hidden">
      {/* Loading overlay */}
      <LoadingSequence isLoading={isLoading} />

      {/* Hero */}
      <HeroSection onStartAnalysis={scrollToAnalyzer} />

      {/* Analyzer Input */}
      <div ref={analyzerRef}>
        <AnalyzerInput onAnalyze={handleAnalyze} />
      </div>

      {/* Results sections */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Risk Score */}
            <RiskScoreReveal score={score} isVisible={showResults} />

            {/* Risk Cards */}
            <RiskCards risks={SAMPLE_RISKS} isVisible={showResults} />

            {/* Shareable Report */}
            <ShareableReport score={score} risks={SAMPLE_RISKS} isVisible={showResults} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </main>
  );
}
