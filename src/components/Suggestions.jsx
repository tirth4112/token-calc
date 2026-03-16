import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Suggestions({ suggestions }) {
    if (suggestions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem] flex items-center gap-6"
            >
                <div className="p-4 bg-emerald-500 rounded-[1.2rem] text-white shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 size={28} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-white mb-1 tracking-tight">Prime Composition</h3>
                    <p className="text-emerald-400/80 font-medium">Your prompt adheres to top-tier structural standards.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2 px-2">
                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                    <Lightbulb size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Optimizations Found</h3>
            </div>
            <div className="grid gap-3">
                {suggestions.map((suggestion, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ x: 8 }}
                        className="group flex items-start gap-4 p-5 glass-dark border border-white/5 rounded-2xl hover:bg-white/5 transition-all text-slate-300"
                    >
                        <div className="mt-1 flex-shrink-0 p-1 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <ChevronRight size={14} />
                        </div>
                        <span className="text-sm md:text-base font-medium leading-relaxed group-hover:text-white transition-colors">{suggestion}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
