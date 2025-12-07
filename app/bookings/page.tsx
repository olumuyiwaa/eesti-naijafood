// app/bookings/page.tsx - Updated with Payment Integration
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUsers, FaCheckCircle, FaDollarSign } from 'react-icons/fa';
import PaymentModal from '@/components/PaymentModal';
import Image from "next/image";

interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    bookingType: string;
    specialRequests?: string;
}

export default function BookingsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingRef, setBookingRef] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [bookingData, setBookingData] = useState<any>(null);
    const [depositAmount, setDepositAmount] = useState(0);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>();

    const calculateDeposit = (guests: number, bookingType: string) => {
        // Deposit calculation logic
        const baseDeposit = 20; // $20 per person
        let deposit = guests * baseDeposit;

        // Higher deposit for African Experience nights
        if (bookingType === 'african-experience') {
            deposit = deposit * 1.5;
        }

        // Special events require full deposit
        if (bookingType === 'event') {
            deposit = guests * 30;
        }

        return Math.round(deposit * 100) / 100; // Round to 2 decimal places
    };

    const onSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, data);
            const ref = response.data.bookingRef;
            setBookingRef(ref);

            // Calculate deposit amount
            const deposit = calculateDeposit(data.guests, data.bookingType);
            setDepositAmount(deposit);

            // Store booking data for payment
            setBookingData({
                bookingRef: ref,
                name: data.name,
                email: data.email,
                guests: data.guests,
                date: data.date,
                time: data.time,
                bookingType: data.bookingType
            });

            // Show payment options
            setBookingSuccess(true);
            toast.success('Booking created! Please complete payment to confirm.');
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        toast.success('Payment successful! Booking confirmed.');
    };

    const handleSkipPayment = () => {
        toast.info('Booking saved. You can pay the deposit later at the restaurant.');
        setBookingSuccess(false);
        setBookingData(null);
    };

    if (bookingSuccess && !showPayment) {
        return (
            <div className="min-h-screen bg-black text-white pt-24 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto px-4 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
                    </motion.div>
                    <h1 className="text-5xl font-bold mb-4">Booking Created!</h1>
                    <p className="text-2xl text-gray-400 mb-6">
                        Your table reservation has been created.
                    </p>

                    <div className="bg-gray-900 p-8 rounded-2xl mb-8">
                        <p className="text-lg mb-4">Your booking reference:</p>
                        <p className="text-4xl font-bold text-orange-500 mb-6">{bookingRef}</p>

                        <div className="bg-gray-800 rounded-xl p-6 mb-6">
                            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
                            <div className="space-y-2 text-left">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Date:</span>
                                    <span className="text-white">{new Date(bookingData.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Time:</span>
                                    <span className="text-white">{bookingData.time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Guests:</span>
                                    <span className="text-white">{bookingData.guests}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Type:</span>
                                    <span className="text-white capitalize">{bookingData.bookingType.replace('-', ' ')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg">Deposit Required:</span>
                                <span className="text-4xl font-bold">${depositAmount.toFixed(2)}</span>
                            </div>
                            <p className="text-sm opacity-90">
                                Secure your booking with a deposit
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => setShowPayment(true)}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <FaDollarSign /> Pay Deposit Now
                            </button>

                            <button
                                onClick={handleSkipPayment}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
                            >
                                Pay at Restaurant
                            </button>
                        </div>

                        <p className="text-gray-400 text-sm mt-4">
                            Note: Bookings without deposits may be subject to cancellation during busy periods.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setBookingSuccess(false);
                            setBookingData(null);
                        }}
                        className="text-orange-500 hover:text-orange-400 font-semibold"
                    >
                        Make Another Booking
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
                            src="/images/hero-bg.png"
                            alt="Afro Flavours Background"
                            width={500}
                            height={300}
                            style={{ height: "680px", width: "100%", objectFit: "cover" }}
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
                        Book Your Table
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl"
                    >
                        Reserve your spot for an unforgettable African dining experience
                    </motion.p>
                </div>
            </section>

            {/* Booking Form */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-3xl p-8 md:p-12"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
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
                                                message: 'Invalid email address'
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        {...register('phone', { required: 'Phone is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="+64 21 XXX XXXX"
                                    />
                                    {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-semibold mb-2 flex items-center gap-2">
                                        <FaCalendarAlt className="text-orange-500" /> Date *
                                    </label>
                                    <input
                                        type="date"
                                        {...register('date', { required: 'Date is required' })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    />
                                    {errors.date && <p className="text-red-500 mt-1">{errors.date.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2 flex items-center gap-2">
                                        <FaClock className="text-orange-500" /> Time *
                                    </label>
                                    <select
                                        {...register('time', { required: 'Time is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    >
                                        <option value="">Select time</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="11:30">11:30 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="12:30">12:30 PM</option>
                                        <option value="13:00">1:00 PM</option>
                                        <option value="17:00">5:00 PM</option>
                                        <option value="18:00">6:00 PM</option>
                                        <option value="19:00">7:00 PM</option>
                                        <option value="20:00">8:00 PM</option>
                                        <option value="21:00">9:00 PM</option>
                                    </select>
                                    {errors.time && <p className="text-red-500 mt-1">{errors.time.message}</p>}
                                </div>
                            </div>

                            {/* Guests & Type */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-lg font-semibold mb-2 flex items-center gap-2">
                                        <FaUsers className="text-orange-500" /> Guests *
                                    </label>
                                    <input
                                        type="number"
                                        {...register('guests', {
                                            required: 'Number of guests is required',
                                            min: { value: 1, message: 'At least 1 guest required' }
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="2"
                                        min="1"
                                    />
                                    {errors.guests && <p className="text-red-500 mt-1">{errors.guests.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Booking Type *</label>
                                    <select
                                        {...register('bookingType', { required: 'Booking type is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    >
                                        <option value="">Select type</option>
                                        <option value="dine-in">Regular Dine-In</option>
                                        <option value="african-experience">African Experience Night</option>
                                        <option value="event">Special Event</option>
                                    </select>
                                    {errors.bookingType && <p className="text-red-500 mt-1">{errors.bookingType.message}</p>}
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Special Requests (Optional)</label>
                                <textarea
                                    {...register('specialRequests')}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="Dietary requirements, celebration occasions, seating preferences..."
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? 'Creating Booking...' : 'Continue to Payment'}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Payment Modal */}
            {showPayment && bookingData && (
                <PaymentModal
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    amount={depositAmount}
                    reference={bookingData.bookingRef}
                    type="booking"
                    customerInfo={{
                        name: bookingData.name,
                        email: bookingData.email
                    }}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}