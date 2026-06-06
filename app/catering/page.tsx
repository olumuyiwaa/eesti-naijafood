'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUsers, FaUtensils, FaCheckCircle, FaUpload, FaTimes } from 'react-icons/fa';
import Image from "next/image";

interface CateringFormData {
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    eventType: string;
    guestCount: number;
    venue: string;
    menuPreferences?: string;
    specialRequirements?: string;
    budget?: string;
}

interface Package {
    id: number;
    name: string;
    description: string;
    minGuests: number;
    maxGuests: number;
    pricePerPerson: number;
    includes: string[];
}

interface GalleryImage {
    url: string;
    publicId: string;
}

export default function CateringPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quoteSuccess, setQuoteSuccess] = useState(false);
    const [quoteRef, setQuoteRef] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CateringFormData>();

    useEffect(() => {
        fetchPackages();
        fetchGallery();
    }, []);

    const currentImage =
        selectedImageIndex !== null
            ? images[selectedImageIndex]
            : null;

    const nextImage = () => {
        if (selectedImageIndex === null) return;

        setSelectedImageIndex(
            (selectedImageIndex + 1) % images.length
        );
    };

    const previousImage = () => {
        if (selectedImageIndex === null) return;

        setSelectedImageIndex(
            selectedImageIndex === 0
                ? images.length - 1
                : selectedImageIndex - 1
        );
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;

            if (e.key === "Escape") {
                setSelectedImageIndex(null);
            }

            if (e.key === "ArrowRight") {
                nextImage();
            }

            if (e.key === "ArrowLeft") {
                previousImage();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () =>
            window.removeEventListener("keydown", handleKey);
    }, [selectedImageIndex]);

    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/catering/packages`);
            setPackages(response.data.packages);
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        }
    };

    const fetchGallery = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`);
            setImages(response.data.images || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const openModal = (packageName?: string) => {
        if (packageName) {
            setValue('specialRequirements', `Interested in the ${packageName} package.`);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setQuoteSuccess(false);
        reset();
    };

    const onSubmit = async (data: CateringFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            if (selectedFile) {
                formData.append('attachment', selectedFile);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/catering/quote`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setQuoteRef(response.data.quoteRef);
            setQuoteSuccess(true);
            toast.success('Quote request submitted!');
            reset();
            setSelectedFile(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to submit quote request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-24">
            {/* Header */}
            <section className="relative py-32 bg-zinc-900 text-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/images/background.jpg" alt="Background" fill className="object-cover opacity-40" priority />
                </div>
                <div className="relative z-10">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold mb-4 text-white">Catering Services</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl text-white">Bring authentic African flavors to your special event</motion.p>
                    <button onClick={() => openModal()} className="mt-8 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold transition-all">Request Custom Quote</button>
                </div>
            </section>

            {/* Packages Section */}
            <section className="py-20 bg-zinc-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-5xl font-bold mb-16">Catering Packages</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        {packages.map((pkg, index) => (
                            <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.2 }} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                                <h3 className="text-3xl font-bold mb-2">{pkg.name}</h3>
                                <p className="text-zinc-600 mb-4">{pkg.description}</p>
                                <div className="text-4xl font-bold text-orange-600 mb-4">€{pkg.pricePerPerson}<span className="text-lg text-zinc-500">/person</span></div>
                                <div className="space-y-3 mb-8">
                                    {pkg.includes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-zinc-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => openModal(pkg.name)} className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all">
                                    Select {pkg.name}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 md:p-12"
                        >
                            <button onClick={closeModal} className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-900 transition-colors">
                                <FaTimes size={24} />
                            </button>

                            {quoteSuccess ? (
                                <div className="text-center py-12">
                                    <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
                                    <h2 className="text-4xl font-bold mb-4">Quote Received!</h2>
                                    <div className="bg-zinc-50 p-6 rounded-2xl mb-8 border border-zinc-200">
                                        <p className="text-lg mb-2">Reference Number:</p>
                                        <p className="text-4xl font-bold text-orange-600">{quoteRef}</p>
                                    </div>
                                    <button onClick={closeModal} className="bg-zinc-900 text-white px-8 py-3 rounded-full font-bold">Close</button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-4xl font-bold mb-2">Request a Quote</h2>
                                    <p className="text-zinc-600 mb-8">Tell us about your event and we'll prepare a custom menu for you.</p>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-zinc-700">Full Name *</label>
                                            <input type="text" {...register('name', { required: 'Name is required' })} className="w-full bg-zinc-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="John Doe" />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-zinc-700">Email *</label>
                                                <input type="email" {...register('email', { required: 'Email is required' })} className="w-full bg-zinc-100 rounded-xl px-4 py-3 outline-none" placeholder="john@example.com" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-zinc-700">Phone *</label>
                                                <input type="tel" {...register('phone', { required: 'Phone is required' })} className="w-full bg-zinc-100 rounded-xl px-4 py-3 outline-none" placeholder="+353 ..." />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-zinc-700">Event Date *</label>
                                                <input type="date" {...register('eventDate', { required: 'Date is required' })} className="w-full bg-zinc-100 rounded-xl px-4 py-3 outline-none" min={new Date().toISOString().split('T')[0]} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2 text-zinc-700">Guest Count *</label>
                                                <input type="number" {...register('guestCount', { required: 'Required', min: 10 })} className="w-full bg-zinc-100 rounded-xl px-4 py-3 outline-none" placeholder="Min 10" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-zinc-700">Venue / Location *</label>
                                            <input type="text" {...register('venue', { required: 'Required' })} className="w-full bg-zinc-100 rounded-xl px-4 py-3 outline-none" placeholder="Address or City" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2 text-zinc-700">Special Requirements</label>
                                            <textarea {...register('specialRequirements')} rows={3} className="w-full bg-zinc-100 rounded-xl px-4 py-3 outline-none" placeholder="Dietary needs, specific package interest, setup timing..." />
                                        </div>

                                        <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-6 text-center">
                                            <input type="file" onChange={handleFileChange} className="hidden" id="modal-file" />
                                            <label htmlFor="modal-file" className="cursor-pointer">
                                                <FaUpload className="text-2xl text-zinc-400 mx-auto mb-2" />
                                                <p className="text-zinc-500 text-sm">{selectedFile ? selectedFile.name : 'Upload event brief or floor plan (Optional)'}</p>
                                            </label>
                                        </div>

                                        <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-200">
                                            {isSubmitting ? 'Sending Request...' : 'Send Quote Request'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Event Types Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-5xl font-bold text-center mb-16">Events We Cater</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            { icon: '🏢', title: 'Corporate' }, { icon: '💍', title: 'Weddings' },
                            { icon: '🎂', title: 'Birthdays' }, { icon: '🎓', title: 'Graduations' },
                            { icon: '🎪', title: 'Festivals' }, { icon: '🎉', title: 'Private' }
                        ].map((event, i) => (
                            <div key={i} className="text-center p-8 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition">
                                <div className="text-5xl mb-4">{event.icon}</div>
                                <h3 className="text-xl font-bold">{event.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-20 bg-zinc-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-5xl font-bold mb-16">Experience Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img, index) => (
                            <div
                                key={img.publicId}
                                onClick={() => setSelectedImageIndex(index)}
                                className="group relative h-64 overflow-hidden rounded-2xl cursor-pointer"
                            >
                                <Image
                                    src={img.url}
                                    alt="Gallery"
                                    fill
                                    className="object-cover transition duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                                    <div className="rounded-full bg-white/20 p-4 backdrop-blur-md">
                                        🔍
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image Lightbox Modal */}
            <AnimatePresence>
                {currentImage && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImageIndex(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        />

                        {/* Previous */}
                        <button
                            onClick={previousImage}
                            className="absolute left-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                        >
                            ❮
                        </button>

                        {/* Next */}
                        <button
                            onClick={nextImage}
                            className="absolute right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                        >
                            ❯
                        </button>

                        <motion.div
                            key={currentImage.publicId}
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                            }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 250,
                            }}
                            className="relative w-full max-w-6xl"
                        >
                            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_80px_rgba(0,0,0,0.6)] backdrop-blur-md">
                                <div className="relative h-[80vh] w-full">
                                    <Image
                                        src={currentImage.url}
                                        alt="Gallery"
                                        fill
                                        priority
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Top Controls */}
                            <div className="absolute left-0 right-0 top-4 flex items-center justify-between px-4">
                                <div className="rounded-full bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-md">
                                    {selectedImageIndex! + 1} / {images.length}
                                </div>

                                <button
                                    onClick={() => setSelectedImageIndex(null)}
                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-orange-500"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </motion.div>
                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto">
                            {images.map((img, index) => (
                                <button
                                    key={img.publicId}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative h-14 w-20 overflow-hidden rounded-lg border-2 ${
                                        index === selectedImageIndex
                                            ? "border-orange-500"
                                            : "border-transparent"
                                    }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}