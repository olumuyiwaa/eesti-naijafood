// app/admin/payments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    FaDollarSign,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaUndo,
    FaEye,
    FaDownload
} from 'react-icons/fa';

interface Payment {
    id: string;
    amount: number;
    status: string;
    currency: string;
    customer: string;
    email: string;
    reference: string;
    type: string;
    created: string;
}

interface PaymentStats {
    totalRevenue: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
    refundedAmount: number;
    bookingDeposits: number;
    cateringDeposits: number;
}

export default function AdminPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [stats, setStats] = useState<PaymentStats | null>(null);
    const [filter, setFilter] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
        fetchStats();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/admin/payments`);
            console.log('Raw payments data:', response.data.payments); // Add this line
            toast(response.data.payments); // Add this line
            setPayments(response.data.payments);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };


    const fetchStats = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/admin/payment-stats`);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleRefund = async () => {
        if (!selectedPayment || !refundAmount) {
            toast.error('Please enter a refund amount');
            return;
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/refund`, {
                paymentIntentId: selectedPayment.id,
                amount: parseFloat(refundAmount),
                reason: 'requested_by_customer'
            });

            toast.success('Refund processed successfully');
            setShowRefundModal(false);
            setRefundAmount('');
            setSelectedPayment(null);
            fetchPayments();
            fetchStats();
        } catch (error) {
            toast.error('Failed to process refund');
            console.error(error);
        }
    };

    const exportToCSV = () => {
        const csv = [
            ['Payment ID', 'Date', 'Customer', 'Email', 'Reference', 'Type', 'Amount', 'Status'].join(','),
            ...payments.map(p => [
                p.id,
                new Date(p.created).toLocaleDateString(),
                p.customer,
                p.email,
                p.reference,
                p.type,
                p.amount,
                p.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const filteredPayments = filter === 'all'
        ? payments
        : payments.filter(p => p.status === filter);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'succeeded': return <FaCheckCircle className="text-green-500" />;
            case 'failed': return <FaTimesCircle className="text-red-500" />;
            default: return <FaClock className="text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'succeeded': return 'bg-green-600';
            case 'failed': return 'bg-red-600';
            default: return 'bg-yellow-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-black">Payment Management</h1>
                <button
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                    <FaDownload /> Export CSV
                </button>
            </div>

            {/* Stats Dashboard */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-white"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <FaDollarSign className="text-4xl" />
                        </div>
                        <p className="text-lg opacity-90 mb-1">Total Revenue</p>
                        <p className="text-4xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                        <p className="text-sm opacity-75 mt-2">Last 30 days</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <FaCheckCircle className="text-4xl" />
                        </div>
                        <p className="text-lg opacity-90 mb-1">Successful Payments</p>
                        <p className="text-4xl font-bold">{stats.successfulPayments}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 text-white"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <FaDollarSign className="text-4xl" />
                        </div>
                        <p className="text-lg opacity-90 mb-1">Booking Deposits</p>
                        <p className="text-4xl font-bold">${stats.bookingDeposits.toFixed(2)}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <FaDollarSign className="text-4xl" />
                        </div>
                        <p className="text-lg opacity-90 mb-1">Catering Deposits</p>
                        <p className="text-4xl font-bold">${stats.cateringDeposits.toFixed(2)}</p>
                    </motion.div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['all', 'succeeded', 'pending', 'failed'].map((status) => (
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

            {/* Payments Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Reference</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {filteredPayments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 text-white">
                                    {new Date(payment.created).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-white font-semibold">{payment.customer}</p>
                                        <p className="text-gray-400 text-sm">{payment.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-mono text-sm">
                                    {payment.id}
                                </td>
                                <td className="px-6 py-4">
                    <span className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white capitalize">
                      {payment.type.replace('_', ' ')}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-white font-bold">
                                    ${payment.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(payment.status)}
                                        <span className={`${getStatusColor(payment.status)} px-3 py-1 rounded-full text-sm text-white capitalize`}>
                        {payment.status}
                      </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedPayment(payment);
                                                setShowViewModal(true);
                                            }}
                                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        {payment.status === 'succeeded' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedPayment(payment);
                                                    setRefundAmount('');
                                                    setShowRefundModal(true);
                                                }}
                                                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                                                title="Refund"
                                            >
                                                <FaUndo />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* View Modal */}
            {showViewModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">Payment Details</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-gray-400 mb-1">Customer</p>
                                <p className="text-white font-semibold">{selectedPayment.customer}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Email</p>
                                <p className="text-white font-semibold">{selectedPayment.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Amount</p>
                                <p className="text-white text-2xl font-bold">${selectedPayment.amount.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Status</p>
                                <p className="text-white font-semibold capitalize">{selectedPayment.status}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Type</p>
                                <p className="text-white font-semibold capitalize">{selectedPayment.type.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Date</p>
                                <p className="text-white font-semibold">{new Date(selectedPayment.created).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Payment ID</p>
                                <p className="text-white font-mono text-sm">{selectedPayment.id}</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setSelectedPayment(null);
                                }}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Refund Modal */}
            {showRefundModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">Process Refund</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-gray-400 mb-1">Customer</p>
                                <p className="text-white font-semibold">{selectedPayment.customer}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Original Amount</p>
                                <p className="text-white text-2xl font-bold">${selectedPayment.amount.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Payment ID</p>
                                <p className="text-white font-mono text-sm">{selectedPayment.id}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-white font-semibold mb-2">Refund Amount ($)</label>
                            <input
                                type="number"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                max={selectedPayment.amount}
                                step="0.01"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white text-xl"
                                placeholder={selectedPayment.amount.toFixed(2)}
                            />
                            <p className="text-gray-400 text-sm mt-2">
                                Leave empty for full refund
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRefund}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                Process Refund
                            </button>
                            <button
                                onClick={() => {
                                    setShowRefundModal(false);
                                    setRefundAmount('');
                                    setSelectedPayment(null);
                                }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}