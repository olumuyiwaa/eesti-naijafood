// app/admin/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaCalendarAlt, FaClock, FaMusic } from 'react-icons/fa';
import axios from "axios";


interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    type: string;
    genre?: string;
    image?: string;
    capacity?: number;
    bookingsCount: number;
    isPublished: boolean;
    createdAt: string;
}

export default function AdminEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [filter, setFilter] = useState('all');

    // image file + preview state for the form
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Event>();

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get<{ success: boolean; events: any[] }>(
                `${process.env.NEXT_PUBLIC_API_URL}/api/events/upcoming`
            );

            // map _id to id and imageUrl to image
            const eventsData = response.data.events.map(e => ({
                ...e,
                id: e._id,
                image: e.imageUrl || null
            }));

            setEvents(eventsData);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Failed to fetch events:', error.response?.data || error.message);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    const onSubmit = async (data: Event) => {
        try {
            // build FormData so file can be uploaded
            const formData = new FormData();
            formData.append('title', data.title as string);
            formData.append('description', data.description as string);
            formData.append('date', data.date as string);
            formData.append('time', data.time as string);
            formData.append('type', data.type as string);
            if (data.genre) formData.append('genre', data.genre);
            if (data.capacity !== undefined && data.capacity !== null && data.capacity !== 0) formData.append('capacity', String(data.capacity));
            formData.append('isPublished', String(Boolean((data as any).isPublished)));

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editingEvent) {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${editingEvent.id}`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                toast.success('Event updated successfully');
            } else {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                toast.success('Event created successfully');
            }

            setShowModal(false);
            reset();
            setEditingEvent(null);
            setImageFile(null);
            setImagePreview(null);
            fetchEvents();
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to save event');
            } else {
                toast.error('Failed to save event');
            }
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        Object.entries(event).forEach(([key, value]) => {
            // avoid trying to set file input via setValue
            if (key !== 'image') {
                setValue(key as any, value);
            }
        });
        // set image preview from existing event image if present
        setImagePreview(event.image || null);
        setImageFile(null); // user can replace image by selecting a new file
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`);
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch (error: unknown) {
            toast.error('Failed to delete event');
        }
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}/publish`, {
                isPublished: !currentStatus
            });
            toast.success(currentStatus ? 'Event unpublished' : 'Event published');
            fetchEvents();
        } catch (error: unknown) {
            toast.error('Failed to update event status');
        }
    };

    // handle file select and preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const filteredEvents = filter === 'all'
        ? events
        : filter === 'published'
            ? events.filter(e => e.isPublished)
            : events.filter(e => !e.isPublished);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'african-experience': return 'bg-orange-600';
            case 'special-event': return 'bg-purple-600';
            case 'private-event': return 'bg-blue-600';
            default: return 'bg-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white">Events Management</h1>
                <button
                    onClick={() => {
                        setEditingEvent(null);
                        reset();
                        setImageFile(null);
                        setImagePreview(null);
                        setShowModal(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                    <FaPlus /> Create Event
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Events', value: events.length, color: 'from-orange-600 to-red-600' },
                    { label: 'Published', value: events.filter(e => e.isPublished).length, color: 'from-green-600 to-teal-600' },
                    { label: 'Upcoming', value: events.filter(e => new Date(e.date) > new Date()).length, color: 'from-blue-600 to-cyan-600' },
                    { label: 'Total Bookings', value: events.reduce((sum, e) => sum + e.bookingsCount, 0), color: 'from-purple-600 to-pink-600' }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
                    >
                        <p className="text-lg opacity-90 mb-1">{stat.label}</p>
                        <p className="text-4xl font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['all', 'published', 'draft'].map((tab) => (
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

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-2xl overflow-hidden"
                    >
                        {/* show event image if available else placeholder */}
                        <div className="relative h-48 bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center">
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                                <FaMusic className="text-8xl text-white/30" />
                            )}
                            {!event.isPublished && (
                                <div className="absolute top-3 right-3 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    Draft
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-xl font-bold text-white">{event.title}</h3>
                                <button
                                    onClick={() => handleTogglePublish(event.id, event.isPublished)}
                                    className="text-2xl"
                                    title={event.isPublished ? 'Unpublish' : 'Publish'}
                                >
                                    {event.isPublished ? (
                                        <FaToggleOn className="text-green-500" />
                                    ) : (
                                        <FaToggleOff className="text-gray-500" />
                                    )}
                                </button>
                            </div>

                            <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-white">
                                    <FaCalendarAlt className="text-orange-500" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white">
                                    <FaClock className="text-orange-500" />
                                    <span>{event.time}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`${getTypeColor(event.type)} px-3 py-1 rounded-full text-sm text-white capitalize`}>
                  {event.type.replace('-', ' ')}
                </span>
                                {event.genre && (
                                    <span className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white">
                    {event.genre}
                  </span>
                                )}
                            </div>

                            {event.capacity && (
                                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Bookings</span>
                                        <span className="text-white font-bold">
                      {event.bookingsCount} / {event.capacity}
                    </span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-orange-600 h-2 rounded-full"
                                            style={{ width: `${(event.bookingsCount / event.capacity) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">
                            {editingEvent ? 'Edit Event' : 'Create Event'}
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
                            <div>
                                <label className="block text-white font-semibold mb-2">Event Title *</label>
                                <input
                                    {...register('title', { required: 'Title is required' })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="e.g., Afrobeat Night"
                                />
                                {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Description *</label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="Event description"
                                />
                                {errors.description && <p className="text-red-500 mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white font-semibold mb-2">Date *</label>
                                    <input
                                        type="date"
                                        {...register('date', { required: 'Date is required' })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    />
                                    {errors.date && <p className="text-red-500 mt-1">{errors.date.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Time *</label>
                                    <input
                                        type="text"
                                        {...register('time', { required: 'Time is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="e.g., 21:00-23:30"
                                    />
                                    {errors.time && <p className="text-red-500 mt-1">{errors.time.message}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white font-semibold mb-2">Event Type *</label>
                                    <select
                                        {...register('type', { required: 'Type is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    >
                                        <option value="">Select type</option>
                                        <option value="african-experience">African Experience</option>
                                        <option value="special-event">Special Event</option>
                                        <option value="private-event">Private Event</option>
                                    </select>
                                    {errors.type && <p className="text-red-500 mt-1">{errors.type.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Genre (Optional)</label>
                                    <select
                                        {...register('genre')}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    >
                                        <option value="">Select genre</option>
                                        <option value="Afrobeat">Afrobeat</option>
                                        <option value="Amapiano">Amapiano</option>
                                        <option value="Highlife">Highlife</option>
                                        <option value="Drumming">Drumming</option>
                                        <option value="Mixed">Mixed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Capacity (Optional)</label>
                                <input
                                    type="number"
                                    {...register('capacity')}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="Maximum number of guests"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-white">
                                    <input
                                        type="checkbox"
                                        {...register('isPublished')}
                                        className="w-5 h-5"
                                    />
                                    <span>Publish event immediately</span>
                                </label>
                            </div>

                            {/* Image input + preview */}
                            <div>
                                <label className="block text-white font-semibold mb-2">Event Image (optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-orange-600 file:text-white"
                                />
                                {imagePreview && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-300 mb-2">Preview:</p>
                                        <img src={imagePreview} alt="preview" className="w-48 h-32 object-cover rounded-lg" />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                >
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        reset();
                                        setEditingEvent(null);
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}