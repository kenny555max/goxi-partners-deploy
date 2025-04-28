'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowRight, Clock, Phone, Mail, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThankYouPageTemplate() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);
    const [userName, setUserName] = useState('');

    // Retrieve user information from localStorage (set during registration)
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }

        // Start countdown timer
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    // Container animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    // Child element animations
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
            {/* Main thank you content */}
            <motion.div
                className="max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header with success graphic */}
                <div className="bg-orange-500 p-8 flex flex-col items-center justify-center text-white">
                    <motion.div
                        className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4"
                        variants={itemVariants}
                    >
                        <Check size={40} className="text-orange-500" />
                    </motion.div>
                    <motion.h1
                        className="text-3xl font-bold text-center"
                        variants={itemVariants}
                    >
                        Thank You for Registering!
                    </motion.h1>
                    <motion.p
                        className="text-lg mt-2 text-center"
                        variants={itemVariants}
                    >
                        Your account has been successfully created
                    </motion.p>
                </div>

                {/* Content */}
                <div className="p-8">
                    <motion.div
                        className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8"
                        variants={itemVariants}
                    >
                        <p className="text-green-800">
                            Welcome{userName ? `, ${userName}` : ''}! Your agent account has been registered successfully.
                            You can now access all features of our platform.
                        </p>
                    </motion.div>

                    <motion.h2
                        className="text-xl font-semibold mb-4"
                        variants={itemVariants}
                    >
                        What happens next?
                    </motion.h2>

                    <motion.div
                        className="space-y-4 mb-8"
                        variants={itemVariants}
                    >
                        <div className="flex items-start">
                            <div className="bg-orange-100 p-2 rounded-full mr-4">
                                <Clock size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Account verification</h3>
                                <p className="text-gray-600">Your account is being reviewed by our team. This usually takes 24-48 hours.</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-orange-100 p-2 rounded-full mr-4">
                                <FileText size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Complete your profile</h3>
                                <p className="text-gray-600">Log in to your dashboard and complete your agent profile for faster verification.</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-orange-100 p-2 rounded-full mr-4">
                                <Mail size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-medium">Check your email</h3>
                                <p className="text-gray-600">We've sent you a confirmation email with important information.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="border-t pt-6 flex flex-col md:flex-row items-center justify-between"
                        variants={itemVariants}
                    >
                        <div className="mb-4 md:mb-0">
                            <p className="text-gray-500 flex items-center">
                                <Clock size={16} className="mr-2" />
                                Redirecting to log-in in {countdown} seconds
                            </p>
                        </div>

                        <div className="flex space-x-4">
                            <Link
                                href="#"
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Need Help?
                            </Link>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center"
                            >
                                Go to Log in <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Support contact information */}
            <motion.div
                className="mt-8 flex items-center justify-center text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <Phone size={16} className="mr-2" />
                <span className="mr-4">Support: +1 (800) 123-4567</span>
                <Mail size={16} className="mr-2" />
                <span>support@goxi.com</span>
            </motion.div>
        </div>
    );
}