// components/PaymentSuccess.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const paymentIntentId = searchParams.get('payment_intent');
        if (paymentIntentId) {
            fetchPaymentDetails(paymentIntentId);
        }
    }, [searchParams]);

    const fetchPaymentDetails = async (paymentIntentId: string) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/payments/payment/${paymentIntentId}`
            );
            setPaymentDetails(response.data.payment);
        } catch (error) {
            console.error('Failed to fetch payment details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-gray-900 rounded-2xl p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                >
                    <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
                </motion.div>

                <h1 className="text-5xl font-bold text-white mb-4">Payment Successful!</h1>
                <p className="text-2xl text-gray-400 mb-8">
                    Your payment has been processed successfully.
                </p>

                {paymentDetails && (
                    <div className="bg-gray-800 rounded-xl p-6 mb-8 text-left">
                        <h2 className="text-xl font-bold text-white mb-4">Payment Details</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Payment ID:</span>
                                <span className="text-white font-mono text-sm">{paymentDetails.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Amount:</span>
                                <span className="text-white font-bold">${paymentDetails.amount.toFixed(2)} NZD</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status:</span>
                                <span className="text-green-500 font-semibold capitalize">{paymentDetails.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Reference:</span>
                                <span className="text-white font-mono">
                  {paymentDetails.metadata.bookingRef || paymentDetails.metadata.quoteRef}
                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-4 mb-8">
                    <p className="text-blue-300">
                        A confirmation email has been sent to your email address.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/" className="flex-1">
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                            <FaHome /> Return to Home
                        </button>
                    </Link>
                    <Link href="/bookings" className="flex-1">
                        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-lg font-semibold transition-all">
                            View My Bookings
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}