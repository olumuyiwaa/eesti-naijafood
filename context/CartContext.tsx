'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void; // Added this
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product._id);

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            toast.success(`${product.name} added to cart!`);

            return [
                ...prevCart,
                {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                }
            ];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        toast.info("Item removed from cart");
    };

    const clearCart = () => setCart([]);
    const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const getItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};