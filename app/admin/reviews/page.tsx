// app/admin/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaStar } from 'react-icons/fa';
import axios from "axios";

interface Review {
    id: string;
    name: string;
    email: string;
    rating: number;
    title: string;
    comment: string;
    visitDate: string;
    status: string;
    createdAt: string;
}

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`);

            const requestsData = response.data.reviews.map(e => ({
                ...e,
                id: e._id
            }));


            setReviews(requestsData);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Failed to fetch reviews:', error.response?.data || error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}/approve`);
            toast.success('Review approved');
            fetchReviews();
        } catch {
            toast.error('Failed to approve review');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}/reject`);
            toast.success('Review rejected');
            fetchReviews();
        } catch {
            toast.error('Failed to reject review');
        }
    };


    const filteredReviews = reviews.filter(review => review.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-black">Reviews Management</h1>
                <div className="flex gap-2">
                    {['pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                                filter === status
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-2xl p-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{review.title}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={i < review.rating ? 'text-yellow-500' : 'text-gray-600'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-400">by {review.name}</span>
                                </div>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                                    review.status === 'approved'
                                        ? 'bg-green-600 text-white'
                                        : review.status === 'pending'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-red-600 text-white'
                                }`}
                            >
                {review.status}
              </span>
                        </div>

                        <p className="text-gray-300 mb-4">{review.comment}</p>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Visit Date: {new Date(review.visitDate).toLocaleDateString()} |
                                Submitted: {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                            {review.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(review.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
                                    >
                                        <FaCheck /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(review.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
                                    >
                                        <FaTimes /> Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}