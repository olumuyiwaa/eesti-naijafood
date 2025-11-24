// app/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaStar, FaFilter } from 'react-icons/fa';
import ReviewsSection from '@/components/ReviewsSection';
import ReviewForm from '@/components/ReviewForm';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        [key: number]: number;
    };
    categories: {
        food: number;
        service: number;
        ambience: number;
        value: number;
    };
}

export default function ReviewsPage() {
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/stats`);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24">
            {/* Header */}
            <section className="py-16 bg-gradient-to-br from-orange-600 to-red-700 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-bold mb-4"
                >
                    Customer Reviews
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl"
                >
                    See what our customers are saying about us
                </motion.p>
            </section>

            {/* Featured Testimonials Carousel */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-center mb-12"
                    >
                        Featured Reviews
                    </motion.h2>
                    <TestimonialsCarousel />
                </div>
            </section>

            {/* Stats Section */}
            {stats && (
                <section className="py-20 bg-gray-900">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Overall Rating */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-8 text-center text-white"
                            >
                                <p className="text-lg mb-2">Overall Rating</p>
                                <p className="text-6xl font-bold mb-2">{stats.averageRating}</p>
                                <div className="flex justify-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`text-2xl ${
                                                i < Math.round(stats.averageRating) ? 'text-yellow-300' : 'text-white/30'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm opacity-90">{stats.totalReviews} reviews</p>
                            </motion.div>

                            {/* Category Ratings */}
                            {Object.entries(stats.categories).map(([category, rating], index) => (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-800 rounded-2xl p-6"
                                >
                                    <p className="text-gray-400 mb-2 capitalize">{category}</p>
                                    <div className="flex items-end gap-2 mb-2">
                                        <p className="text-4xl font-bold text-white">{rating}</p>
                                        <p className="text-gray-400 mb-1">/5</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={`${
                                                    i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Rating Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-800 rounded-2xl p-8 mt-8"
                        >
                            <h3 className="text-2xl font-bold mb-6">Rating Distribution</h3>
                            <div className="space-y-4">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = stats.ratingDistribution[rating] || 0;
                                    const percentage = stats.totalReviews > 0
                                        ? (count / stats.totalReviews) * 100
                                        : 0;

                                    return (
                                        <div key={rating} className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 w-24">
                                                <span className="text-white font-semibold">{rating}</span>
                                                <FaStar className="text-yellow-500" />
                                            </div>
                                            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${percentage}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className="h-full bg-orange-600"
                                                />
                                            </div>
                                            <span className="text-gray-400 w-16 text-right">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* All Reviews Section */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-bold">All Reviews</h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                {showForm ? 'Hide Form' : 'Write a Review'}
                            </button>
                        </div>
                    </div>

                    {/* Review Form */}
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-12"
                        >
                            <ReviewForm />
                        </motion.div>
                    )}

                    {/* Reviews Grid */}
                    <ReviewsSection limit={50} showTitle={false} />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-orange-600 to-red-700 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold mb-6">Ready to Experience It Yourself?</h2>
                        <p className="text-2xl mb-8">
                            Join our happy customers and discover authentic African flavors!
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <a href="/bookings">
                                <button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all">
                                    Book a Table
                                </button>
                            </a>
                            <a href="/menu">
                                <button className="bg-white/10 backdrop-blur-sm border-2 border-white hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all">
                                    View Menu
                                </button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
