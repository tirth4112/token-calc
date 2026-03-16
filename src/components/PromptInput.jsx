import React from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Play, Sparkles, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function PromptInput({ value, onChange, onAnalyze, onReset, examples, isAnalyzing }) {
    const handleExample = () => {
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        onChange(randomExample);
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} className="text-indigo-400" />
                        Prompt Composer
                    </label>
                    <p className="text-xs text-slate-500 font-medium">Clear instructions lead to better AI results.</p>
                </div>
                <div className="flex gap-3">
                    <motion.button
                        disabled={isAnalyzing}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExample}
                        className="text-xs font-bold px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Roll Example
                    </motion.button>
                    <motion.button
                        disabled={isAnalyzing}
                        whileHover={{ scale: 1.1, color: '#f8fafc' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            navigator.clipboard.writeText(value);
                            // Add toast logic here if needed
                        }}
                        className="p-2 text-slate-500 transition-colors disabled:opacity-50"
                        title="Copy Prompt"
                    >
                        <Copy size={18} />
                    </motion.button>
                </div>
            </div>

            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
                <textarea
                    disabled={isAnalyzing}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Describe your task with precision..."
                    className="relative w-full h-80 p-6 text-lg bg-slate-950/50 border border-white/5 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:ring-0 focus:border-indigo-500/50 transition-all outline-none resize-none font-mono leading-relaxed disabled:opacity-50"
                />
            </div>

            <div className="flex gap-4">
                <motion.button
                    disabled={isAnalyzing || !value.trim()}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAnalyze}
                    className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAnalyzing ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Play size={20} fill="currentColor" />
                    )}
                    {isAnalyzing ? 'Crafting Optimizations...' : 'Analyze Intent'}
                </motion.button>
                <motion.button
                    disabled={isAnalyzing}
                    whileHover={{ rotate: -90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onReset}
                    className="p-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl border border-white/10 transition-all disabled:opacity-50"
                >
                    <RotateCcw size={20} />
                </motion.button>
            </div>
        </div>
    );
}
