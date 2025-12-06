// app/admin/gallery/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Image from 'next/image';

interface GalleryImage {
    url: string;
    publicId: string;
}

interface UploadForm {
    title?: string;
    image: File | null;
}

export default function AdminGallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { register, handleSubmit, reset } = useForm<UploadForm>();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`);
            setImages(response.data.images || []);
        } catch (error) {
            console.error('Error fetching images:', error);
            toast.error('Failed to load gallery images');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: UploadForm) => {
        try {
            const formData = new FormData();
            if (data.title) {
                formData.append('title', data.title);
            }
            if (data.image) {
                formData.append('image', data.image);
            } else {
                toast.error('Please select an image to upload');
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Image uploaded successfully');
            setShowModal(false);
            reset();
            setPreviewImage(null);
            fetchImages();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        }
    };

    const handleDelete = async (publicId: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${publicId}`);
            toast.success('Image deleted successfully');
            fetchImages();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete image');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-2xl">Loading gallery...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white">Gallery Management</h1>
                <button
                    onClick={() => {
                        reset();
                        setPreviewImage(null);
                        setShowModal(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                    <FaPlus /> Add Image
                </button>
            </div>

            {/* Images Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img) => (
                    <motion.div
                        key={img.publicId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-2xl overflow-hidden"
                    >
                        <div className="relative h-48">
                            <Image
                                src={img.url}
                                alt="Gallery image"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(img.publicId)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">Upload Image</h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-white font-semibold mb-2">Title (optional)</label>
                                <input
                                    {...register('title')}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="Image title"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Image *</label>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg"
                                    {...register('image', { required: true })}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
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

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                >
                                    Upload Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        reset();
                                        setPreviewImage(null);
                                    }}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}