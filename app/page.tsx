'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaCalendarAlt, FaUtensils, FaMusic, FaTruck, FaStar, FaPlay } from 'react-icons/fa';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
            {/* Hero Section - Full Screen with Video Background Effect */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-600/20 to-yellow-500/20 animate-gradient" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0],
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            rotate: [0, -5, 0],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-20 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"
                    />
                </div>

                <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-7xl md:text-9xl font-black mb-6 leading-tight"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Afro Flavours
              </span>
                        </motion.h1>

                        <motion.p
                            className="text-3xl md:text-5xl font-light text-white/90 mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Where Africa Comes Alive
                        </motion.p>

                        <motion.p
                            className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Authentic African cuisine meets vibrant culture. Experience the rhythm, taste the tradition,
                            feel the soul of Africa in every bite.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap gap-6 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Link href="/bookings">
                                <motion.button
                                    className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white text-lg font-bold overflow-hidden shadow-2xl shadow-orange-500/50"
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 146, 60, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FaCalendarAlt /> Book Your Table
                  </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </motion.button>
                            </Link>

                            <Link href="/menu">
                                <motion.button
                                    className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-full text-white text-lg font-bold hover:bg-white/20 transition-all shadow-2xl"
                                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                  <span className="flex items-center gap-2">
                    <FaUtensils /> Explore Menu
                  </span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                        <motion.div
                            className="w-1.5 h-3 bg-orange-500 rounded-full"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: FaCalendarAlt,
                                title: 'Reserve Your Spot',
                                description: 'Instant booking confirmation',
                                link: '/bookings',
                                gradient: 'from-orange-500 to-red-500'
                            },
                            {
                                icon: FaUtensils,
                                title: 'Authentic Flavors',
                                description: 'Traditional African cuisine',
                                link: '/menu',
                                gradient: 'from-red-500 to-pink-500'
                            },
                            {
                                icon: FaTruck,
                                title: 'Delivery Available',
                                description: 'Order via DoorDash & Uber Eats',
                                link: '/order',
                                gradient: 'from-pink-500 to-purple-500'
                            },
                            {
                                icon: FaMusic,
                                title: 'Live Entertainment',
                                description: 'Thu-Sun, 9pm-11:30pm',
                                link: '/african-experience',
                                gradient: 'from-purple-500 to-indigo-500'
                            }
                        ].map((item, index) => (
                            <Link href={item.link} key={index}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="group relative bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-3xl cursor-pointer overflow-hidden border border-white/5 hover:border-white/20 transition-all"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                    <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all group-hover:scale-110`}>
                                        <item.icon className="text-2xl text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/60 group-hover:text-white/80 transition-colors">
                                        {item.description}
                                    </p>

                                    <div className="absolute top-4 right-4 text-white/20 group-hover:text-orange-500/50 transition-all transform group-hover:translate-x-1">
                                        →
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section - Two Column */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-orange-950/10 to-black" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-6 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6">
                                <span className="text-orange-400 font-semibold">Our Story</span>
                            </div>

                            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Taste the Heart of Africa
                </span>
                            </h2>

                            <p className="text-xl text-white/70 mb-6 leading-relaxed">
                                Afroflavours isn't just a restaurant—it's a journey. Every dish tells a story, every flavor
                                carries tradition, and every meal brings people together.
                            </p>

                            <p className="text-lg text-white/60 mb-8 leading-relaxed">
                                From our signature Jollof Rice to live Afrobeat nights, we're bringing the vibrant energy
                                and authentic taste of West Africa to Auckland.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/about">
                                    <motion.button
                                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-bold shadow-lg shadow-orange-500/30"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        Discover Our Story
                                    </motion.button>
                                </Link>

                                <motion.button
                                    className="px-8 py-4 bg-white/5 backdrop-blur border border-white/10 rounded-full text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <FaPlay className="text-sm" /> Watch Video
                                </motion.button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                <div className="absolute inset-0 bg-[url('/api/placeholder/800/600')] bg-cover bg-center" />

                                {/* Stats Overlay */}
                                <div className="absolute bottom-8 left-8 right-8 z-20 grid grid-cols-3 gap-4">
                                    {[
                                        { number: '1000+', label: 'Happy Guests' },
                                        { number: '50+', label: 'Menu Items' },
                                        { number: '5★', label: 'Rating' }
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20"
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                                        >
                                            <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                                {stat.number}
                                            </div>
                                            <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                className="absolute -top-6 -right-6 bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-3xl shadow-2xl shadow-orange-500/50"
                                animate={{ rotate: [0, 5, 0], y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <FaStar className="text-4xl text-white" />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* African Experience - Bold Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600" />
                <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20 mix-blend-overlay" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <FaMusic className="text-8xl text-white mx-auto mb-8 drop-shadow-2xl" />
                        </motion.div>

                        <h2 className="text-6xl md:text-8xl font-black text-white mb-6">
                            The African Experience
                        </h2>

                        <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
                            Thursday - Sunday | 9:00 PM - 11:30 PM
                        </p>

                        <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Live DJs, Afrobeat rhythms, traditional drumming, and an atmosphere that transports
                            you straight to the heart of Africa. This isn't just dinner—it's an experience.
                        </p>

                        <Link href="/african-experience">
                            <motion.button
                                className="px-12 py-6 bg-white text-orange-600 rounded-full text-xl font-black shadow-2xl hover:shadow-white/50 transition-all"
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Experience the Magic →
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Dish of the Week */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-[3rem] overflow-hidden border border-white/10"
                    >
                        <div className="grid lg:grid-cols-2">
                            <div className="relative h-96 lg:h-auto">
                                <div className="absolute inset-0 bg-[url('/api/placeholder/800/600')] bg-cover bg-center" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950/90 lg:to-zinc-950" />

                                <motion.div
                                    className="absolute top-8 left-8 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-black shadow-xl"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ⭐ DISH OF THE WEEK
                                </motion.div>
                            </div>

                            <div className="p-12 lg:p-16 flex flex-col justify-center">
                                <h3 className="text-5xl font-black text-white mb-4 leading-tight">
                                    Asaro (Yam Porridge)
                                </h3>

                                <p className="text-xl text-white/70 mb-6 leading-relaxed">
                                    Creamy yam porridge with vegetables and smoked fish. Experience the warmth and
                                    comfort of authentic Nigerian home cooking.
                                </p>

                                <div className="flex items-baseline gap-4 mb-8">
                                  <span className="text-6xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                    $19.50
                                  </span>
                                    <span className="text-white/50 line-through text-2xl">$25.00</span>
                                </div>

                                <Link href="/menu">
                                    <motion.button
                                        className="px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white text-lg font-bold shadow-lg shadow-orange-500/30 w-fit"
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 146, 60, 0.4)" }}
                                    >
                                        Order Now →
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
              <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl font-bold text-center mb-16"
                  >
                    What Our Customers Say
                  </motion.h2>
                  <TestimonialsCarousel />
                  <div className="text-center mt-12">
                    <Link href="/reviews">
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all">
                        Read More Reviews
                      </button>
                    </Link>
                  </div>
                </div>
              </section>

            {/* Final CTA */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                            Ready to <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Experience Africa?</span>
                        </h2>

                        <p className="text-2xl text-white/70 mb-12">
                            Book your table now or order online. The flavors of Africa are waiting.
                        </p>

                        <div className="flex flex-wrap gap-6 justify-center">
                            <Link href="/bookings">
                                <motion.button
                                    className="px-12 py-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white text-xl font-bold shadow-2xl shadow-orange-500/50"
                                    whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(251, 146, 60, 0.5)" }}
                                >
                                    Make a Reservation
                                </motion.button>
                            </Link>

                            <Link href="/catering">
                                <motion.button
                                    className="px-12 py-6 bg-white/5 backdrop-blur border-2 border-white/20 rounded-full text-white text-xl font-bold hover:bg-white/10 transition-all"
                                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
                                >
                                    Catering Services
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}