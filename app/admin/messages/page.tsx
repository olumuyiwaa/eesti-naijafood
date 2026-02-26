// app/admin/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaCheck } from 'react-icons/fa';
import axios from "axios";

interface Message {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get<{ success: boolean; bookings: any[] }>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/messages`
            );

            // map _id to id
            const requestsData = response.data.bookings.map(e => ({
                ...e,
                id: e._id
            }));

            setMessages(requestsData);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Failed to fetch messages:', error.response?.data || error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/mark-read`, { id });
            toast.success('Message marked as read');
            fetchMessages(); // refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update message');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/delete/${id}`);
            toast.success('Message deleted');
            fetchMessages(); // refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete message');
        }
    };

    const filteredMessages = filter === 'all'
        ? messages
        : filter === 'unread'
            ? messages.filter(m => !m.isRead)
            : messages.filter(m => m.isRead);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-black">Contact Messages</h1>
                <div className="flex gap-2">
                    {['all', 'unread', 'read'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                                filter === tab
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="divide-y divide-gray-800">
                    {filteredMessages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`p-6 hover:bg-gray-800/50 transition-all cursor-pointer ${
                                !message.isRead ? 'bg-orange-600/5' : ''
                            }`}
                            onClick={() => setSelectedMessage(message)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-3 rounded-full ${message.isRead ? 'bg-gray-700' : 'bg-orange-600'}`}>
                                        {message.isRead ? (
                                            <FaEnvelopeOpen className="text-white" />
                                        ) : (
                                            <FaEnvelope className="text-white" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white">{message.name}</h3>
                                            {!message.isRead && (
                                                <span className="bg-orange-600 px-2 py-1 rounded-full text-xs font-bold text-white">
                          New
                        </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 mb-1">{message.email}</p>
                                        <p className="text-white font-semibold mb-2">{message.subject}</p>
                                        <p className="text-gray-400 line-clamp-2">{message.message}</p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            {new Date(message.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkAsRead(message.id);
                                        }}
                                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                                        title="Reply"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(message.id);
                                        }}
                                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}