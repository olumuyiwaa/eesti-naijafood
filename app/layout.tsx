import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Eesti-NaijaFood - Authentic African Cuisine in Estonia',
    description: 'Experience authentic African cuisine, live music, and cultural events in Estonia.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <body className={`${inter.className} bg-black text-white antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ToastContainer
            position="top-right"
            autoClose={5000}
            theme="dark"
            toastClassName="bg-zinc-900 text-white"
        />
        </body>
        </html>
    );
}