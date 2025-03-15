// components/Header.tsx
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
import {clearAgentData} from "@/utils/agentCookies";

interface HeaderProps {
    title?: string;
    username: string;
}

const Header = ({ title, username }: HeaderProps) => {
    return (
        <div className="w-full px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-medium text-gray-800">{title || 'Info! Notification Bar.'}</h1>
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
                        <span className="text-gray-700 font-medium">{username}</span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => clearAgentData()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default Header;