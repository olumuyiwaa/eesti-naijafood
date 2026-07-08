'use client';

import { motion } from 'framer-motion';
import ReviewForm from '@/components/ReviewForm';
import Image from 'next/image';

export default function ReviewFormPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-20">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/background.jpg"
                        alt="Myrosfood restaurant ambiance"
                        fill
                        className="object-cover"
                        priority
                        quality={85}
                    />
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,146,60,0.15),transparent_70%)]" />

                {/* Content */}
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                            Share Your Experience
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                            Your feedback helps us serve you better
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Review Form Section */}
            <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white rounded-3xl shadow-2xl p-6 md:p-4 border border-gray-100"
                >
                    <ReviewForm />
                </motion.div>
            </div>

            {/* Thank You Footer */}
            <div className="text-center pb-12 px-6">
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                    Thank you for taking the time to review us{' '}
                    <span className="text-orange-500">❤️</span>
                </p>
            </div>
        </div>
    );
}