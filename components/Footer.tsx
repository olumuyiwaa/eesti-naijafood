// components/Footer.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-zinc-950 to-black border-t border-white/5">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div>
                        <h3 className="text-3xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Afroflavours
              </span>
                        </h3>
                        <p className="text-white/60 mb-6 leading-relaxed">
                            Bringing the soul of Africa to Auckland through authentic cuisine, vibrant music, and unforgettable experiences.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: FaFacebook, href: '#', color: 'hover:text-blue-500' },
                                { icon: FaInstagram, href: '#', color: 'hover:text-pink-500' },
                                { icon: FaTiktok, href: '#', color: 'hover:text-white' },
                                { icon: FaYoutube, href: '#', color: 'hover:text-red-500' },
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 bg-white/5 backdrop-blur border border-white/10 rounded-xl flex items-center justify-center text-white/60 ${social.color} transition-all`}
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {['Menu', 'Bookings', 'Catering', 'African Experience', 'About', 'Contact'].map((link) => (
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
                                <span className="font-semibold">11am - 10pm</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span>Thu - Sun</span>
                                <span className="font-semibold">11am - 11:30pm</span>
                            </div>
                            <div className="mt-4 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl">
                                <p className="text-orange-400 font-bold mb-1">African Experience</p>
                                <p className="text-sm">Thu - Sun: 9pm - 11:30pm</p>
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
                                <span>Auckland, New Zealand</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                    <FaPhone className="text-orange-500" />
                                </div>
                                <a href="tel:+64211234567" className="hover:text-orange-500 transition-colors">
                                    +64 21 XXX XXXX
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                    <FaEnvelope className="text-orange-500" />
                                </div>
                                <a href="mailto:info@afroflavours.com" className="hover:text-orange-500 transition-colors">
                                    info@afroflavours.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                {/*<div className="mb-16">*/}
                {/*    <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 md:p-12 border border-white/10">*/}
                {/*        <div className="max-w-2xl mx-auto text-center">*/}
                {/*            <h4 className="text-3xl font-bold mb-4 text-white">Stay Connected</h4>*/}
                {/*            <p className="text-white/60 mb-6">Subscribe for updates on events, new dishes, and exclusive offers!</p>*/}
                {/*            <form className="flex flex-col sm:flex-row gap-4">*/}
                {/*                <input*/}
                {/*                    type="email"*/}
                {/*                    placeholder="your.email@example.com"*/}
                {/*                    className="flex-1 px-6 py-4 rounded-full bg-white/5 backdrop-blur border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 transition-all"*/}
                {/*                />*/}
                {/*                <motion.button*/}
                {/*                    type="submit"*/}
                {/*                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-bold shadow-lg shadow-orange-500/30"*/}
                {/*                    whileHover={{ scale: 1.05 }}*/}
                {/*                    whileTap={{ scale: 0.95 }}*/}
                {/*                >*/}
                {/*                    Subscribe*/}
                {/*                </motion.button>*/}
                {/*            </form>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
                        <p className="flex items-center gap-2">
                            © 2025 Afroflavours. Made with <FaHeart className="text-red-500" /> in Auckland
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms & Conditions</Link>
                            <Link href="/admin/dashboard" className="hover:text-orange-500 transition-colors">Admin</Link>
                        </div>
                    </div>
                    <p className="text-center mt-4 text-white/30 text-xs">
                        Please drink responsibly. 18+ to purchase alcohol.
                    </p>
                </div>
            </div>
        </footer>
    );
}