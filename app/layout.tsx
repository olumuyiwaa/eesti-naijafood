import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
    title: 'Eesti-NaijaFood - Authentic African Cuisine in Estonia',
    description: 'Experience authentic African cuisine and cultural events in Estonia.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <head>
            <link rel="icon" href="/images/eestifood.png" />
            <title>Eesti NaijaFood</title>
        </head>
        <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#050505] text-white antialiased`}>
        {/* Subtle Background Glow */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-900/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
        </div>

        <CartProvider>
            <Navbar />
            <main className="min-h-screen relative">{children}</main>
            <Footer />
        </CartProvider>

        <ToastContainer
            position="bottom-right"
            autoClose={4000}
            theme="dark"
            toastClassName="bg-zinc-900 border border-zinc-800 text-white rounded-xl shadow-2xl"
        />
        </body>
        </html>
    );
}