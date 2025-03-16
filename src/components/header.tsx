// components/Header.tsx
'use client'

import React from 'react';
import { User, Bell, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/app/actions/auth-actions';
import {AgentData} from "@/utils/agentCookies";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
    agent: AgentData
}

const Header = ({ agent }: HeaderProps) => {
    return (
        <div className="w-full px-6 py-4 md:pl-64 bg-white border-b border-gray-200 flex justify-between items-center">
            <div>
                <Link href={"/dashboard"} className="text-red-600 flex-shrink-0 text-2xl font-bold">
                    <Image src={"/assets/logo.png"} alt={"goxi-logo"} width={100} height={100} />
                </Link>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <Bell size={20} className="text-gray-500" />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-2 rounded-full py-1 px-2 hover:bg-gray-100">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <User size={18} className="text-gray-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{agent?.agent?.split(' ')[0]}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/**<DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>*/}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={async () => {
                            await logout();

                            window.location.reload();
                        }}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default Header;