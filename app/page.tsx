'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {FaCalendarAlt, FaUtensils, FaMusic, FaTruck, FaStar, FaPlay, FaLeaf, FaFire} from 'react-icons/fa';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    isVegetarian?: boolean;
    isSpicy?: boolean;
    isDishOfWeek?: boolean;
}

interface MenuData {
    starters: MenuItem[];
    mains: MenuItem[];
    sides: MenuItem[];
    desserts: MenuItem[];
    nonAlcoholic: MenuItem[];
    alcoholic: MenuItem[];
}

interface GalleryImage {
    url: string;
    publicId: string;
}

export default function Home() {
    const [menu, setMenu] = useState<MenuData | null>(null);
    const [activeCategory, setActiveCategory] = useState('starters');
        const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
        fetchGallery();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`);
            setMenu(response.data.menu);
        } catch (error) {
            toast.error('Failed to load menu');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const [dishOfTheWeek, setDishOfTheWeek] = useState<MenuItem | null>(null);

    const fetchGallery = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`);
            setImages(response.data.images || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };
    useEffect(() => {
        if (menu) {
            // Flatten all categories into one array and find the dish of the week
            const allItems = Object.values(menu).flat();
            const specialDish = allItems.find(item => item.isDishOfWeek);
            setDishOfTheWeek(specialDish || null);
        }
    }, [menu]);
    return (
        <div className="min-h-screen bg-white text-zinc-900">
            {/* Hero Section - Full Screen with Video Background Effect */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-bg.png"
                        alt="Eesti NaijaFood Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-black/50" />

                {/* Animated Background Gradient */}
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
                Eesti NaijaFood
              </span>
                        </motion.h1>

                        <motion.p
                            className="text-3xl md:text-6xl font-light text-white/90 mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Catering Beyond Expectations
                        </motion.p>

                        <motion.p
                            className="text-lg md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Crafting culinary masterpieces for your most distinguished events. From intimate gatherings to grand celebrations, we bring refined flavors, artistic presentation, and seamless service to your table, ensuring an unforgettable dining experience.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap gap-6 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Link href="/catering">
                                <motion.button
                                    className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white text-lg font-bold overflow-hidden shadow-2xl shadow-orange-500/50"
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 146, 60, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FaCalendarAlt /> Book Our Service
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

            {/* About Section - Two Column */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-950/10 to-white" />

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

                            <p className="text-xl text-black/70 mb-6 leading-relaxed">
                                Eesti-NaijaFood isn’t just catering — it’s a culinary experience.
                                Every menu we create tells a story. Every flavor carries the richness of West African tradition. Every event we serve becomes a celebration of culture and connection.
                            </p>

                            <p className="text-lg text-black/60 mb-8 leading-relaxed">
                            From our signature Jollof Rice to beautifully crafted, top-quality cakes, we bring the vibrant taste and energy of West Africa to events across Estonia — weddings, corporate functions, private celebrations, and special occasions.
                            </p>

                            <p className="text-lg text-black/60 mb-8 leading-relaxed">
                                We don’t just serve food.
                                We create unforgettable experiences.
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
                                    className="px-8 py-4 bg-white/5 backdrop-blur border border-white/10 rounded-full text-black font-bold hover:bg-white/10 transition-all flex items-center gap-2"
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
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: "url('/images/about-story.webp')" }}
                                />

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

            {/* Dish of the Week */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-[3rem] overflow-hidden border border-white/10"
                    >
                        {dishOfTheWeek ? (
                            <div className="grid lg:grid-cols-2">
                                <div className="relative h-96 lg:h-auto">
                                    <Image
                                        src={dishOfTheWeek.image}
                                        alt={dishOfTheWeek.name}
                                        fill
                                        className="object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950/90 lg:to-zinc-950" />
                                    <motion.div
                                        className="absolute top-8 left-8 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-black shadow-xl"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        ⭐ DISH OF THE WEEK
                                    </motion.div>
                                    <motion.div
                                        className="absolute bottom-8 left-8 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-black shadow-xl"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        {dishOfTheWeek.isVegetarian && (
                                            <div className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-full text-sm mb-2 mr-2">
                                                <FaLeaf /> Vegetarian
                                            </div>
                                        )}
                                        {dishOfTheWeek.isSpicy && (
                                            <div className="inline-flex items-center gap-1 bg-white text-red-600 px-3 py-1 rounded-full text-sm mb-2 ml-2">
                                                <FaFire /> Spicy
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                <div className="p-12 lg:p-16 flex flex-col justify-center">
                                    <h3 className="text-5xl font-black text-white mb-4 leading-tight">
                                        {dishOfTheWeek.name}
                                    </h3>

                                    <p className="text-xl text-white/70 mb-6 leading-relaxed">
                                        {dishOfTheWeek.description}
                                    </p>

                                    <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-6xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                        ${dishOfTheWeek.price}
                                    </span>
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
                        ) : (
                            <p className="text-xl text-gray-200">No Dish of the Week available.</p>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Order Online Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-5xl font-bold mb-8">Order for Takeaway</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Craving African flavors at home? Order through our delivery partners!
                    </p>

                    <div className="flex flex-wrap gap-6 justify-center">
                        {/* Bolt Food */}
                        <motion.a
                            href="https://food.bolt.eu/en-US/1/p/175185-eesti-naijafoods?utm_source=share_provider&utm_medium=product&utm_content=menu_header"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all inline-block"
                        >
                            Order on Bolt Food
                        </motion.a>

                        {/* wolt*/}
                        <motion.a
                            href="https://wolt.com/et/est/tallinn/restaurant/eesti-naijafoods"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all inline-block"
                        >
                            Order on Wolt Delivery
                        </motion.a>
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-20 bg-white">
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

            {/* Final CTA */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: FaCalendarAlt,
                                title: 'Reserve Your Spot',
                                description: 'Instant booking confirmation',
                                link: '/catering',
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
                                description: 'Order via Bolt Food',
                                link: '/menu',
                                gradient: 'from-pink-500 to-purple-500'
                            },
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

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
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
        </div>
    );
}