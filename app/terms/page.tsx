// app/terms/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-24">
            {/* Header */}
            <section className="relative py-16 bg-gradient-to-br from-orange-600 to-red-700 text-center overflow-hidden">
                <div className="absolute inset-0 h-full">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/background.jpg" // Reuse your background image or replace with a suitable one
                            alt="Afro Flavours Background"
                            width={500}
                            height={300}
                            style={{ height: "380px", width: "100%", objectFit: "cover" }}
                            priority
                        />
                    </div>
                </div>
                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-bold mb-4"
                    >
                        Terms of Service
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl mb-8"
                    >
                        Guidelines for using Afro Flavours services
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-900 rounded-2xl p-8"
                    >
                        <h2 className="text-3xl font-bold mb-4">Acceptance of Terms</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            By accessing or using the Afro Flavours website or services, you acknowledge that you have read,
                            understood, and agree to be bound by these Terms of Service. If you do not agree with any part of
                            these Terms, you must discontinue use of our website and services immediately.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Use of Services</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Our website and services are intended for lawful personal use only. You agree not to engage in any
                            activity that may disrupt, damage, or interfere with the functionality or security of the platform,
                            including unauthorized access, data extraction, or the introduction of harmful software.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Accounts & User Responsibilities</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            When creating an account or placing an order, you agree to provide accurate, complete, and current
                            information. You are responsible for maintaining the confidentiality of your login details and for all
                            activities conducted under your account. Afro Flavours is not responsible for unauthorized account use.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Orders & Payments</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            All orders are subject to availability and confirmation. Prices, menu items, and promotions may change
                            without prior notice. Payments are processed securely through third-party providers, and you agree to
                            provide valid and accurate payment details. Afro Flavours reserves the right to decline or cancel orders
                            in cases of suspected fraud, errors, or unavailable items.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Delivery & Fulfillment</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Delivery times are estimates and may vary due to factors beyond our control. Afro Flavours is not liable
                            for delays caused by third-party delivery providers, traffic, weather conditions, or unforeseen
                            circumstances. Once an order is handed over to the delivery provider, responsibility for timely delivery
                            transfers to them.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Intellectual Property</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            All content on this website, including logos, images, text, graphics, and design elements, is owned by
                            or licensed to Afro Flavours. You may not copy, reproduce, distribute, or modify any content without
                            prior written permission.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Prohibited Activities</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            You agree not to engage in fraudulent activities, attempt to bypass security measures, harvest data,
                            impersonate others, or misuse our services in any way. Any violation may result in suspension or
                            termination of your access to the platform.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Limitation of Liability</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            To the fullest extent permitted by law, Afro Flavours is not liable for any indirect, incidental,
                            or consequential damages arising from your use of the website or services. This includes, but is not
                            limited to, loss of data, loss of profits, service interruptions, or issues caused by third-party
                            providers.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Third-Party Services</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Our platform may integrate or link to third-party tools, delivery partners, or payment processors.
                            These third parties operate independently and may have their own terms and policies. Afro Flavours is
                            not responsible for their actions, content, or privacy practices.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Termination of Use</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            We reserve the right to suspend or terminate your access to the website or services at our discretion,
                            particularly in cases of suspected misuse, fraud, or violation of these Terms.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Changes to Terms</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Afro Flavours may revise these Terms of Service at any time. Updates will be posted on this page, and
                            your continued use of our website after changes are made constitutes acceptance of the revised Terms.
                        </p>

                        <p className="text-gray-400 text-sm mt-8">
                            Last updated: 2025-12-06
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}