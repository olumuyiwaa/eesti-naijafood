// app/admin/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    FaEye,
    FaTimes,
    FaDollarSign,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBox
} from 'react-icons/fa';

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders`
            );

            const mapped = response.data.orders.map((o: any) => ({
                ...o,
                id: o._id
            }));

            setOrders(mapped);
        } catch (error) {
            toast.error('Failed to fetch orders');
        }
    };

    const filteredOrders =
        filter === 'all'
            ? orders
            : orders.filter(order => order.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-600';
            case 'pending':
                return 'bg-yellow-600';
            case 'cancelled':
                return 'bg-red-600';
            default:
                return 'bg-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-black">Orders Management</h1>

                <div className="flex gap-2">
                    {['all', 'pending', 'paid'].map(status => (
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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Orders', value: orders.length, color: 'from-orange-600 to-red-600' },
                    {
                        label: 'Paid',
                        value: orders.filter(o => o.status === 'paid').length,
                        color: 'from-green-600 to-teal-600'
                    },
                    {
                        label: 'Pending',
                        value: orders.filter(o => o.status === 'pending').length,
                        color: 'from-yellow-600 to-orange-600'
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
                    >
                        <p className="text-lg opacity-90">{stat.label}</p>
                        <p className="text-4xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Customer</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Items</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Total</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Status</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Date</th>
                            <th className="px-6 py-4 text-left text-sm text-gray-400">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 text-white">
                                    {order.customerName}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                    {order.items.length} items
                                </td>
                                <td className="px-6 py-4 text-green-500 font-bold flex items-center gap-1">
                                    <FaDollarSign />
                                    {order.totalAmount}
                                </td>
                                <td className="px-6 py-4">
                                        <span className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-white text-sm capitalize`}>
                                            {order.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowModal(true);
                                        }}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between mb-6">
                            <h2 className="text-3xl font-bold text-white">
                                Order Details
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-2 mb-6">
                            <p className="text-white flex items-center gap-2">
                                <FaUser /> {selectedOrder.customerName}
                            </p>
                            <p className="text-gray-400 flex items-center gap-2">
                                <FaEnvelope /> {selectedOrder.customerEmail}
                            </p>
                            <p className="text-gray-400 flex items-center gap-2">
                                <FaPhone /> {selectedOrder.customerPhone}
                            </p>
                        </div>

                        {/* Items */}
                        <div className="border-t border-gray-800 pt-4">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Items
                            </h3>

                            {selectedOrder.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between mb-3 text-gray-300"
                                >
                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>
                                    <span>
                                        ${item.price * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-800 pt-4 mt-4 text-right">
                            <p className="text-2xl font-bold text-green-500">
                                Total: ${selectedOrder.totalAmount}
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}