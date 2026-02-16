'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!email) {
            alert("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/checkout`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customerEmail: email,
                        items: cart.map(item => ({
                            productId: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image
                        }))
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            window.location.href = data.url;

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="bg-gray-900 p-8 rounded-full mb-6 inline-block">
                        <FaShoppingBag className="text-6xl text-gray-700" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Looks like you haven't added any of our delicious African dishes to your cart yet.
                    </p>
                    <Link href="/menu">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 mx-auto">
                            <FaArrowLeft /> Browse Menu
                        </button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-10 flex items-center gap-4">
                    Your Selection <span className="text-orange-500 text-xl font-normal">({cart.length} items)</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6"
                            >
                                <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>

                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                                    <p className="text-orange-500 font-bold text-lg mb-4">${item.price.toFixed(2)}</p>

                                    <div className="flex items-center justify-center sm:justify-start gap-4">
                                        <div className="flex items-center bg-black rounded-full border border-white/10 p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-2 hover:text-orange-500 transition-colors"
                                            >
                                                <FaMinus size={12} />
                                            </button>
                                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-2 hover:text-orange-500 transition-colors"
                                            >
                                                <FaPlus size={12} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right hidden sm:block">
                                    <p className="text-xl font-black">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 sticky top-32">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-500">Free</span>
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-orange-500">${getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm mb-2 text-gray-400">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
                                    required
                                />
                            </div>


                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Proceed to Checkout"}
                            </button>



                            <Link href="/menu" className="block text-center mt-6 text-gray-400 hover:text-white transition-colors">
                                Add more items
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}