'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Home,
    Briefcase,
    Users,
    Search,
    Flame,
    ChevronDown
} from 'lucide-react';

interface SidebarItemProps {
    icon: React.ReactNode;
    text: string;
    href: string;
    subItems?: { text: string; href: string }[];
}

const SidebarItem = ({ icon, text, href, subItems }: SidebarItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubItems = subItems && subItems.length > 0;

    return (
        <div>
            <Link
                href={hasSubItems ? '#' : href}
                onClick={hasSubItems ? () => setIsOpen(!isOpen) : undefined}
                className="flex items-center p-3 text-gray-200 hover:bg-black/20 rounded-md transition-colors group"
            >
                <div className="mr-3">{icon}</div>
                <span>{text}</span>
                {hasSubItems && (
                    <ChevronDown
                        size={16}
                        className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
            </Link>

            {hasSubItems && isOpen && (
                <div className="ml-10 space-y-1 mt-1">
                    {subItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="block py-2 px-3 text-gray-300 hover:text-white hover:bg-black/10 rounded-md transition-colors text-sm"
                        >
                            {item.text}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ toggleSidebar, handleSidebarToggle }: { toggleSidebar: boolean; handleSidebarToggle: any }) => {
    const sidebarItems: SidebarItemProps[] = [
        {
            icon: <Home size={20} />,
            text: 'Dashboard',
            href: '/dashboard'
        },
        {
            icon: <Briefcase size={20} />,
            text: 'Policy',
            href: '/policy',
            subItems: [
                { text: 'New', href: '/policy/new' },
                { text: 'Existing', href: '/policy/all' }
            ]
        },
        {
            icon: <Users size={20} />,
            text: 'Group Policy',
            href: '/group-policy',
            subItems: [
                { text: 'Individual Life', href: '/group-policy/individual-life' },
                { text: 'Group Life', href: '/group-policy/group-life' },
                { text: 'Direct Upload', href: '/group-policy/direct-upload' }
            ]
        },
        {
            icon: <Search size={20} />,
            text: 'Enquiries',
            href: '/enquiries'
        },
        {
            icon: <Flame size={20} />,
            text: 'Claims',
            href: '/claims',
            subItems: [
                { text: 'Report Claim', href: '/claims/report-claim' },
                { text: 'Claim Status', href: '/claims/claim-status' },
            ]
        }
    ];

    return (
        <div className={`bg-gray-800 animate-in animate-out z-50 ${toggleSidebar && "w-64"} w-0 md:w-64 h-screen fixed left-0 top-0 overflow-y-auto`}>
            <div className="bg-blue-500 flex items-center justify-between py-4 px-6">
                <h1 className="text-white font-bold text-xl">PARTNERS PLATFORM</h1>
                <button className="md:hidden text-white block" onClick={() => handleSidebarToggle(false)}>X</button>
            </div>

            <nav className="mt-6 px-4 space-y-2">
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        text={item.text}
                        href={item.href}
                        subItems={item.subItems}
                    />
                ))}
            </nav>
        </div>
    );
};

export default  Sidebar;