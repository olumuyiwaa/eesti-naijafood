// app/admin/menu/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import {FaPlus, FaEdit, FaTrash, FaStar, FaLeaf, FaFire} from 'react-icons/fa';
import Image from "next/image";

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isVegetarian?: boolean;
    isSpicy?: boolean;
    isDishOfWeek?: boolean;
    isAvailable?: boolean;
}

interface MenuData {
    starters: MenuItem[];
    mains: MenuItem[];
    sides: MenuItem[];
    desserts: MenuItem[];
    nonAlcoholic: MenuItem[];
    alcoholic: MenuItem[];
}

export default function AdminMenu() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);


    const { register, handleSubmit, reset, setValue } = useForm<MenuItem>();

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`);
            const menu = response.data.menu || {};

            const flatMenu = [
                ...(menu.starters || []).map((i: MenuItem) => ({ ...i, category: "starters" })),
                ...(menu.mains || []).map((i: MenuItem) => ({ ...i, category: "mains" })),
                ...(menu.sides || []).map((i: MenuItem) => ({ ...i, category: "sides" })),
                ...(menu.desserts || []).map((i: MenuItem) => ({ ...i, category: "desserts" })),
                ...(menu.nonAlcoholic || []).map((i: MenuItem) => ({ ...i, category: "nonAlcoholic" })),
                ...(menu.alcoholic || []).map((i: MenuItem) => ({ ...i, category: "alcoholic" })),
            ];

            setMenuItems(flatMenu);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
            } else {
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-2xl">Loading menu...</div>
            </div>
        );
    }

    const onSubmit = async (data:MenuItem) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            // @ts-ignore
            formData.append("price", data.price);
            formData.append("description", data.description);
            formData.append("category", data.category);
            formData.append("isVegetarian", data.isVegetarian ? "true" : "false");
            formData.append("isSpicy", data.isSpicy ? "true" : "false");
            formData.append("isAvailable", data.isAvailable ? "true" : "false");
            formData.append("isDishOfWeek", data.isDishOfWeek ? "true" : "false");

            // attach file if selected
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const url = editingItem
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/menu/${editingItem.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/menu`;

            const method = editingItem ? "put" : "post";

            const response = await axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success(editingItem ? "Item updated" : "Item added");

            setShowModal(false);
            reset();
            setEditingItem(null);
            setSelectedImage(null);
            setPreviewImage(null);

            fetchMenuItems(); // refresh list
        } catch (err) {
            console.error(err);
            toast.error("Failed to save item");
        }
    };



    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        Object.entries(item).forEach(([key, value]) => {
            setValue(key as any, value);
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${id}`);
            toast.success('Menu item deleted successfully');
            fetchMenuItems();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete menu item');
        }
    };


    const categories = ['all', 'starters', 'mains', 'sides', 'desserts', 'nonAlcoholic', 'alcoholic'];
    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-black">Menu Management</h1>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        reset();
                        setShowModal(true);
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                    <FaPlus /> Add Menu Item
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${
                            selectedCategory === category
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-2xl overflow-hidden"
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
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                <span className="text-2xl font-bold text-orange-500">${item.price.toFixed(2)}</span>
                            </div>
                            <p className="text-gray-400 mb-4">{item.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white capitalize">
                  {item.category}
                </span>
                                {item.isVegetarian && (
                                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm text-white">
                    Vegetarian
                  </span>
                                )}
                                {item.isSpicy && (
                                    <span className="bg-red-600 px-3 py-1 rounded-full text-sm text-white">
                    Spicy
                  </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    <FaEdit /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">
                            {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white font-semibold mb-2">Name *</label>
                                    <input
                                        {...register('name', { required: true })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="Dish name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('price', { required: true })}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Description *</label>
                                <textarea
                                    {...register('description', { required: true })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="Describe the dish"
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Category *</label>
                                <select
                                    {...register('category', { required: true })}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                >
                                    <option value="">Select category</option>
                                    <option value="starters">Starters</option>
                                    <option value="mains">Mains</option>
                                    <option value="sides">Sides</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="nonAlcoholic">Non-Alcoholic Drinks</option>
                                    <option value="alcoholic">Alcoholic Drinks</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Image</label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        // @ts-ignore
                                        setSelectedImage(file);
                                        if (file) {
                                            // @ts-ignore
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

                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 text-white">
                                    <input type="checkbox" {...register('isVegetarian')} className="w-5 h-5" />
                                    <span>Vegetarian</span>
                                </label>
                                <label className="flex items-center gap-2 text-white">
                                    <input type="checkbox" {...register('isSpicy')} className="w-5 h-5" />
                                    <span>Spicy</span>
                                </label>
                                <label className="flex items-center gap-2 text-white">
                                    <input type="checkbox" {...register('isAvailable')} className="w-5 h-5" />
                                    <span>Available</span>
                                </label>
                                <label className="flex items-center gap-2 text-white">
                                    <input type="checkbox" {...register('isDishOfWeek')} className="w-5 h-5" />
                                    <span>Dish of the Week</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                >
                                    {editingItem ? 'Update Item' : 'Add Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        reset();
                                        setEditingItem(null);
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