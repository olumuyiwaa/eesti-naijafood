'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaSave, FaPhone, FaMapMarkerAlt, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import Image from "next/image";

interface OpeningHours {
    open: string;
    close: string;
}

interface SocialMedia {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
}

interface SiteDetailsForm {
    about: {
        text: string;
    };
    missionStatement: string;
    phoneNumber: string;
    location: string;
    email: string;
    openingHours: {
        mondayWednesday: OpeningHours;
        thursdaySunday: OpeningHours;
    };
    socialMedia: SocialMedia;
}

export default function AdminSiteDetails() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<SiteDetailsForm>({
        defaultValues: {
            about: { text: '' },
            missionStatement: '',
            phoneNumber: '',
            location: '',
            email: '',
            openingHours: {
                mondayWednesday: { open: '', close: '' },
                thursdaySunday: { open: '', close: '' },
            },
            socialMedia: {
                facebook: '',
                instagram: '',
                tiktok: '',
                youtube: '',
            },
        },
    });

    useEffect(() => {
        fetchSiteDetails();
    }, []);

    const fetchSiteDetails = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/site-details`);
            const data = response.data.data;

            // Build form-safe object
            const formValues: SiteDetailsForm = {
                about: {
                    text: data?.about?.text || '',
                },
                missionStatement: data?.missionStatement || '',
                phoneNumber: data?.phoneNumber || '',
                location: data?.location || '',
                email: data?.email || '',
                openingHours: {
                    mondayWednesday: {
                        open: data?.openingHours?.mondayWednesday?.open || '',
                        close: data?.openingHours?.mondayWednesday?.close || '',
                    },
                    thursdaySunday: {
                        open: data?.openingHours?.thursdaySunday?.open || '',
                        close: data?.openingHours?.thursdaySunday?.close || '',
                    },
                },
                socialMedia: {
                    facebook: data?.socialMedia?.facebook || '',
                    instagram: data?.socialMedia?.instagram || '',
                    tiktok: data?.socialMedia?.tiktok || '',
                    youtube: data?.socialMedia?.youtube || '',
                },
            };

            // ✅ This is the magic
            reset(formValues);

            // Set image
            if (data?.about?.image) {
                setCurrentImage(data.about.image);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch site details');
        } finally {
            setLoading(false);
        }
    };


    const onSubmit = async (formData: SiteDetailsForm) => {
        try {
            setSaving(true);

            const multipartData = new FormData();

            // Append form fields
            multipartData.append('about', JSON.stringify({
                text: formData.about.text,
            }));
            multipartData.append('missionStatement', formData.missionStatement);
            multipartData.append('phoneNumber', formData.phoneNumber);
            multipartData.append('location', formData.location);
            multipartData.append('email', formData.email);
            multipartData.append('openingHours', JSON.stringify(formData.openingHours));
            multipartData.append('socialMedia', JSON.stringify(formData.socialMedia));

            // Attach image if selected
            if (selectedImage) {
                multipartData.append('image', selectedImage);
            }

            // Get token from localStorage
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error('No authentication token found. Please log in again.');
                return;
            }

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/site-details`,
                multipartData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            toast.success('Site details updated successfully');
            setSelectedImage(null);
            setPreviewImage(null);
            fetchSiteDetails(); // Refresh data
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    toast.error('Unauthorized. Please log in again.');
                } else {
                    toast.error(err.response?.data?.message || 'Failed to update site details');
                }
            } else {
                toast.error('Failed to update site details');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-2xl">Loading site details...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white">Site Details Management</h1>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl p-8"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* About Section */}
                    <div className="border-b border-gray-700 pb-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaEnvelope className="text-orange-500" /> About
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-white font-semibold mb-2">About Text *</label>
                                <textarea
                                    {...register('about.text', { required: true })}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="Write about your restaurant..."
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">About Image</label>

                                {currentImage && !previewImage && (
                                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden border border-gray-700">
                                        <Image
                                            src={currentImage}
                                            alt="Current about image"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setSelectedImage(file || null);
                                        if (file) {
                                            setPreviewImage(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
                                />

                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        className="mt-3 rounded-lg max-h-48 object-cover border border-gray-700"
                                        alt="Preview"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mission Statement */}
                    <div className="border-b border-gray-700 pb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Mission Statement</h2>

                        <div>
                            <label className="block text-white font-semibold mb-2">Mission Statement *</label>
                            <textarea
                                {...register('missionStatement', { required: true })}
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                placeholder="Enter your mission statement..."
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-b border-gray-700 pb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                    <FaPhone className="text-orange-500" /> Phone Number *
                                </label>
                                <input
                                    {...register('phoneNumber', { required: true })}
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                    <FaEnvelope className="text-orange-500" /> Email *
                                </label>
                                <input
                                    {...register('email', { required: true })}
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="contact@afroflavours.com"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-orange-500" /> Location *
                            </label>
                            <input
                                {...register('location', { required: true })}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                placeholder="123 Main Street, City, Country"
                            />
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="border-b border-gray-700 pb-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <FaClock className="text-orange-500" /> Opening Hours
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Monday - Wednesday */}
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-white mb-4">Monday - Wednesday</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 font-semibold mb-2">Opening Time</label>
                                        <input
                                            type="time"
                                            {...register('openingHours.mondayWednesday.open')}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 font-semibold mb-2">Closing Time</label>
                                        <input
                                            type="time"
                                            {...register('openingHours.mondayWednesday.close')}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thursday - Sunday */}
                            <div className="bg-gray-800 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-white mb-4">Thursday - Sunday</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 font-semibold mb-2">Opening Time</label>
                                        <input
                                            type="time"
                                            {...register('openingHours.thursdaySunday.open')}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 font-semibold mb-2">Closing Time</label>
                                        <input
                                            type="time"
                                            {...register('openingHours.thursdaySunday.close')}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-orange-500 focus:outline-none text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="pb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Social Media Links</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                    <FaFacebook className="text-blue-600" /> Facebook
                                </label>
                                <input
                                    {...register('socialMedia.facebook')}
                                    type="url"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="https://facebook.com/afroflavours"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                    <FaInstagram className="text-pink-600" /> Instagram
                                </label>
                                <input
                                    {...register('socialMedia.instagram')}
                                    type="url"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="https://instagram.com/afroflavours"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                    <FaTiktok className="text-black" /> TikTok
                                </label>
                                <input
                                    {...register('socialMedia.tiktok')}
                                    type="url"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="https://tiktok.com/@afroflavours"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                                    <FaYoutube className="text-red-600" /> YouTube
                                </label>
                                <input
                                    {...register('socialMedia.youtube')}
                                    type="url"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="https://youtube.com/@afroflavours"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                            <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
