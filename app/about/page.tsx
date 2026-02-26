// app/about/page.tsx
'use client';


import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHeart, FaUsers, FaGlobeAfrica } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

type SiteDetails = {
    about?: {
        text?: string;
        image?: string;
    };
    missionStatement?: string;
};
export default function AboutPage() {
    const [data, setData] = useState<SiteDetails | null>(null);
    const [loading, setLoading] = useState(true);

    const values = [
        {
            icon: FaHeart,
            title: 'Passion for African Culture',
            description: 'We celebrate the rich diversity and heritage of African cuisine and traditions'
        },
        {
            icon: FaUsers,
            title: 'Community First',
            description: 'Building connections through food and shared experiences'
        },
        {
            icon: FaGlobeAfrica,
            title: 'Authentic Experience',
            description: 'Bringing genuine African flavors and vibes to Estonia'
        }
    ];

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/site-details`
                );
                setData(res.data.data);
            } catch (err) {
                console.error('Failed to fetch site details', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);


    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-24">
            {/* Header */}
            <section className="relative py-16 bg-gradient-to-br from-orange-600 to-red-700 text-center overflow-hidden">

                {/* Background Image */}
                <div className="absolute inset-0 h-full">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/background.jpg"
                            alt="Eesti NaijaFood Background"
                            width={500}
                            height={300}
                            style={{ height: "380px", width: "100%", objectFit: "cover" }}
                            priority
                        />

                    </div>
                </div>

                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-bold mb-4 text-white"
                    >
                        Our Story
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl text-white"
                    >
                        A journey of flavor, culture, and community
                    </motion.p>
                </div>
            </section>


            {/* Story Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl font-bold mb-6">Welcome to Eesti-NaijaFood</h2>
                            <p className="text-xl text-gray-800 mb-4 leading-relaxed whitespace-pre-line">
                                {loading
                                    ? 'Loading story...'
                                    : data?.about?.text || 'Our story will be updated soon.'}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-96 rounded-2xl overflow-hidden"
                        >
                            <Image
                                src={data?.about?.image || '/images/about-story.webp'}
                                alt="Eesti Food Story"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-zinc-200">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16 text-black"
                    >
                        What We Stand For
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-8 rounded-2xl text-center"
                            >
                                <value.icon className="text-6xl text-orange-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                                <p className="text-gray-400">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-32 relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/experience.jpg"
                        alt="Eesti NaijaFood Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-black/50" />

                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />

                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold mb-8 text-white">Our Mission</h2>
                        <p className="text-2xl text-gray-300 leading-relaxed whitespace-pre-line">
                            {loading
                                ? 'Loading mission...'
                                : data?.missionStatement || 'Our mission will be updated soon.'}
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}