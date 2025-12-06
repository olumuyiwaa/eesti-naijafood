// app/african-experience/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { FaMusic, FaDrum, FaCalendarAlt, FaClock } from 'react-icons/fa';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    type: string;
    imageUrl: string;
    isPublished: boolean;
}

interface GalleryImage {
    url: string;
    publicId: string;
}

export default function AfricanExperiencePage() {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<GalleryImage[]>([]);

    useEffect(() => {
        fetchEvents();
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`);
            setImages(response.data.images || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/upcoming`);
            setUpcomingEvents(response.data.events.filter(event => event.isPublished) || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const schedule = [
        {
            day: 'Thursday',
            genre: 'Afrobeat',
            description: 'Classic and modern Afrobeat hits that get you moving',
            color: 'from-orange-600 to-red-600',
            icon: '🎵'
        },
        {
            day: 'Friday',
            genre: 'Amapiano',
            description: 'South African house music vibes and deep bass',
            color: 'from-purple-600 to-pink-600',
            icon: '🎹'
        },
        {
            day: 'Saturday',
            genre: 'Highlife & Afrobeat Mix',
            description: 'The best of African music blended perfectly',
            color: 'from-yellow-600 to-orange-600',
            icon: '🎺'
        },
        {
            day: 'Sunday',
            genre: 'Live Drumming',
            description: 'Traditional African drumming and dance sessions',
            color: 'from-green-600 to-teal-600',
            icon: '🥁'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/african-experience-hero.jpg')" }}
                />

                <motion.div
                    className="relative z-20 text-center text-white px-4 max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <FaMusic className="text-8xl mx-auto mb-6 text-orange-500" />
                    </motion.div>
                    <h1 className="text-7xl md:text-9xl font-bold mb-6">
                        The African Experience
                    </h1>
                    <p className="text-3xl mb-4 font-light">
                        Thursday - Sunday | 9:00 PM - 11:30 PM
                    </p>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Immerse yourself in the rhythm and soul of Africa. Live DJs, traditional drumming,
                        dancing, and authentic vibes that transport you to the motherland.
                    </p>
                    <Link href="/bookings">
                        <motion.button
                            className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-full text-xl font-semibold transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Book Your Experience
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* What to Expect */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
                    >
                        What to Expect
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FaMusic,
                                title: 'Live DJ Sets',
                                description: 'Professional DJs spinning the hottest Afrobeat, Amapiano, and Highlife tracks'
                            },
                            {
                                icon: FaDrum,
                                title: 'Drumming Sessions',
                                description: 'Traditional African drumming circles every Sunday night - feel the rhythm!'
                            },
                            {
                                icon: '💃',
                                title: 'Dance & Celebrate',
                                description: 'Open dance floor, no judgments - just vibes, energy, and pure African spirit'
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-gray-800 p-8 rounded-2xl text-center"
                            >
                                {typeof item.icon === 'string' ? (
                                    <div className="text-6xl mb-4">{item.icon}</div>
                                ) : (
                                    <item.icon className="text-6xl text-orange-500 mx-auto mb-4" />
                                )}
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Weekly Schedule */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
                    >
                        Weekly Schedule
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {schedule.map((day, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-gradient-to-br ${day.color} p-8 rounded-3xl`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-5xl">{day.icon}</div>
                                    <div>
                                        <h3 className="text-3xl font-bold">{day.day}</h3>
                                        <p className="text-xl opacity-90">9:00 PM - 11:30 PM</p>
                                    </div>
                                </div>
                                <h4 className="text-2xl font-bold mb-2">{day.genre}</h4>
                                <p className="text-lg opacity-90">{day.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Events */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
                    >
                        Upcoming Events
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {upcomingEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                                    <p className="text-gray-400 mb-4">{event.description}</p>
                                    <div className="flex items-center gap-4 text-orange-500 mb-4">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt />
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaClock />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>
                                    <Link href="/bookings">
                                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all">
                                            Book Now
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
                    >
                        Experience Gallery
                    </motion.h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((item, index) => (
                            <motion.div
                                key={item.publicId}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group"
                            >
                                <Image
                                    src={item.url}
                                    alt=""
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    {/* <div>
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-sm text-gray-300">{new Date(item.date).toLocaleDateString()}</p>
                                    </div> */}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-orange-600 to-red-700 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold mb-6">Ready to Feel the Rhythm?</h2>
                        <p className="text-2xl mb-8">
                            Book your table for The African Experience and prepare for an unforgettable night!
                        </p>
                        <Link href="/bookings">
                            <button className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-5 rounded-full text-xl font-semibold transition-all">
                                Reserve Your Spot
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}