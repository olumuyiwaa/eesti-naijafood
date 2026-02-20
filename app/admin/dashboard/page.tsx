// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaTruck, FaEnvelope, FaStar, FaChartLine, FaUsers } from 'react-icons/fa';
import { StatsCard } from '@/components/admin/StatsCard';
import axios from 'axios';

export default function AdminDashboard() {

    interface RecentOrder {
        name: string;
        date: string;
        time: string;
        status: string;
    }

    interface RecentCatering {
        name: string;
        eventDate: string;
        guestCount: number;
        status: string;
    }


    const [stats, setStats] = useState({
        orders: { today: 0, total: 0, pending: 0 },
        catering: { requests: 0, pending: 0 },
        messages: { unread: 0 },
        reviews: { pending: 0, average: 0 }
    });

    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [recentCatering, setRecentCatering] = useState<RecentCatering[]>([]);


    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`);
            setStats(res.data.stats);
            setRecentOrders(res.data.recentOrders);
            setRecentCatering(res.data.recentCatering);
        } catch (err) {
            console.error("Dashboard fetch error", err);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Today's Orders"
                    value={stats.orders.today}
                    icon={<FaCalendarAlt />}
                    color="from-orange-600 to-red-600"
                    change="+12%"
                />
                <StatsCard
                    title="Pending Orders"
                    value={stats.orders.pending}
                    icon={<FaUsers />}
                    color="from-purple-600 to-pink-600"
                />
                <StatsCard
                    title="Catering Requests"
                    value={stats.catering.requests}
                    icon={<FaTruck />}
                    color="from-green-600 to-teal-600"
                />
                <StatsCard
                    title="Unread Messages"
                    value={stats.messages.unread}
                    icon={<FaEnvelope />}
                    color="from-blue-600 to-cyan-600"
                />
                <StatsCard
                    title="Pending Reviews"
                    value={stats.reviews.pending}
                    icon={<FaStar />}
                    color="from-yellow-600 to-orange-600"
                />
                <StatsCard
                    title="Average Rating"
                    value={stats.reviews.average}
                    icon={<FaChartLine />}
                    color="from-indigo-600 to-purple-600"
                />
            </div>

            <h2 className="text-xl font-bold text-white mt-16">Recent Activity</h2>
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-2xl p-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Orders</h2>
                    <div className="space-y-4">
                        {recentOrders.map((order, i) => (
                            <div key={i} className="bg-gray-800 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-white font-semibold">{order.name}</p>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(order.date).toLocaleDateString()} - {order.time}
                                    </p>
                                </div>
                                <span className="bg-orange-600 px-3 py-1 rounded-full text-sm font-semibold text-white">
                            {order.status}
                        </span>
                            </div>
                        ))}

                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-2xl p-6"
                >
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Catering Requests</h2>
                    <div className="space-y-4">
                        {recentCatering.map((item, i) => (
                            <div key={i} className="bg-gray-800 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-white font-semibold">{item.name}</p>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(item.eventDate).toLocaleDateString()} - {item.guestCount} guests
                                    </p>
                                </div>
                                <span className="bg-orange-600 px-3 py-1 rounded-full text-sm font-semibold text-white">
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}