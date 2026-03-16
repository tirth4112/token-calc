import React from 'react';
import { motion } from 'framer-motion';
import { Target, Info } from 'lucide-react';

export default function QualityScore({ result }) {
    const { score, breakdown } = result;

    const getScoreColor = (s) => {
        if (s >= 80) return 'from-emerald-400 to-teal-500';
        if (s >= 60) return 'from-amber-400 to-orange-500';
        return 'from-rose-400 to-red-500';
    };

    return (
        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Target size={120} className="text-white" />
            </div>

            <div className="relative flex flex-col items-center mb-10 text-center">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                    <Info size={14} className="text-indigo-400" />
                    Quality Assessment
                </div>
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`text-8xl font-black bg-gradient-to-br ${getScoreColor(score)} bg-clip-text text-transparent drop-shadow-2xl`}
                    >
                        {score}
                    </motion.div>
                    <div className="absolute -top-4 -right-8 text-2xl font-bold text-slate-700">/100</div>
                </div>
                <p className="text-slate-400 font-medium mt-4">Calculated based on structure & intent</p>
            </div>

            <div className="space-y-6">
                {Object.entries(breakdown).map(([key, value], i) => (
                    <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-sm font-bold text-slate-300 capitalize tracking-wide">{key}</span>
                            <span className="text-xs font-black text-white px-2 py-0.5 rounded-md bg-white/5">{value}/25</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-950/50 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(value / 25) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 + (0.1 * i), ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${getScoreColor(value * 4)} rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
