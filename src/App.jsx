import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PromptInput from './components/PromptInput';
import TokenStats from './components/TokenStats';
import QualityScore from './components/QualityScore';
import Suggestions from './components/Suggestions';
import OptimizedPrompt from './components/OptimizedPrompt';
import { countTokens, getCharCount, getWordCount, estimateCost } from './utils/tokenizer';
import { analyzePrompt } from './utils/promptAnalyzer';
import { Sparkles, Cpu, Zap, Shield, BarChart3, Loader2 } from 'lucide-react';

const EXAMPLES = [
  "Act as a senior DevOps engineer and explain the benefits of Kubernetes to a non-technical stakeholder.",
  "Write a professional email to my boss asking for a salary increment based on my recent performance in Project Alpha.",
  "Create a Python script that scrapes headlines from a news website and saves them to a CSV file. Use BeautifulSoup.",
  "You are a fitness coach. Create a 7-day workout plan for a beginner who wants to lose weight and has no gym equipment."
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [stats, setStats] = useState({
    tokens: 0,
    words: 0,
    chars: 0,
    cost: 0
  });
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Live counter
  useEffect(() => {
    const tokens = countTokens(prompt);
    setStats({
      tokens,
      words: getWordCount(prompt),
      chars: getCharCount(prompt),
      cost: estimateCost(tokens)
    });
  }, [prompt]);

  const handleAnalyze = async () => {
    if (!prompt.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzePrompt(prompt);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-indigo-500/30">
      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 md:mb-20"
        >
          <div className="flex items-center gap-5">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/20 text-white"
            >
              <Cpu size={36} className="animate-pulse" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
                Prompt<span className="text-indigo-500">Lens</span>
                <Sparkles className="text-amber-400" size={24} />
              </h1>
              <p className="text-slate-400 font-medium text-lg">Next-gen prompt engineering & token analysis studio.</p>
            </div>
          </div>
          <div className="flex gap-4">
            {[
              { icon: Zap, label: 'Fast' },
              { icon: Shield, label: 'Secure' },
              { icon: BarChart3, label: 'Precise' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300">
                <feature.icon size={14} className="text-indigo-400" />
                {feature.label}
              </div>
            ))}
          </div>
        </motion.header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="glass-dark p-1 rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="bg-slate-900/40 p-6 md:p-8 rounded-[1.9rem]">
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  onAnalyze={handleAnalyze}
                  onReset={handleReset}
                  examples={EXAMPLES}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </div>

            <TokenStats
              tokens={stats.tokens}
              words={stats.words}
              characters={stats.chars}
              cost={stats.cost}
            />
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8"
                >
                  <OptimizedPrompt
                    prompt={analysis.optimizedPrompt}
                    estimatedTime={analysis.estimatedTime}
                  />
                  <QualityScore result={analysis} />
                  <Suggestions suggestions={analysis.suggestions} />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center glass-dark rounded-[2rem] border-2 border-dashed border-white/10"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                    <div className="relative w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                      {isAnalyzing ? <Loader2 size={48} className="animate-spin" /> : <Cpu size={48} />}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {isAnalyzing ? 'Analyzing Intent...' : 'Awaiting Input'}
                  </h3>
                  <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
                    {isAnalyzing
                      ? 'Gemini AI is crafting the perfect optimized version of your prompt...'
                      : 'Elevate your interaction with AI. Enter your prompt to unlock deep structural insights and token metrics.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>

        <footer className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 font-medium">
            Designed for the future of AI. Private, local, and lightning fast.
          </p>
        </footer>
      </div>
    </div>
  );
}
