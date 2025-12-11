// components/PaymentModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes, FaLock, FaCreditCard } from 'react-icons/fa';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    reference: string;
    type: 'booking' | 'catering';
    customerInfo: {
        name: string;
        email: string;
        eventDate?: string;
    };
    onSuccess: () => void;
}

function CheckoutForm({
                          amount,
                          reference,
                          type,
                          customerInfo,
                          onSuccess,
                          onClose
                      }: Omit<PaymentModalProps, 'isOpen'>) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements || loadError) {
            return;
        }

        setIsProcessing(true);
        setMessage('');

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                    receipt_email: customerInfo.email,
                },
                redirect: 'if_required'
            });

            if (error) {
                setMessage(error.message || 'Payment failed');
                toast.error(error.message || 'Payment failed');
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                toast.success('Payment successful!');
                onSuccess();
                onClose();
            }
        } catch (error: any) {
            setMessage(error.message || 'An error occurred');
            toast.error('Payment processing failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Reference:</span>
                    <span className="text-white font-mono">{reference}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white capitalize">{type} Deposit</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-3xl font-bold text-orange-500">
            ${amount.toFixed(2)} NZD
          </span>
                </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
                <PaymentElement
                    onReady={() => {
                        console.log('PaymentElement ready');
                        setIsReady(true);
                    }}
                    onLoadError={(event) => {
                        console.error('PaymentElement load error:', event);
                        let errorMessage = 'Failed to load payment form. Please try again later.';
                        if (event.error && event.error.message) {
                            errorMessage = event.error.message;
                        }
                        setLoadError(errorMessage);
                        toast.error(errorMessage);
                    }}
                />
            </div>

            {loadError && (
                <div className="bg-red-600/20 border border-red-600 text-red-400 rounded-lg p-4">
                    {loadError}
                </div>
            )}

            {message && (
                <div className="bg-red-600/20 border border-red-600 text-red-400 rounded-lg p-4">
                    {message}
                </div>
            )}

            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FaLock />
                <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={!stripe || !elements || !isReady || isProcessing || !!loadError}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-6 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <FaCreditCard />
                            Pay ${amount.toFixed(2)}
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isProcessing}
                    className="px-6 py-4 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg font-semibold transition-all"
                >
                    Cancel
                </button>
            </div>

            <p className="text-center text-gray-500 text-sm">
                Powered by Stripe - Secure Payment Processing
            </p>
        </form>
    );
}

export default function PaymentModal({
                                         isOpen,
                                         onClose,
                                         amount,
                                         reference,
                                         type,
                                         customerInfo,
                                         onSuccess
                                     }: PaymentModalProps) {
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            createPaymentIntent();
        }
    }, [isOpen]);

    const createPaymentIntent = async () => {
        setLoading(true);
        try {
            const endpoint = type === 'booking'
                ? '/api/payments/create-booking-payment'
                : '/api/payments/create-catering-payment';

            const payload = type === 'booking'
                ? {
                    bookingRef: reference,
                    amount,
                    email: customerInfo.email,
                    name: customerInfo.name
                }
                : {
                    quoteRef: reference,
                    amount,
                    email: customerInfo.email,
                    name: customerInfo.name,
                    eventDate: customerInfo.eventDate
                };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
                payload
            );

            console.log('Payment intent response:', response.data);
            if (!response.data.clientSecret) {
                throw new Error('No client secret received from server');
            }
            setClientSecret(response.data.clientSecret);
        } catch (error: any) {
            console.error('Payment intent creation failed:', error);
            let errorMessage = 'Failed to initialize payment';
            if (error.response?.data?.message) {
                errorMessage += `: ${error.response.data.message}`;
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }
            toast.error(errorMessage);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const appearance = {
        theme: 'night' as const,
        variables: {
            colorPrimary: '#ea580c',
            colorBackground: '#1f2937',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
        },
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Secure Payment</h2>
                        <p className="text-gray-400 mt-1">Complete your {type} deposit</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        <FaTimes />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-gray-400">Initializing secure payment...</p>
                    </div>
                ) : clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                        <CheckoutForm
                            amount={amount}
                            reference={reference}
                            type={type}
                            customerInfo={customerInfo}
                            onSuccess={onSuccess}
                            onClose={onClose}
                        />
                    </Elements>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-red-500">Failed to initialize payment</p>
                        <button
                            onClick={onClose}
                            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}