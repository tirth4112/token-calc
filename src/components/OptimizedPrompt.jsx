import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Copy, Clock, Check } from 'lucide-react';
import { countTokens } from '../utils/tokenizer';

export default function OptimizedPrompt({ prompt, estimatedTime }) {
    const [copied, setCopied] = React.useState(false);
    const tokens = countTokens(prompt);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!prompt) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap size={120} className="text-white" />
            </div>

            <div className="relative flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-[0.2em]">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                            <Zap size={16} />
                        </div>
                        AI Optimized Prompt
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Clock size={14} className="text-indigo-400" />
                            Est. Time: <span className="text-slate-200">{estimatedTime}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-400">
                            <span className="text-indigo-400">{tokens}</span> tokens
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="relative p-5 bg-slate-950/50 border border-white/5 rounded-2xl text-slate-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {prompt}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopy}
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold transition-all ${copied
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                        }`}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied to Clipboard' : 'Copy Optimized Prompt'}
                </motion.button>
            </div>
        </motion.div>
    );
}
