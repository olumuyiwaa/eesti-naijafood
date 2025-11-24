
// components/ReviewForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

interface ReviewFormData {
    name: string;
    email: string;
    rating: number;
    title: string;
    comment: string;
    visitDate?: string;
}

export default function ReviewForm() {
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ReviewFormData>();

    const onSubmit = async (data: ReviewFormData) => {
        if (selectedRating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
                ...data,
                rating: selectedRating
            });
            toast.success('Thank you for your review! It will be published after moderation.');
            setSubmitted(true);
            reset();
            setSelectedRating(0);
        } catch (error) {
            toast.error('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 rounded-2xl p-8 text-center"
            >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-white mb-4">Thank You!</h3>
                <p className="text-gray-300 mb-6">
                    Your review has been submitted and will be published after moderation.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
                >
                    Submit Another Review
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-2xl p-8"
        >
            <h3 className="text-3xl font-bold text-white mb-6">Leave a Review</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-white font-semibold mb-2">Name *</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                            placeholder="Your name"
                        />
                        {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2">Email *</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email'
                                }
                            })}
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                            placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-white font-semibold mb-2">Rating *</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => setSelectedRating(rating)}
                                onMouseEnter={() => setHoveredRating(rating)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="text-4xl transition-all"
                            >
                                <FaStar
                                    className={
                                        rating <= (hoveredRating || selectedRating)
                                            ? 'text-yellow-500'
                                            : 'text-gray-600'
                                    }
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-white font-semibold mb-2">Review Title *</label>
                    <input
                        {...register('title', { required: 'Title is required' })}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                        placeholder="Sum up your experience"
                    />
                    {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-white font-semibold mb-2">Your Review *</label>
                    <textarea
                        {...register('comment', {
                            required: 'Review is required',
                            minLength: { value: 20, message: 'Review must be at least 20 characters' }
                        })}
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                        placeholder="Tell us about your experience..."
                    />
                    {errors.comment && <p className="text-red-500 mt-1">{errors.comment.message}</p>}
                </div>

                <div>
                    <label className="block text-white font-semibold mb-2">Visit Date (Optional)</label>
                    <input
                        type="date"
                        {...register('visitDate')}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </motion.div>
    );
}