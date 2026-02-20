// components/TestimonialsCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Testimonial {
    id: number;
    name: string;
    rating: number;
    title: string;
    comment: string;
    visitDate: string;
    image?: string;
}

export default function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        // Mock testimonials data
        setTestimonials([
            {
                id: 1,
                name: 'Kristiina L.',
                rating: 5,
                title: 'Outstanding Catering Service in Tallinn!',
                comment: 'We hired Eesti-NaijaFood for our corporate event in Tallinn and the experience was exceptional. The Jollof rice and grilled chicken were a huge hit with our guests. Professional service, beautiful presentation, and unforgettable flavors. Highly recommended!',
                visitDate: '2026-01-18'
            },
            {
                id: 2,
                name: 'Michael O.',
                rating: 5,
                title: 'Authentic Taste Delivered to My Door',
                comment: 'I ordered online and the food arrived fresh, well-packaged, and full of authentic West African flavor. The egusi soup tasted just like home. So happy to have this in Estonia!',
                visitDate: '2026-01-10'
            },
            {
                id: 3,
                name: 'Aisha T.',
                rating: 5,
                title: 'Perfect for Celebrations',
                comment: 'Eesti-NaijaFood catered my birthday party in Tallinn and everything was perfect — from the flavorful dishes to the beautiful custom cake. My guests are still talking about it!',
                visitDate: '2025-12-22'
            }
        ]);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying || testimonials.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAutoPlaying(false);
    };

    if (testimonials.length === 0) return null;

    const currentTestimonial = testimonials[currentIndex];

    return (
        <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 relative"
                >
                    <FaQuoteLeft className="text-6xl text-orange-500/20 absolute top-8 left-8" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`text-2xl ${
                                        i < currentTestimonial.rating ? 'text-yellow-500' : 'text-gray-600'
                                    }`}
                                />
                            ))}
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-4">
                            {currentTestimonial.title}
                        </h3>

                        <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                            "{currentTestimonial.comment}"
                        </p>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold text-lg">
                                    {currentTestimonial.name}
                                </p>
                                <p className="text-gray-400">
                                    Visited {new Date(currentTestimonial.visitDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full transition-all shadow-lg z-20"
                aria-label="Previous testimonial"
            >
                <FaChevronLeft />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full transition-all shadow-lg z-20"
                aria-label="Next testimonial"
            >
                <FaChevronRight />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentIndex(index);
                            setIsAutoPlaying(false);
                        }}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === currentIndex ? 'bg-orange-600 w-8' : 'bg-gray-600'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}