'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaPhone, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // ✅ Move the hook call INSIDE the component
    const { getItemCount } = useCart();
    const itemCount = getItemCount();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        { name: 'Catering', href: '/catering' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Cart', href: '/cart' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed w-full z-50 transition-all duration-500 ${
                scrolled
                    ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10 py-4'
                    : 'bg-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/">
                        <motion.div
                            className="flex items-center gap-3 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Logo Image */}
                            <Image
                                src="/images/eestifood.png"
                                alt="Eesti-NaijaFood Logo"
                                width={50}
                                height={50}
                                className="object-contain"
                            />

                            {/* Logo Text */}
                            <h1 className="text-2xl md:text-2xl font-black">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Eesti-NaijaFood
            </span>
                            </h1>
                        </motion.div>
                    </Link>


                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href}>
                                <motion.span
                                    className="text-white/80 hover:text-white font-medium transition-colors relative group cursor-pointer"
                                    whileHover={{ y: -2 }}
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300" />
                                </motion.span>
                            </Link>
                        ))}

                        <a href="/cart">
                            <motion.button
                                className="p-3 bg-white/5 backdrop-blur border border-white/10 rounded-full hover:bg-white/10 transition-all relative"
                                whileHover={{ scale: 1.1 }}
                            >
                                <FaShoppingCart className="text-orange-500" />

                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-black"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </motion.button>
                        </a>

                        <a href="tel:+64211234567">
                            <motion.button
                                className="p-3 bg-white/5 backdrop-blur border border-white/10 rounded-full hover:bg-white/10 transition-all"
                                whileHover={{ scale: 1.1 }}
                            >
                                <FaPhone className="text-orange-500" />
                            </motion.button>
                        </a>
                    </div>

                    {/* Mobile Menu Button*/}
                    <motion.button
                        className="lg:hidden p-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl"
                        onClick={() => setIsOpen(!isOpen)}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isOpen ? <FaTimes className="text-2xl text-white" /> : <FaBars className="text-2xl text-white" />}
                    </motion.button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden overflow-hidden"
                        >
                            <div className="mt-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-6 border border-white/10">
                                <div className="flex flex-col space-y-4">
                                    {navLinks.map((link, index) => (
                                        <Link key={link.name} href={link.href}>
                                            <motion.span
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="text-white hover:text-orange-500 transition-colors block py-3 text-lg font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {link.name}
                                            </motion.span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}