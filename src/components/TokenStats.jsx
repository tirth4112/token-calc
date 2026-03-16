import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Type, FileText, AlignLeft, DollarSign } from 'lucide-react';

export default function TokenStats({ tokens, characters, words, cost }) {
    const stats = [
        { label: 'Tokens', value: tokens, icon: Hash, color: 'text-blue-400', bg: 'from-blue-500/20 to-transparent' },
        { label: 'Words', value: words, icon: AlignLeft, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-transparent' },
        { label: 'Chars', value: characters, icon: Type, color: 'text-purple-400', bg: 'from-purple-500/20 to-transparent' },
        { label: 'Cost', value: `$${cost.toFixed(5)}`, icon: DollarSign, color: 'text-amber-400', bg: 'from-amber-500/20 to-transparent' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="relative group p-5 rounded-3xl glass-dark border border-white/5 overflow-hidden"
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity blur-2xl`} />
                    <div className="relative space-y-3">
                        <div className={`p-2.5 w-fit rounded-xl bg-slate-950/50 border border-white/5 ${stat.color}`}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
