// app/admin/catering/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEye, FaCheck, FaTimes, FaUsers, FaCalendarAlt, FaDollarSign, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from "axios";

interface CateringRequest {
    id: string;
    quoteRef: string;
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
    attachment?: string;
    status: string;
    quotedAmount?: number;
    createdAt: string;
}

export default function AdminCatering() {
    const [requests, setRequests] = useState<CateringRequest[]>([]);
    const [filter, setFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState<CateringRequest | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [quoteAmount, setQuoteAmount] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get<{ success: boolean; requests: any[] }>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/catering/upcoming`
            );

            // map _id to id
            const requestsData = response.data.requests.map(e => ({
                ...e,
                id: e._id
            }));

            setRequests(requestsData);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Failed to fetch requests:', error.response?.data || error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    const handleStatusChange = async (quoteRef: string, newStatus: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/catering/update-status`, { quoteRef, status: newStatus });
            toast.success(`Request ${newStatus}`);
            fetchRequests();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };


    const handleSendQuote = async () => {
        if (!selectedRequest || !quoteAmount) {
            toast.error('Please enter a quote amount');
            return;
        }
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/catering/send-quote`, {
                quoteRef: selectedRequest.quoteRef,
                quotedAmount: parseFloat(quoteAmount)
            });
            toast.success('Quote sent successfully!');
            setShowQuoteModal(false);
            setQuoteAmount('');
            fetchRequests(); // refresh table
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send quote');
        }
    };

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(req => req.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-600';
            case 'quoted':
                return 'bg-blue-600';
            case 'accepted':
                return 'bg-green-600';
            case 'declined':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white">Catering Management</h1>
                <div className="flex gap-2">
                    {['all', 'pending', 'quoted', 'accepted', 'declined'].map((status) => (
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {label: 'Total Requests', value: requests.length, color: 'from-orange-600 to-red-600'},
                    {
                        label: 'Pending',
                        value: requests.filter(r => r.status === 'pending').length,
                        color: 'from-yellow-600 to-orange-600'
                    },
                    {
                        label: 'Quoted',
                        value: requests.filter(r => r.status === 'quoted').length,
                        color: 'from-blue-600 to-cyan-600'
                    },
                    {
                        label: 'Accepted',
                        value: requests.filter(r => r.status === 'accepted').length,
                        color: 'from-green-600 to-teal-600'
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: index * 0.1}}
                        className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
                    >
                        <p className="text-lg opacity-90 mb-1">{stat.label}</p>
                        <p className="text-4xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Requests Table */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="bg-gray-900 rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ref</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Client</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Event Details</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Guests</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Budget</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {filteredRequests.map((request) => (
                            <tr key={request.quoteRef} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 text-white font-mono text-sm">{request.quoteRef}</td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-white font-semibold">{request.name}</p>
                                        <p className="text-gray-400 text-sm flex items-center gap-1">
                                            <FaEnvelope className="text-xs"/> {request.email}
                                        </p>
                                        <p className="text-gray-400 text-sm flex items-center gap-1">
                                            <FaPhone className="text-xs"/> {request.phone}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-white flex items-center gap-2">
                                            <FaCalendarAlt className="text-orange-500"/>
                                            {new Date(request.eventDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-400 text-sm capitalize">{request.eventType}</p>
                                        <p className="text-gray-400 text-sm">{request.venue}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-white">
                                        <FaUsers className="text-orange-500"/>
                                        <span>{request.guestCount}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        {request.quotedAmount ? (
                                            <p className="text-green-500 font-bold flex items-center gap-1">
                                                <FaDollarSign/> {request.quotedAmount}
                                            </p>
                                        ) : (
                                            <p className="text-gray-400 text-sm">{request.budget || 'Not specified'}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span
                        className={`${getStatusColor(request.status)} px-3 py-1 rounded-full text-sm font-semibold text-white capitalize`}>
                      {request.status}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setShowModal(true);
                                            }}
                                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye/>
                                        </button>
                                        {request.status === 'pending' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setShowQuoteModal(true);
                                                }}
                                                className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                                                title="Send Quote"
                                            >
                                                <FaDollarSign/>
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

            {/* Details Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        className="bg-gray-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-white">Catering Request Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                <FaTimes/>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 mb-1">Quote Reference</p>
                                    <p className="text-white font-mono">{selectedRequest.quoteRef}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-1">Status</p>
                                    <span
                                        className={`inline-block ${getStatusColor(selectedRequest.status)} px-3 py-1 rounded-full text-sm font-semibold text-white capitalize`}>
                    {selectedRequest.status}
                  </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                                <h3 className="text-xl font-bold text-white mb-3">Client Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 mb-1">Name</p>
                                        <p className="text-white">{selectedRequest.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Email</p>
                                        <p className="text-white">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Phone</p>
                                        <p className="text-white">{selectedRequest.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                                <h3 className="text-xl font-bold text-white mb-3">Event Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 mb-1">Event Date</p>
                                        <p className="text-white">{new Date(selectedRequest.eventDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Event Type</p>
                                        <p className="text-white capitalize">{selectedRequest.eventType}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Guest Count</p>
                                        <p className="text-white">{selectedRequest.guestCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 mb-1">Budget Range</p>
                                        <p className="text-white">{selectedRequest.budget || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-400 mb-1">Venue</p>
                                    <p className="text-white">{selectedRequest.venue}</p>
                                </div>
                            </div>

                            {selectedRequest.menuPreferences && (
                                <div className="border-t border-gray-800 pt-4">
                                    <h3 className="text-xl font-bold text-white mb-3">Menu Preferences</h3>
                                    <p className="text-gray-300">{selectedRequest.menuPreferences}</p>
                                </div>
                            )}

                            {selectedRequest.specialRequirements && (
                                <div className="border-t border-gray-800 pt-4">
                                    <h3 className="text-xl font-bold text-white mb-3">Special Requirements</h3>
                                    <p className="text-gray-300">{selectedRequest.specialRequirements}</p>
                                </div>
                            )}

                            {selectedRequest.quotedAmount && (
                                <div className="border-t border-gray-800 pt-4">
                                    <h3 className="text-xl font-bold text-white mb-3">Quoted Amount</h3>
                                    <p className="text-3xl font-bold text-green-500">${selectedRequest.quotedAmount}</p>
                                </div>
                            )}

                            <div className="border-t border-gray-800 pt-4 flex gap-3">
                                {selectedRequest.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setShowQuoteModal(true);
                                        }}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                    >
                                        Send Quote
                                    </button>
                                )}
                                {selectedRequest.status === 'quoted' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleStatusChange(selectedRequest.quoteRef, 'accepted');
                                                setShowModal(false);
                                            }}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                        >
                                            Mark as Accepted
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleStatusChange(selectedRequest.quoteRef, 'declined');
                                                setShowModal(false);
                                            }}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                        >
                                            Mark as Declined
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Quote Modal */}
            {showQuoteModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">Send Quote</h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-gray-400 mb-1">Client</p>
                                <p className="text-white font-semibold">{selectedRequest.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Event</p>
                                <p className="text-white">{selectedRequest.guestCount} guests
                                    - {selectedRequest.eventType}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">Requested Budget</p>
                                <p className="text-white">{selectedRequest.budget || 'Not specified'}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-white font-semibold mb-2">Quote Amount ($) *</label>
                            <input
                                type="number"
                                value={quoteAmount}
                                onChange={(e) => setQuoteAmount(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white text-2xl font-bold"
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSendQuote}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                            >
                                Send Quote
                            </button>
                            <button
                                onClick={() => {
                                    setShowQuoteModal(false);
                                    setQuoteAmount('');
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