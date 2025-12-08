// app/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import Image from "next/image";

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

interface ContactInfo {
    phone: string;
    email: string;
    address: any;
    hours: any;
    social: any;
}

export default function ContactPage() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/info`);
            setContactInfo(response.data.contactInfo);
        } catch (error) {
            console.error('Failed to fetch contact info:', error);
        }
    };

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, data);
            toast.success('Message sent successfully! We\'ll get back to you soon.');
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
                                                {contactInfo?.address.street || 'TBC'}<br />
                                                {contactInfo?.address.city || 'Auckland'}, {contactInfo?.address.country || 'New Zealand'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <FaPhone className="text-3xl text-orange-500 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Phone</h3>
                                            <p className="text-gray-400">{contactInfo?.phone || '+64 21 XXX XXXX'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <FaEnvelope className="text-3xl text-orange-500 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Email</h3>
                                            <p className="text-gray-400">{contactInfo?.email || 'info@afroflavours.com'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <FaClock className="text-3xl text-orange-500 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
                                            <div className="text-gray-400 space-y-1">
                                                <p>Mon - Wed: 11:00 AM - 10:00 PM</p>
                                                <p>Thu - Sun: 11:00 AM - 11:30 PM</p>
                                                <p className="text-orange-500 font-semibold mt-2">
                                                    African Experience: Thu-Sun, 9:00 PM - 11:30 PM
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                                <div className="flex gap-4">
                                    {[
                                        { icon: FaFacebook, href: contactInfo?.social.facebook, color: 'hover:text-blue-500' },
                                        { icon: FaInstagram, href: contactInfo?.social.instagram, color: 'hover:text-pink-500' },
                                        { icon: FaTiktok, href: contactInfo?.social.tiktok, color: 'hover:text-white' },
                                        { icon: FaYoutube, href: contactInfo?.social.youtube, color: 'hover:text-red-500' }
                                    ].map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`bg-gray-800 p-4 rounded-full ${social.color} transition-colors`}
                                        >
                                            <social.icon className="text-2xl" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-gray-800 rounded-2xl h-64 flex items-center justify-center overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3187.476802156153!2d174.76448827621793!3d-36.85233807228033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d47fb254457db%3A0x360c00d98b1f9a53!2sThe%20University%20of%20Auckland!5e0!3m2!1sen!2snz!4v1714214047337!5m2!1sen!2snz"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
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
                                                message: 'Invalid email'
                                            }
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
                                            minLength: { value: 10, message: 'Message must be at least 10 characters' }
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