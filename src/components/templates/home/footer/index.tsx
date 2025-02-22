import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FooterLink {
    text: string;
    href: string;
}

interface SocialLink {
    icon: string;
    href: string;
    alt: string;
}

const Footer: React.FC = () => {
    const productLinks: FooterLink[] = [
        { text: "About GOXI?", href: "#about" },
        { text: "Why GOXI", href: "#why" },
        { text: "Partners", href: "#partner" },
        { text: "FAQs", href: "#faqs" }
    ];

    const contactLinks: FooterLink[] = [
        { text: "Terms & Conditions", href: "#" },
        { text: "Privacy Statement", href: "#" }
    ];

    const socialLinks: SocialLink[] = [
        { icon: "/assets/facebook.png", href: "#", alt: "Facebook" },
        { icon: "/assets/youtube.png", href: "#", alt: "YouTube" },
        { icon: "/assets/instagram.png", href: "#", alt: "Instagram" },
        { icon: "/assets/linkedin.png", href: "#", alt: "LinkedIn" }
    ];

    return (
        <footer className="bg-gradient-to-r from-green-600 to-green-800 text-white py-6">
            <div className="md:max-w-7xl w-full mx-auto px-6 lg:px-16">
                <div className="flex sm:flex-row flex-col gap-4">
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                            {/* Products Section */}
                            <div>
                                <h4 className="font-semibold mb-2">Products</h4>
                                <ul className="space-y-1">
                                    {productLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                href={link.href}
                                                className="hover:underline transition-colors duration-200"
                                            >
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Legal Section */}
                            <div>
                                <h4 className="font-semibold mb-2">Contact US</h4>
                                <ul className="space-y-1">
                                    {contactLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                href={link.href}
                                                className="hover:underline transition-colors duration-200"
                                            >
                                                {link.text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex sm:justify-center space-x-4 mt-4">
                        {socialLinks.map((social, index) => (
                            <Link
                                key={index}
                                href={social.href}
                                className="hover:opacity-80 transition-opacity"
                            >
                                <Image
                                    src={social.icon}
                                    alt={social.alt}
                                    width={24}
                                    height={24}
                                    className="w-6 h-6"
                                />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="border-t border-green-500 mt-16 pt-4 flex justify-end items-center text-xs">
                    <p className="mt-2">
                        © {new Date().getFullYear()} Goxi MicroInsurance Ltd.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;