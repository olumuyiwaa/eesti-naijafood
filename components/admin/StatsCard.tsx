// components/admin/StatsCard.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
    change?: string;
}

export function StatsCard({ title, value, icon, color, change }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{icon}</div>
                {change && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
            {change}
          </span>
                )}
            </div>
            <h3 className="text-lg opacity-90 mb-1">{title}</h3>
            <p className="text-4xl font-bold">{value}</p>
        </motion.div>
    );
}