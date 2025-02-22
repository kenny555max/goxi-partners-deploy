import React from 'react';
import Link from "next/link";
import ScrollIntoView from 'react-scroll-into-view'

// components/link.tsx
/**
 * LinkItem Component
 *
 * A reusable link component that provides hover effects and navigation.
 *
 * Props:
 * @param {string} href - The URL to navigate to when the link is clicked.
 * @param {React.ReactNode} children - The content to display inside the link.
 * @param {string} [className] - Optional additional CSS classes for styling.
 * @param {boolean} [pathname] - Optionally getting the current partname to determine the active link.
 * @param isLinkTargetBlank
 */
const LinkItem = ({ href, children, className, pathname, isLinkTargetBlank }: { isLinkTargetBlank?: boolean; pathname: string | null; href: string; children: React.ReactNode; className?: string }) => {
    const isActive = pathname === href;

    return (
        <ScrollIntoView selector="#about">
            <Link
                target={isLinkTargetBlank ? "_blank" : "_self"}
                href={href}
                className={`px-3 py-2 rounded transition-all text-black ${className} ${
                    isActive
                        ? "bg-gradient-to-r from-custom-red active bg-clip-text to-custom-yellow text-transparent"
                        : "hover:bg-gradient-to-r hover:from-custom-red hover:to-custom-yellow hover:bg-clip-text hover:text-transparent"
                }`}
            >
                {children}
            </Link>
        </ScrollIntoView>
    );
};

export default LinkItem;
