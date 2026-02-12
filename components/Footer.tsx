'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaHeart,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from "next/image";

type SiteDetails = {
    phoneNumber?: string;
    email?: string;
    location?: string;
    openingHours?: {
        mondayWednesday?: { open?: string; close?: string };
        thursdaySunday?: { open?: string; close?: string };
    };
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
    };
};

export default function Footer() {
    const [data, setData] = useState<SiteDetails | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/site-details`
                );
                setData(res.data.data);
            } catch (err) {
                console.error('Failed to fetch footer data', err);
            }
        };

        fetchDetails();
    }, []);

    const socials = [
        { icon: FaFacebook, href: data?.socialMedia?.facebook },
        { icon: FaInstagram, href: data?.socialMedia?.instagram },
        { icon: FaTiktok, href: data?.socialMedia?.tiktok },
        { icon: FaYoutube, href: data?.socialMedia?.youtube },
    ].filter(s => s.href); // only show if exists

    return (
        <footer className="relative bg-gradient-to-b from-zinc-950 to-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div>
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

                        <p className="text-white/60 mb-6 leading-relaxed">
                            Bringing the soul of Africa to Estonia through authentic cuisine and unforgettable experiences.
                        </p>

                        <div className="flex gap-3">
                            {socials.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white/5 backdrop-blur border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-orange-500 transition-all"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links (unchanged) */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Menu', 'Catering', 'About', 'Contact'].map((link) => (
                                <li key={link}>
                                    <Link href={`/${link.toLowerCase().replace(' ', '-')}`}>
                    <span className="text-white/60 hover:text-orange-500 transition-colors cursor-pointer flex items-center gap-2">
                      <span className="w-1 h-1 bg-orange-500 rounded-full" />
                        {link}
                    </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-white">Opening Hours</h4>

                        <div className="space-y-3 text-white/60">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span>Mon - Wed</span>
                                <span className="font-semibold">
                  {data?.openingHours?.mondayWednesday?.open || '--'} -{' '}
                                    {data?.openingHours?.mondayWednesday?.close || '--'}
                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span>Thu - Sun</span>
                                <span className="font-semibold">
                  {data?.openingHours?.thursdaySunday?.open || '--'} -{' '}
                                    {data?.openingHours?.thursdaySunday?.close || '--'}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-white">Contact Us</h4>

                        <ul className="space-y-4 text-white/60">
                            <li className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FaMapMarkerAlt className="text-orange-500" />
                                </div>
                                <span>{data?.location || 'Location coming soon'}</span>
                            </li>

                            <li className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                    <FaPhone className="text-orange-500" />
                                </div>
                                <a href={`tel:${data?.phoneNumber || ''}`} className="hover:text-orange-500 transition-colors">
                                    {data?.phoneNumber || 'Phone coming soon'}
                                </a>
                            </li>

                            <li className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                    <FaEnvelope className="text-orange-500" />
                                </div>
                                <a href={`mailto:${data?.email || ''}`} className="hover:text-orange-500 transition-colors">
                                    {data?.email || 'Email coming soon'}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar unchanged */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
                        <p className="flex items-center gap-2">
                            © 2025 Eesti-NaijaFood. Made with <FaHeart className="text-red-500" /> in {data?.location || 'Talin'}
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-orange-500">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-orange-500">Terms & Conditions</Link>
                            <Link href="/admin/dashboard" className="hover:text-orange-500">Admin</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}