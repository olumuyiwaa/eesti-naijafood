// app/menu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Image from 'next/image';
import { FaLeaf, FaFire, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from "next/link";

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

export default function MenuPage() {
    const [menu, setMenu] = useState<MenuData | null>(null);
    const [activeCategory, setActiveCategory] = useState('starters');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
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

    useEffect(() => {
        if (menu) {
            // Flatten all categories into one array and find the dish of the week
            const allItems = Object.values(menu).flat();
            const specialDish = allItems.find(item => item.isDishOfWeek);
            setDishOfTheWeek(specialDish || null);
        }
    }, [menu]);

    const categories = [
        { id: 'starters', name: 'Starters', icon: '🥟' },
        { id: 'mains', name: 'Main Courses', icon: '🍛' },
        { id: 'sides', name: 'Sides', icon: '🥗' },
        { id: 'desserts', name: 'Desserts', icon: '🍰' },
        { id: 'nonAlcoholic', name: 'Soft Drinks', icon: '🥤' },
        { id: 'alcoholic', name: 'Alcoholic Drinks', icon: '🍺' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-2xl">Loading menu...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24">
            {/* Header */}
            <section className="relative py-16 bg-gradient-to-br from-orange-600 to-red-700 text-center overflow-hidden">

                {/* Background Image */}
                <div className="absolute inset-0 h-full">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/background.jpg"
                            alt="Afro Flavours Background"
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
                        className="text-6xl font-bold mb-4"
                    >
                        Our Menu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl mb-8"
                    >
                        Authentic African flavors crafted with love
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 mx-auto"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaDownload /> Download Full Menu (PDF)
                    </motion.button>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="sticky top-20 z-40 bg-gray-900 border-b border-gray-800 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold transition-all ${
                                    activeCategory === category.id
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Menu Items */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menu && menu[activeCategory as keyof MenuData]?.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {item.isVegetarian && (
                                        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                            <FaLeaf /> Vegetarian
                                        </div>
                                    )}
                                    {item.isSpicy && (
                                        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                            <FaFire /> Spicy
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                                    <p className="text-gray-400 mb-4">{item.description}</p>
                                    <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-orange-500">
                      ${item.price.toFixed(2)}
                    </span>
                                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-semibold transition-all">
                                            Order
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
            <section className="py-16 bg-black">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-5xl font-bold mb-8">Order for Takeaway</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Craving African flavors at home? Order through our delivery partners!
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
                        >
                            Order on DoorDash
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
                        >
                            Order on Uber Eats
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
}