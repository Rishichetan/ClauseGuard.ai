import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, AlertTriangle } from 'lucide-react';

interface AnalyzerInputProps {
  onAnalyze: (text: string) => void;
}

const SAMPLE_CONTRACT = `1. INDEMNIFICATION
The Contractor shall indemnify, defend, and hold harmless the Company from any and all claims, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or resulting from the performance of the Services, regardless of whether such claims are attributable to the negligence of the Company.

2. TERMINATION
Company may terminate this Agreement immediately and without prior notice for any reason whatsoever, including but not limited to convenience. Upon termination, Contractor shall immediately cease all work and shall not be entitled to any compensation for work not yet performed.

3. INTELLECTUAL PROPERTY
All work product, including but not limited to code, designs, documentation, and inventions created during the term of this Agreement shall be the exclusive property of the Company. Contractor hereby assigns all rights, title, and interest in and to such work product to the Company without further compensation.

4. NON-COMPETE
Contractor agrees that for a period of five (5) years following termination of this Agreement, Contractor shall not directly or indirectly engage in any business that competes with the Company's business within a radius of 500 miles from any location where the Company operates.`;

export default function AnalyzerInput({ onAnalyze }: AnalyzerInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleAnalyze = () => {
    const textToAnalyze = text.trim() || SAMPLE_CONTRACT;
    onAnalyze(textToAnalyze);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-obsidian">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.5) 0%, transparent 70%)',
            top: '20%',
            right: '10%',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-neon-blue" />
            <span className="font-mono text-sm text-neon-blue tracking-widest uppercase">SECURE DOCUMENT CHANNEL</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Paste your contract clause
          </h2>
          <p className="text-muted-foreground">
            Our AI will analyze the risk level and flag problematic terms
          </p>
        </div>

        {/* Input area */}
        <motion.div
          className={`glass-card relative overflow-hidden transition-all duration-500 ${
            isFocused ? 'shadow-glow border-neon-blue/30' : ''
          }`}
        >
          {/* Gradient border effect on focus */}
          {isFocused && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-blue/20 via-transparent to-neon-purple/20 pointer-events-none" />
          )}
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste legal text here..."
            className="w-full h-80 bg-transparent text-foreground font-mono text-sm p-6 resize-none focus:outline-none placeholder:text-muted-foreground/50"
            spellCheck={false}
          />
          
          {/* Bottom bar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Or use sample contract below</span>
            </div>
            <button
              onClick={() => setText(SAMPLE_CONTRACT)}
              className="text-xs text-neon-blue hover:text-neon-blue/80 transition-colors"
            >
              Load sample
            </button>
          </div>
        </motion.div>

        {/* Analyze button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          className="mt-8 w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-full 
                     hover:brightness-110 transition-all duration-300 shadow-glow flex items-center justify-center gap-2
                     active:scale-95"
        >
          <span>Analyze Risk</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
