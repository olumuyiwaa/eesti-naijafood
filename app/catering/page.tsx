// app/catering/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import {FaUsers, FaUtensils, FaCheckCircle, FaUpload, FaDownload} from 'react-icons/fa';
import Image from "next/image";

interface CateringFormData {
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    eventType: string;
    guestCount: number;
    venue: string;
    menuPreferences?: string;
    specialRequirements?: string;
    budget?: string;
}

interface Package {
    id: number;
    name: string;
    description: string;
    minGuests: number;
    maxGuests: number;
    pricePerPerson: number;
    includes: string[];
}

export default function CateringPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quoteSuccess, setQuoteSuccess] = useState(false);
    const [quoteRef, setQuoteRef] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CateringFormData>();

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/catering/packages`);
            setPackages(response.data.packages);
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        }
    };

    const onSubmit = async (data: CateringFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            if (selectedFile) {
                formData.append('attachment', selectedFile);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/catering/quote`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            setQuoteRef(response.data.quoteRef);
            setQuoteSuccess(true);
            toast.success('Quote request submitted! We\'ll contact you within 24-48 hours.');
            reset();
            setSelectedFile(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit quote request');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    if (quoteSuccess) {
        return (
            <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto px-4 text-center"
                >
                    <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
                    <h1 className="text-5xl font-bold mb-4">Quote Request Received!</h1>
                    <p className="text-2xl text-gray-400 mb-6">
                        We've received your catering quote request.
                    </p>
                    <div className="bg-gray-900 p-8 rounded-2xl mb-8">
                        <p className="text-lg mb-4">Your reference number:</p>
                        <p className="text-4xl font-bold text-orange-500 mb-4">{quoteRef}</p>
                        <p className="text-gray-400">
                            Our team will review your request and get back to you within 24-48 hours with a detailed quote.
                        </p>
                    </div>
                    <button
                        onClick={() => setQuoteSuccess(false)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold transition-all"
                    >
                        Submit Another Request
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24">
            {/* Header */}
            <section className="relative py-16 bg-gradient-to-br from-orange-600 to-red-700 text-center overflow-hidden">

                {/* Background Image */}
                <div className="absolute inset-0 h-full">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/background.jpg"
                            alt="Afro Flavours Background"
                            width={500}
                            height={300}
                            style={{ height: "380px", width: "100%", objectFit: "cover" }}
                            priority
                        />

                    </div>
                </div>

                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-bold mb-4"
                    >
                        Catering Services
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl"
                    >
                        Bring authentic African flavors to your special event
                    </motion.p>
                </div>
            </section>

            {/* Event Types */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
                    >
                        Events We Cater
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '🏢', title: 'Corporate Events', description: 'Office parties, team building, conferences' },
                            { icon: '💍', title: 'Weddings', description: 'Make your special day unforgettable' },
                            { icon: '🎂', title: 'Birthdays', description: 'Celebrate with authentic African cuisine' },
                            { icon: '🎪', title: 'Festivals', description: 'Community events and cultural celebrations' },
                            { icon: '🎓', title: 'Graduations', description: 'Honor achievements with great food' },
                            { icon: '🎉', title: 'Private Events', description: 'Any occasion worth celebrating' }
                        ].map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition-all"
                            >
                                <div className="text-6xl mb-4">{event.icon}</div>
                                <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                                <p className="text-gray-400">{event.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
                    >
                        Catering Packages
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {packages.map((pkg, index) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl border-2 border-gray-700 hover:border-orange-500 transition-all"
                            >
                                <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>
                                <p className="text-gray-400 mb-4">{pkg.description}</p>
                                <div className="text-4xl font-bold text-orange-500 mb-4">
                                    ${pkg.pricePerPerson}
                                    <span className="text-lg text-gray-400">/person</span>
                                </div>
                                <p className="text-gray-400 mb-6">
                                    {pkg.minGuests} - {pkg.maxGuests} guests
                                </p>
                                <div className="space-y-3 mb-8">
                                    {pkg.includes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-gray-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all">
                                    Request Quote
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote Form */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-8"
                    >
                        Request a Quote
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-center text-gray-400 mb-12"
                    >
                        Fill out the form below and we'll get back to you with a custom quote
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 rounded-3xl p-8 md:p-12"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Email & Phone */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-semibold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email'
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        {...register('phone', { required: 'Phone is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="+64 21 XXX XXXX"
                                    />
                                    {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>

                            {/* Event Date & Type */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-semibold mb-2">Event Date *</label>
                                    <input
                                        type="date"
                                        {...register('eventDate', { required: 'Event date is required' })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                    />
                                    {errors.eventDate && <p className="text-red-500 mt-1">{errors.eventDate.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Event Type *</label>
                                    <select
                                        {...register('eventType', { required: 'Event type is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                    >
                                        <option value="">Select event type</option>
                                        <option value="corporate">Corporate Event</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="birthday">Birthday</option>
                                        <option value="festival">Festival</option>
                                        <option value="community">Community Event</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.eventType && <p className="text-red-500 mt-1">{errors.eventType.message}</p>}
                                </div>
                            </div>

                            {/* Guest Count & Venue */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-semibold mb-2">Number of Guests *</label>
                                    <input
                                        type="number"
                                        {...register('guestCount', {
                                            required: 'Guest count is required',
                                            min: { value: 10, message: 'Minimum 10 guests' }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="50"
                                        min="10"
                                    />
                                    {errors.guestCount && <p className="text-red-500 mt-1">{errors.guestCount.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Venue *</label>
                                    <input
                                        type="text"
                                        {...register('venue', { required: 'Venue is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="Event location"
                                    />
                                    {errors.venue && <p className="text-red-500 mt-1">{errors.venue.message}</p>}
                                </div>
                            </div>

                            {/* Menu Preferences */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Menu Preferences (Optional)</label>
                                <textarea
                                    {...register('menuPreferences')}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="Any specific dishes or dietary requirements?"
                                />
                            </div>

                            {/* Special Requirements */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Special Requirements (Optional)</label>
                                <textarea
                                    {...register('specialRequirements')}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="Setup needs, equipment, timing, etc."
                                />
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Budget Range (Optional)</label>
                                <input
                                    type="text"
                                    {...register('budget')}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="e.g., $2000 - $3000"
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Attach File (Optional)</label>
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-orange-500 transition-all">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <FaUpload className="text-4xl text-gray-500 mx-auto mb-2" />
                                        <p className="text-gray-400">
                                            {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                                        </p>
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Request Quote'}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}