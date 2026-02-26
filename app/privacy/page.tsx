// app/privacy/page.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-black pt-24">
            {/* Header */}
            <section className="relative py-16 bg-gradient-to-br from-orange-600 to-red-700 text-center overflow-hidden">
                <div className="absolute inset-0 h-full">
                    <div className="absolute inset-0">
                        <Image
                            src="/images/background.jpg" // Reuse your background image or replace with a suitable one
                            alt="Eesti NaijaFood Background"
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
                        className="text-6xl font-bold mb-4 text-white"
                    >
                        Privacy Policy
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl mb-8 text-white"
                    >
                        Protecting your privacy at Eesti NaijaFood
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
                        <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Eesti NaijaFood (“we,” “our,” or “us”) is committed to safeguarding your personal information.
                            This Privacy Policy explains how we collect, use, disclose, and protect the information you provide
                            when you visit our website, place an order, or interact with our services. By using our platform,
                            you agree to the practices outlined in this Policy.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            We collect personal information that you provide directly to us, such as your name, email address,
                            phone number, delivery address, and payment details when placing an order or subscribing to our
                            communications. We also automatically collect technical data, including your IP address, device type,
                            browser information, and website usage data through cookies and similar tracking technologies.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">How We Use Your Information</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            We use your information to process and fulfill orders, provide customer support, communicate updates,
                            and improve the functionality and user experience of our website. With your consent, we may also send
                            promotional offers or marketing messages. We do not sell your information to third parties.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Sharing of Information</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            We may share your information with trusted third-party service providers who assist with payment
                            processing, order delivery, analytics, and communication services. These providers are permitted to use
                            your information only to perform tasks on our behalf. We may also disclose your information if required
                            by law or to protect our rights, property, or safety.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Cookies & Tracking</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Our website uses cookies to enhance your browsing experience, remember preferences, and analyze site
                            performance. You may disable cookies through your browser settings, but certain site features may not
                            function fully as a result.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Data Security</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            We implement reasonable administrative and technical measures to protect your information from
                            unauthorized access or misuse. While we strive to keep your data secure, we cannot guarantee absolute
                            security due to the nature of online communication.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Your Rights</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            You have the right to access, update, or request deletion of your personal information. You may also
                            withdraw consent to marketing communications at any time. To exercise your rights, please contact us at
                            <strong> <a href="mailto:info@eestifood.com" className="hover:text-orange-500 transition-colors">
                                info@eestifood.com
                            </a> </strong>.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Third-Party Links</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Our website may include links to external platforms or services. These third parties maintain their own
                            privacy practices, and we encourage you to review their policies before sharing your information with them.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Children’s Privacy</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Our services are not intended for individuals under the age of 16. We do not knowingly collect personal
                            information from children. If we become aware of such data, we will promptly delete it.
                        </p>

                        <h2 className="text-3xl font-bold mb-4">Policy Updates</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or legal
                            requirements. Continued use of our services constitutes acceptance of the updated Policy.
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