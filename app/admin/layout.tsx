
// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaBook, FaUtensils, FaTruck, FaEnvelope, FaStar,FaImages, FaBars, FaTimes, FaSignOutAlt ,FaBoxes} from 'react-icons/fa';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return null;
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: FaHome },
        { name: 'Site Detail', href: '/admin/details', icon: FaBook },
        { name: 'Menu', href: '/admin/menu', icon: FaUtensils },
        { name: 'Catering', href: '/admin/catering', icon: FaTruck },
        { name: 'Orders', href: '/admin/orders', icon: FaBoxes },
        // { name: 'Payments', href: '/admin/payments', icon: FaDollarSign },
        { name: 'Contact Messages', href: '/admin/messages', icon: FaEnvelope },
        { name: 'Reviews', href: '/admin/reviews', icon: FaStar },
        { name: 'Gallery', href: '/admin/gallery', icon: FaImages },
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 ${
                    isSidebarOpen ? 'w-64' : 'w-20'
                }`}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        {isSidebarOpen && (
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                                Eesti-NaijaFood
                            </h1>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-white p-2 hover:bg-gray-800 rounded-lg"
                        >
                            {isSidebarOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                    <nav className="space-y-2">
                        {navigation.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        pathname === item.href
                                            ? 'bg-orange-600 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <item.icon className="text-xl" />
                                    {isSidebarOpen && <span>{item.name}</span>}
                                </div>
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-8 flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-gray-800 transition-colors"
                    >
                        <FaSignOutAlt className="text-xl" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
        <div className="mt-0">
            <div
                className={`transition-all duration-300 ${
                    isSidebarOpen ? 'ml-64' : 'ml-20'
                }`}
            >
                {/*<header className="bg-gray-900 border-b border-gray-800 px-8 py-4">*/}
                    {/*<div className="flex items-center justify-between">*/}
                    {/*    <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>*/}
                    {/*    <div className="flex items-center gap-4">*/}
                    {/*        <span className="text-gray-400">Welcome, Admin</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                {/*</header>*/}

                <main className="p-8 pt-32">{children}</main>
            </div>
            </div>
        </div>
    );
}