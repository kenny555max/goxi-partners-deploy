'use client';
import React, {useEffect, useState} from 'react';
import LinkItem from './link';
import Button from './button';
import {usePathname, useRouter} from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import {FaTimes} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

// components/bottom-header.tsx
/**
 * BottomHeader Component
 *
 * Displays the bottom section of the header, including navigation links and buttons.
 *
 * Features:
 * - Responsive design with a hamburger menu for small screens.
 * - Contains navigation links and Login/Register buttons.
 *
 * State:
 * @state {boolean} isOpen - Tracks whether the mobile menu is open.
 */
const BottomHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check if scroll position is greater than 10vh
            const scrollPosition = window.scrollY;
            const threshold = window.innerHeight * 0.1; // 10% of viewport height

            if (scrollPosition > threshold) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`bg-white w-full lg:h-[60px] shadow-md transition-all duration-300 ${
            isFixed ? 'fixed top-0 left-0 z-50' : 'relative'
        }`}>
            <div className="md:max-w-[1200px] lg:h-[60px] sm:w-[80%] w-[90%] mx-auto py-2 flex justify-between items-center">
                <Link href={"/"} className="text-red-600 flex-shrink-0 text-2xl font-bold">
                    <Image src={"/assets/logo.png"} alt={"goxi-logo"} width={100} height={100} />
                </Link>
                <div className="hidden lg:flex space-x-4">
                    <LinkItem href="#about" pathname={pathname}>
                        About GOXi
                    </LinkItem>
                    <LinkItem href="#why" pathname={pathname}>
                        Why GOXi?
                    </LinkItem>
                    <LinkItem href="#partner" pathname={pathname}>
                        Partners
                    </LinkItem>
                    <LinkItem href="#testimonials" pathname={pathname}>
                        Testimonials
                    </LinkItem>
                    <LinkItem href="#faqs" pathname={pathname}>
                        FAQs
                    </LinkItem>
                </div>
                <div className="hidden lg:flex space-x-4">
                    <Button variant={"border"} onClick={() => router.push("/login")} text="Partner Login" className="red-yellow-gradient-text text-green-500 border border-green-500" />
                    <button
                        onClick={() => router.push("/register")}
                        className="flex bg-gradient-to-r text-white font-[500] text-[16px] capitalize from-custom-red to-custom-yellow items-center rounded-[10px] px-[25px] py-[12px] gap-[15px]"
                    >Become A Partner</button>
                </div>
                <button
                    className="lg:hidden text-2xl text-green-500"
                    onClick={toggleMenu}
                >
                    {isOpen ? <FaTimes /> : <RxHamburgerMenu />}
                </button>
            </div>
            {isOpen && (
                <div className="bg-white lg:hidden absolute w-full shadow-lg z-40">
                    <div className="w-full flex sm:w-[80%] mx-auto flex-col space-y-2 px-4 py-4">
                        <LinkItem pathname={pathname} className={"block w-full"} href="#about">About GOXi</LinkItem>
                        <LinkItem pathname={pathname} href="#why" className="block w-full">Why GOXi?</LinkItem>
                        <LinkItem pathname={pathname} isLinkTargetBlank={true} href="https://goxipartners.netlify.app/" className="block w-full">Partners</LinkItem>
                        <LinkItem pathname={pathname} href="#claims" className="block w-full">Claims</LinkItem>
                        <LinkItem pathname={pathname} href="#faqs" className="w-full block">FAQs</LinkItem>
                        <div className="flex space-x-4">
                            <Button variant={"border"} onClick={() => router.push("/login")} text="Partner Login" className="red-yellow-gradient-text text-green-500 border border-green-500" />

                            <button
                                onClick={() => router.push("/register")}
                                className="flex bg-gradient-to-r text-white font-[500] text-[16px] capitalize from-custom-red to-custom-yellow items-center rounded-[10px] px-[25px] py-[12px] gap-[15px]"
                            >Become A Partner
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default BottomHeader;
