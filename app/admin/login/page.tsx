'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaLock, FaUser } from 'react-icons/fa';

interface LoginFormData {
    email: string;
    password: string;
}

type LoginResponse = { token: string };

export default function AdminLogin() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!baseUrl) {
                toast.error('Missing Configuration');
                return;
            }

            const res = await fetch(`${baseUrl}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Backend expects { username, password }. We map email -> username here.
                body: JSON.stringify({ username: data.email, password: data.password }),
            });

            const payload = (await res.json().catch(() => ({}))) as Partial<LoginResponse> & { message?: string };

            if (!res.ok) {
                toast.error(payload.message || 'Invalid credentials');
                return;
            }

            if (!payload.token) {
                toast.error('Login failed: missing token');
                return;
            }

            // Note: localStorage is convenient but not the most secure place for JWTs.
            localStorage.setItem('adminToken', payload.token);

            toast.success('Login successful!');
            router.push('/admin/dashboard');
        } catch (error) {
            toast.error('Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-2">
                        Eesti-NaijaFood
                    </h1>
                    <p className="text-2xl text-white">Admin Portal</p>
                </div>

                <div className="bg-gray-900 rounded-3xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
                        <div>
                            <label className="block text-white text-lg font-semibold mb-2">Email / Username</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    {...register('email', { required: 'Email / username is required' })}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="<ADMIN_USERNAME>"
                                    autoComplete="username"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-white text-lg font-semibold mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-full text-xl font-semibold transition-all mt-8"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}