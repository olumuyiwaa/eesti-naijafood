// app/admin/bookings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEye, FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa';

interface Booking {
    id: string;
    bookingRef: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    bookingType: string;
    specialRequests?: string;
    status: string;
    createdAt: string;
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filter, setFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get<{ success: boolean; bookings: any[] }>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`
            );

            // map _id to bookingRef
            const requestsData = response.data.bookings.map(e => ({
                ...e,
                id: e._id
            }));

            setBookings(requestsData);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Failed to fetch bookings:', error.response?.data || error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    const handleStatusChange = async (bookingRef: string, newStatus: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/update-status`, { bookingRef, status: newStatus });
            toast.success(`Booking ${newStatus}`);
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update booking');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white">Bookings Management</h1>
                <div className="flex gap-2">
                    {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
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

            {/* Bookings Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Ref</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date & Time</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Guests</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {filteredBookings.map((booking) => (
                            <tr key={booking.bookingRef} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 text-white font-mono text-sm">{booking.bookingRef}</td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-white font-semibold">{booking.name}</p>
                                        <p className="text-gray-400 text-sm">{booking.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-white">
                                        <FaCalendarAlt className="text-orange-500" />
                                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                                        <FaClock className="text-orange-500 ml-2" />
                                        <span>{booking.time}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-white">
                                        <FaUsers className="text-orange-500" />
                                        <span>{booking.guests}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white capitalize">
                      {booking.bookingType.replace('-', ' ')}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                            booking.status === 'confirmed'
                                ? 'bg-green-600 text-white'
                                : booking.status === 'pending'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-red-600 text-white'
                        }`}
                    >
                      {booking.status}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedBooking(booking);
                                                setShowModal(true);
                                            }}
                                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(booking.bookingRef, 'confirmed')}
                                                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                                                    title="Confirm"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(booking.bookingRef, 'cancelled')}
                                                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                                                    title="Cancel"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Booking Details Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-white">Booking Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 mb-1">Booking Reference</p>
                                    <p className="text-white font-mono">{selectedBooking.bookingRef}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 mb-1">Status</p>
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                                            selectedBooking.status === 'confirmed'
                                                ? 'bg-green-600 text-white'
                                                : selectedBooking.status === 'pending'
                                                    ? 'bg-yellow-600 text-white'
                                                    : 'bg-red-600 text-white'
                                        }`}
                                    >
                    {selectedBooking.status}
                  </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                                <h3 className="text-xl font-bold text-white mb-3">Customer Information</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-400">Name: <span className="text-white">{selectedBooking.name}</span></p>
                                    <p className="text-gray-400">Email: <span className="text-white">{selectedBooking.email}</span></p>
                                    <p className="text-gray-400">Phone: <span className="text-white">{selectedBooking.phone}</span></p>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                                <h3 className="text-xl font-bold text-white mb-3">Booking Information</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-400">Date: <span className="text-white">{new Date(selectedBooking.date).toLocaleDateString()}</span></p>
                                    <p className="text-gray-400">Time: <span className="text-white">{selectedBooking.time}</span></p>
                                    <p className="text-gray-400">Guests: <span className="text-white">{selectedBooking.guests}</span></p>
                                    <p className="text-gray-400">Type: <span className="text-white capitalize">{selectedBooking.bookingType.replace('-', ' ')}</span></p>
                                </div>
                            </div>

                            {selectedBooking.specialRequests && (
                                <div className="border-t border-gray-800 pt-4">
                                    <h3 className="text-xl font-bold text-white mb-3">Special Requests</h3>
                                    <p className="text-gray-300">{selectedBooking.specialRequests}</p>
                                </div>
                            )}

                            <div className="border-t border-gray-800 pt-4 flex gap-3">
                                {selectedBooking.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleStatusChange(selectedBooking.bookingRef, 'confirmed');
                                                setShowModal(false);
                                            }}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                        >
                                            Confirm Booking
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleStatusChange(selectedBooking.bookingRef, 'cancelled');
                                                setShowModal(false);
                                            }}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                        >
                                            Cancel Booking
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}