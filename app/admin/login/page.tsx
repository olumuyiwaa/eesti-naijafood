// app/admin/login/page.tsx
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

export default function AdminLogin() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
            // TODO: Implement actual authentication
            // For now, using simple check
            if (data.email === 'admin@afroflavours.com' && data.password === 'admin123') {
                localStorage.setItem('adminToken', 'demo-token');
                toast.success('Login successful!');
                router.push('/admin/dashboard');
            } else {
                toast.error('Invalid credentials');
            }
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
                        Afroflavours
                    </h1>
                    <p className="text-2xl text-white">Admin Portal</p>
                </div>

                <div className="bg-gray-900 rounded-3xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
                        <div>
                            <label className="block text-white text-lg font-semibold mb-2">Email</label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-orange-500 focus:outline-none text-white"
                                    placeholder="test@server.com"
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

                    {/*<p className="text-center text-gray-500 mt-6">*/}
                    {/*    Demo credentials: admin@afroflavours.com / admin123*/}
                    {/*</p>*/}
                </div>
            </motion.div>
        </div>
    );
}