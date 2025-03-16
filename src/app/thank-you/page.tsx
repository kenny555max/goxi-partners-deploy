'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, ArrowRight, Clock, Phone, Mail, FileText, Copy, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThankYouPage() {
    const router = useRouter();
    const searchParams = new URLSearchParams(window.location.search);
    const agentId = searchParams.get('agentId');
    const [countdown, setCountdown] = useState(10);
    const [userName, setUserName] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(true);
    const [copied, setCopied] = useState(false);
    const [attemptedClose, setAttemptedClose] = useState(false);

    // Copy agent ID to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(agentId)
            .then(() => {
                setCopied(true);
                // Reset copied state after 3 seconds for visual feedback
                setTimeout(() => setCopied(false), 3000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    // Handle modal close attempt
    const handleCloseAttempt = () => {
        if (copied) {
            setShowModal(false);
        } else {
            setAttemptedClose(true);
        }
    };

    // Retrieve user information from localStorage (set during registration)
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }

        // Only start countdown if modal is closed
        if (!showModal) {
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
        }
    }, [router, showModal]);

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

    // Modal animations
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
            {/* Agent ID Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Modal Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center"
                        >
                            {/* Modal Content */}
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 z-50 overflow-hidden"
                            >
                                {/* Modal Header */}
                                <div className="bg-orange-500 p-6 flex items-center">
                                    <AlertTriangle size={24} className="text-white mr-3" />
                                    <h2 className="text-xl font-bold text-white">Important: Save Your Agent ID</h2>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6">
                                    <p className="text-gray-700 mb-4">
                                        Your unique Agent ID is required for all future logins. Without this ID, you <span className="font-bold">will not</span> be able to access your account.
                                    </p>

                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                        <p className="text-sm text-orange-800 mb-2 font-medium">Your Agent ID:</p>
                                        <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden">
                                            <div className="p-3 flex-1 font-mono text-lg select-all overflow-x-auto">
                                                {agentId}
                                            </div>
                                            <button
                                                onClick={copyToClipboard}
                                                className={`p-3 flex items-center justify-center ${copied ? 'bg-green-500' : 'bg-orange-500'} text-white transition-colors`}
                                                aria-label="Copy to clipboard"
                                            >
                                                {copied ? <Check size={20} /> : <Copy size={20} />}
                                            </button>
                                        </div>
                                        {copied && (
                                            <p className="text-green-600 text-sm mt-2 flex items-center">
                                                <Check size={16} className="mr-1" /> Copied to clipboard!
                                            </p>
                                        )}
                                    </div>

                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                        <div className="flex">
                                            <AlertTriangle size={20} className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-yellow-800 font-medium">Important Warning</p>
                                                <p className="text-yellow-700">
                                                    Please copy and store this ID in a secure location. For security reasons, we cannot recover this ID if you lose it.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {attemptedClose && !copied && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                            <p className="text-red-800">
                                                Please copy your Agent ID before continuing. This is required for future access to your account.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            {copied ? '✓ ID copied successfully' : 'Copy ID before continuing'}
                                        </div>
                                        <button
                                            onClick={handleCloseAttempt}
                                            className={`px-4 py-2 rounded-md flex items-center ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} text-white transition-colors`}
                                        >
                                            {copied ? 'Continue' : 'I\'ve Saved My ID'} <ArrowRight size={16} className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main thank you content (slightly dimmed when modal is open) */}
            <motion.div
                className={`max-w-3xl w-full bg-white rounded-2xl shadow-lg overflow-hidden ${showModal ? 'opacity-40' : 'opacity-100'} transition-opacity`}
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