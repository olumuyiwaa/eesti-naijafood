// app/about/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHeart, FaUsers, FaGlobeAfrica } from 'react-icons/fa';

export default function AboutPage() {
    const values = [
        {
            icon: FaHeart,
            title: 'Passion for African Culture',
            description: 'We celebrate the rich diversity and heritage of African cuisine and traditions'
        },
        {
            icon: FaUsers,
            title: 'Community First',
            description: 'Building connections through food, music, and shared experiences'
        },
        {
            icon: FaGlobeAfrica,
            title: 'Authentic Experience',
            description: 'Bringing genuine African flavors and vibes to Auckland'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-24">
            {/* Header */}
            <section className="py-16 bg-gradient-to-br from-orange-600 to-red-700 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-bold mb-4"
                >
                    Our Story
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl"
                >
                    A journey of flavor, culture, and community
                </motion.p>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl font-bold mb-6">Welcome to Afroflavours</h2>
                            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                                Afroflavours was born from a passion to share the incredible diversity of African cuisine with Auckland.
                                Our journey began with a simple mission: to create a space where authentic African flavors meet modern
                                dining experiences.
                            </p>
                            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
                                From the bustling streets of Lagos to the vibrant markets of Accra, we've brought together recipes
                                passed down through generations. Each dish tells a story of heritage, community, and the warmth of
                                African hospitality.
                            </p>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Today, Afroflavours is more than a restaurant—it's a cultural hub where food, music, and community
                                come together to celebrate the soul of Africa.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-96 rounded-2xl overflow-hidden"
                        >
                            <Image
                                src="/images/about-story.webp"
                                alt="Afroflavours Story"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
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
                                className="bg-gray-800 p-8 rounded-2xl text-center"
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
            <section className="py-20 bg-black">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold mb-8">Our Mission</h2>
                        <p className="text-2xl text-gray-300 leading-relaxed">
                            To be Auckland's premier destination for authentic African cuisine and cultural experiences,
                            creating memorable moments through exceptional food, vibrant entertainment, and genuine hospitality
                            that honors the rich traditions of the African continent.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}