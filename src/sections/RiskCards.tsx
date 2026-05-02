import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';

export interface RiskItem {
  id: number;
  clause: string;
  category: string;
  severity: 'high' | 'moderate' | 'low';
  explanation: string;
}

interface RiskCardsProps {
  risks: RiskItem[];
  isVisible: boolean;
}

const severityConfig = {
  high: {
    color: '#EF4444',
    bgGlow: 'rgba(239, 68, 68, 0.15)',
    borderGlow: 'rgba(239, 68, 68, 0.4)',
    icon: <XCircle className="w-4 h-4" />,
    label: 'HIGH RISK',
  },
  moderate: {
    color: '#F59E0B',
    bgGlow: 'rgba(245, 158, 11, 0.15)',
    borderGlow: 'rgba(245, 158, 11, 0.4)',
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'MODERATE',
  },
  low: {
    color: '#10B981',
    bgGlow: 'rgba(16, 185, 129, 0.15)',
    borderGlow: 'rgba(16, 185, 129, 0.4)',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'LOW RISK',
  },
};

export const SAMPLE_RISKS: RiskItem[] = [
  {
    id: 1,
    clause: "The Contractor shall indemnify, defend, and hold harmless the Company from any and all claims, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or resulting from the performance of the Services, regardless of whether such claims are attributable to the negligence of the Company.",
    category: "Indemnification",
    severity: "high",
    explanation: "This broad indemnification clause requires you to cover the company even for their own negligence, which is heavily one-sided and exposes you to unlimited liability."
  },
  {
    id: 2,
    clause: "Company may terminate this Agreement immediately and without prior notice for any reason whatsoever, including but not limited to convenience.",
    category: "Termination",
    severity: "high",
    explanation: "Termination for convenience with no notice period means you have no income security and can be dropped at any time without cause or compensation."
  },
  {
    id: 3,
    clause: "All work product, including but not limited to code, designs, documentation, and inventions created during the term of this Agreement shall be the exclusive property of the Company.",
    category: "Intellectual Property",
    severity: "moderate",
    explanation: "While common in work-for-hire agreements, this clause gives away all IP rights without carve-outs for your background inventions or portfolio rights."
  },
  {
    id: 4,
    clause: "Contractor agrees that for a period of five (5) years following termination of this Agreement, Contractor shall not directly or indirectly engage in any business that competes with the Company's business within a radius of 500 miles from any location where the Company operates.",
    category: "Non-Compete",
    severity: "high",
    explanation: "A 5-year non-compete with a 500-mile radius is excessively broad and may be unenforceable, but could still severely restrict your career mobility."
  },
];

export default function RiskCards({ risks, isVisible }: RiskCardsProps) {
  if (!isVisible) return null;

  return (
    <section className="relative py-20 px-4 bg-obsidian">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14 max-w-3xl mx-auto"
      >
        <span className="font-mono text-sm text-neon-blue tracking-widest uppercase">RISK BREAKDOWN</span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
          Identified Risk Factors
        </h2>
        <p className="text-muted-foreground mt-3">
          Our AI flagged these clauses for your review. Each card shows the severity level and explains the concern.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((risk, index) => {
          const config = severityConfig[risk.severity];
          
          return (
            <motion.div
              key={risk.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative group cursor-pointer"
            >
              {/* Card */}
              <div 
                className="relative p-6 rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${config.borderGlow}`,
                }}
              >
                {/* Inner glow on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at center, ${config.bgGlow} 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider"
                      style={{
                        background: `${config.color}15`,
                        color: config.color,
                        border: `1px solid ${config.color}30`,
                      }}
                    >
                      {config.icon}
                      <span>{config.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{risk.category}</span>
                  </div>

                  {/* Clause excerpt */}
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4 line-clamp-4">
                    "{risk.clause.substring(0, 180)}..."
                  </p>

                  {/* Explanation */}
                  <div 
                    className="p-3 rounded-xl text-xs leading-relaxed"
                    style={{
                      background: `${config.color}08`,
                      border: `1px solid ${config.color}15`,
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    <span className="font-semibold" style={{ color: config.color }}>Why this matters: </span>
                    {risk.explanation}
                  </div>

                  {/* Expand hint */}
                  <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View full clause</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
