// app/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaClock,
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
} from 'react-icons/fa';
import Image from 'next/image';

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

interface OpeningHour {
    open: string;
    close: string;
}

interface SiteDetails {
    phoneNumber?: string;
    email?: string;
    location?: string;
    openingHours?: {
        mondayWednesday?: OpeningHour;
        thursdaySunday?: OpeningHour;
    };
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
    };
}


export default function ContactPage() {
    const [site, setSite] = useState<SiteDetails | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

    useEffect(() => {
        fetchSiteDetails();
    }, []);

    const fetchSiteDetails = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/site-details`);
            setSite(res.data.data);
        } catch (error) {
            console.error('Failed to fetch site details:', error);
        }
    };

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, data);
            toast.success("Message sent successfully! We'll get back to you soon.");
            reset();
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24">
            {/* Header */}
            <section className="relative py-16 bg-gradient-to-br from-orange-600 to-red-700 text-center overflow-hidden">
                <div className="absolute inset-0 h-full">
                    <Image
                        src="/images/background.jpg"
                        alt="Afro Flavours Background"
                        width={500}
                        height={300}
                        style={{ height: "380px", width: "100%", objectFit: "cover" }}
                        priority
                    />
                </div>

                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-bold mb-4"
                    >
                        Get in Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl"
                    >
                        We'd love to hear from you
                    </motion.p>
                </div>
            </section>

            {/* Contact Info & Form */}
            <section className="py-20 bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-4xl font-bold mb-8">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <FaMapMarkerAlt className="text-3xl text-orange-500 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Address</h3>
                                            <p className="text-gray-400">
                                                {site?.location || 'Talin, Estonia'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <FaPhone className="text-3xl text-orange-500 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Phone</h3>
                                            <p className="text-gray-400">{site?.phoneNumber || '+37 25 XXX XXXX'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <FaEnvelope className="text-3xl text-orange-500 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Email</h3>
                                            <p className="text-gray-400">{site?.email || 'info@afroflavours.co.nz'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <FaClock className="text-3xl text-orange-500 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
                                            <div className="text-gray-400 space-y-1">
                                                {site?.openingHours ? (
                                                    <>
                                                        {site.openingHours.mondayWednesday && (
                                                            <p>
                                                                Mon - Wed: {site.openingHours.mondayWednesday.open} -{" "}
                                                                {site.openingHours.mondayWednesday.close}
                                                            </p>
                                                        )}
                                                        {site.openingHours.thursdaySunday && (
                                                            <p>
                                                                Thu - Sun: {site.openingHours.thursdaySunday.open} -{" "}
                                                                {site.openingHours.thursdaySunday.close}
                                                            </p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>Mon - Wed: 11:00 AM - 10:00 PM</p>
                                                        <p>Thu - Sun: 11:00 AM - 11:30 PM</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            {site?.socialMedia && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                                    <div className="flex gap-4">
                                        {[
                                            { icon: FaFacebook, href: site.socialMedia.facebook, color: 'hover:text-blue-500' },
                                            { icon: FaInstagram, href: site.socialMedia.instagram, color: 'hover:text-pink-500' },
                                            { icon: FaTiktok, href: site.socialMedia.tiktok, color: 'hover:text-white' },
                                            { icon: FaYoutube, href: site.socialMedia.youtube, color: 'hover:text-red-500' },
                                        ].map((social, index) =>
                                            social.href ? (
                                                <a
                                                    key={index}
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`bg-gray-800 p-4 rounded-full ${social.color} transition-colors`}
                                                >
                                                    <social.icon className="text-2xl" />
                                                </a>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Map */}
                            <div className="bg-gray-800 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
                                {site?.location ? (
                                    <iframe
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(site.location)}&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <p className="text-gray-400">Location not available</p>
                                )}
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-900 rounded-3xl p-8"
                        >
                            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-lg font-semibold mb-2">Name *</label>
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Name is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="Your name"
                                    />
                                    {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email',
                                            },
                                        })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        {...register('phone')}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="+64 21 XXX XXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Subject *</label>
                                    <input
                                        type="text"
                                        {...register('subject', { required: 'Subject is required' })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="How can we help?"
                                    />
                                    {errors.subject && <p className="text-red-500 mt-1">{errors.subject.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-2">Message *</label>
                                    <textarea
                                        {...register('message', {
                                            required: 'Message is required',
                                            minLength: { value: 10, message: 'Message must be at least 10 characters' },
                                        })}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="Your message..."
                                    />
                                    {errors.message && <p className="text-red-500 mt-1">{errors.message.message}</p>}
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}