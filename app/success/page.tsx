'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-white/10 rounded-3xl p-10 max-w-lg w-full text-center"
            >
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />

                <h1 className="text-4xl font-bold mb-4">
                    Payment Successful 🎉
                </h1>

                <p className="text-gray-400 mb-6">
                    Thank you for your order! Your delicious African meal is being prepared.
                </p>

                {orderId && (
                    <p className="text-sm text-gray-500 mb-8">
                        Order ID: <span className="text-orange-500">{orderId}</span>
                    </p>
                )}

                <Link href="/menu">
                    <button className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-full font-bold transition-all">
                        Order More Food
                    </button>
                </Link>
            </motion.div>
        </div>
    );
}
