// app/menu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Image from 'next/image';
import { FaLeaf, FaFire, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from "next/link";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCart } from '@/context/CartContext';


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
    const { addToCart } = useCart();
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

    const generatePDF = () => {
        if (!menu) {
            toast.error('Menu data not available');
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Title
        doc.setFontSize(24);
        doc.setTextColor(234, 88, 12); // Orange color
        doc.text('Eesti NaijaFood Menu', pageWidth / 2, 20, { align: 'center' });

        // Subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('Authentic African Flavors Crafted With Love', pageWidth / 2, 28, { align: 'center' });

        let yPosition = 40;

        const categories = [
            { id: 'starters', name: 'Starters' },
            { id: 'mains', name: 'Main Courses' },
            { id: 'sides', name: 'Sides' },
            { id: 'desserts', name: 'Desserts' },
            { id: 'nonAlcoholic', name: 'Soft Drinks' },
            { id: 'alcoholic', name: 'Alcoholic Drinks' },
        ];

        categories.forEach((category) => {
            const items = menu[category.id as keyof MenuData];

            if (items && items.length > 0) {
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Category Header
                doc.setFontSize(16);
                doc.setTextColor(234, 88, 12);
                doc.text(category.name, 14, yPosition);
                yPosition += 8;

                // Create table data
                const tableData = items.map(item => {
                    const badges: string[] = [];
                    if (item.isVegetarian) badges.push('[Vegetarian]');
                    if (item.isSpicy) badges.push('[Spicy]');
                    if (item.isDishOfWeek) badges.push('[Dish of the Week]');

                    return [
                        item.name + (badges.length > 0 ? '\n' + badges.join(' ') : ''),
                        item.description,
                        `${item.price.toFixed(2)}`
                    ];
                });

                // Add table
                autoTable(doc, {
                    startY: yPosition,
                    head: [['Item', 'Description', 'Price']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [234, 88, 12],
                        textColor: 255,
                        fontStyle: 'bold'
                    },
                    styles: {
                        fontSize: 10,
                        cellPadding: 5,
                    },
                    columnStyles: {
                        0: { cellWidth: 50 },
                        1: { cellWidth: 90 },
                        2: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
                    },
                    margin: { left: 14, right: 14 }
                });

                yPosition = (doc as any).lastAutoTable.finalY + 10;
            }
        });

        // Footer
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Page ${i} of ${totalPages} | Eesti-NaijaFood | www.eestifoods.com`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save the PDF
        doc.save('Eesti-naija-food-Menu.pdf');
        toast.success('Menu downloaded successfully!');
    };

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
        <div className="min-h-screen bg-white text-zinc-900 pt-24">
            {/* Header */}
            <section className="relative py-20 text-center bg-gradient-to-b from-orange-50 to-white">
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
                        Our Menu
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl mb-8 text-white"
                    >
                        Authentic African flavors crafted with love
                    </motion.p>
                    <motion.button
                        onClick={generatePDF}
                        whileHover={{ scale: 1.05 }}
                        className="bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition flex items-center gap-2 mx-auto"
                    >
                        <FaDownload /> Download Full Menu (PDF)
                    </motion.button>
                </div>
            </section>

            {/* ================= CATEGORY TABS ================= */}
            <section className="sticky top-20 z-40 bg-white border-b border-zinc-200 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex overflow-x-auto gap-4 pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold transition ${
                                    activeCategory === category.id
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                }`}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= MENU ITEMS ================= */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {menu && menu[activeCategory as keyof MenuData]?.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
                            >
                                <div className="relative h-56">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />

                                    {item.isVegetarian && (
                                        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                            <FaLeaf /> Vegetarian
                                        </div>
                                    )}

                                    {item.isSpicy && (
                                        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                            <FaFire /> Spicy
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                    <p className="text-zinc-600 mb-4">{item.description}</p>

                                    <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">
                    ${item.price.toFixed(2)}
                  </span>

                                        <button
                                            onClick={() => addToCart(item)}
                                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-semibold transition"
                                        >
                                            Add To Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                    </div>
                </div>
            </section>

            {/* ================= DISH OF THE WEEK ================= */}
            {dishOfTheWeek && (
                <section className="py-24 bg-zinc-50">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center bg-white p-10 rounded-3xl shadow-lg border border-zinc-200">

                            <div className="relative h-96 rounded-2xl overflow-hidden">
                                <Image
                                    src={dishOfTheWeek.image}
                                    alt={dishOfTheWeek.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div>
              <span className="text-orange-600 font-semibold">
                Dish of the Week
              </span>

                                <h3 className="text-4xl font-bold mt-3 mb-4">
                                    {dishOfTheWeek.name}
                                </h3>

                                <p className="text-zinc-600 mb-6">
                                    {dishOfTheWeek.description}
                                </p>

                                <div className="text-3xl font-bold text-orange-600 mb-6">
                                    ${dishOfTheWeek.price}
                                </div>

                                <button
                                    onClick={() => addToCart(dishOfTheWeek)}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-md hover:scale-105 transition"
                                >
                                    Add To Cart →
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ================= ORDER ONLINE ================= */}
            <section className="py-20 bg-white text-center">
                <h2 className="text-4xl font-bold mb-6">Order for Takeaway</h2>
                <p className="text-zinc-600 mb-10">
                    Craving African flavors at home? Order through our delivery partners!
                </p>

                <div className="flex flex-wrap gap-6 justify-center">
                    <a
                        href="https://food.bolt.eu/en-US/1/p/175185-eesti-naijafoods?utm_source=share_provider&utm_medium=product&utm_content=menu_header"
                        target="_blank"
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
                    >
                        Order on Bolt Food
                    </a>

                    <a
                        href="https://wolt.com/et/est/tallinn/restaurant/eesti-naijafoods"
                        target="_blank"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition"
                    >
                        Order on Wolt Delivery
                    </a>
                </div>
            </section>

        </div>
    );
}