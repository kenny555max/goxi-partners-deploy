'use client';
import React, { useState, useEffect } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header>
            {/* Top Header Section */}
            <div className="top-header text-white">
                <div className="mx-auto header-inner lg:max-w-[1200px] sm:w-[80%] w-[90%] px-4 py-2">
                    <div className="flex justify-end items-center gap-4 text-white text-sm">
                        <div className="flex phone items-center gap-2">
              <span>
                <img src="/assets/phone.png" alt="phone-icon" />
              </span>
                            <span>+2349029111359</span>
                        </div>
                        <div className="flex chat items-center gap-2">
              <span>
                <img src="/assets/chat.png" alt="chat-icon" />
              </span>
                            <span>Chat support 24/7</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Header Section */}
            <nav id="bottom-header" className="bg-white bottom-header lg:h-[60px] shadow-md">
                <div className="lg:h-[60px] header-inner mx-auto py-2 flex justify-between items-center">
                    <a href="#" className="text-red-600 flex-shrink-0 text-2xl font-bold">
                        <img src="/assets/logo.png" alt="goxi-logo" width={100} height={100} />
                    </a>

                    <div className="hidden top-header-links lg:flex space-x-4">
                        {['About GOXi', 'Why GOXi?', 'Partners', 'Testimonial', 'FAQs'].map((item, index) => (
                            <a
                                key={index}
                                href={`#${item.toLowerCase().replace(/\s+/g, '').replace('?', '')}`}
                                className="px-3 nav-link py-2 rounded transition-all text-black"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="hidden lg:flex space-x-4">
                        <button className="px-4 py-2 login-button red-yellow-gradient-text">
                            Partner Login
                        </button>
                        <button className="px-4 register-button py-2 red-yellow-gradient-background text-white">
                            Become A Partner
                        </button>
                    </div>

                    <button
                        className="lg:hidden menu-button text-2xl text-green-500"
                        onClick={toggleMenu}
                    >
                        <span>{isOpen ? '✕' : '☰'}</span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`bg-white lg:hidden absolute w-full shadow-lg z-40 ${
                        isOpen ? 'block' : 'hidden'
                    }`}
                >
                    <div className="w-full flex inner-container flex-col space-y-2 px-4 py-4">
                        {['About GOXi', 'Why GOXi?', 'Partners', 'Testimonial', 'FAQs'].map((item, index) => (
                            <a
                                key={index}
                                href={`#${item.toLowerCase().replace(/\s+/g, '').replace('?', '')}`}
                                className="px-3 py-2 rounded nav-link text-black"
                            >
                                {item}
                            </a>
                        ))}
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 text-green-500">Login</button>
                            <button className="px-4 register-button py-2 bg-gradient-to-r from-green-600 to-green-800 text-white">
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;