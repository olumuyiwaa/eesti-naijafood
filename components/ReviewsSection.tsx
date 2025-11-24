
// components/ReviewsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaStar, FaUser } from 'react-icons/fa';

interface Review {
    id: number;
    name: string;
    rating: number;
    title: string;
    comment: string;
    visitDate: string;
    createdAt: string;
}

interface ReviewsSectionProps {
    limit?: number;
    showTitle?: boolean;
}

export default function ReviewsSection({ limit = 6, showTitle = true }: ReviewsSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
        fetchStats();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews?limit=${limit}`);
            setReviews(response.data.reviews);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/stats`);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center text-gray-400">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {showTitle && (
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-white mb-4"
                    >
                        What Our Customers Say
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`text-3xl ${
                                            i < Math.round(stats.averageRating) ? 'text-yellow-500' : 'text-gray-600'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-3xl font-bold text-white">{stats.averageRating}</span>
                        </div>
                        <span className="text-gray-400">Based on {stats.totalReviews} reviews</span>
                    </motion.div>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-900 rounded-2xl p-6 hover:bg-gray-850 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                                    <FaUser className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{review.name}</p>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(review.visitDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`${
                                        i < review.rating ? 'text-yellow-500' : 'text-gray-600'
                                    }`}
                                />
                            ))}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">{review.title}</h3>
                        <p className="text-gray-300 line-clamp-4">{review.comment}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}