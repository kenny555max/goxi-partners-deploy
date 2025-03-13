// components/Layout.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {Sidebar} from "lucide-react";
import Header from "@/components/header";
import {SidebarProvider, useSidebar} from "@/components/sidebar/context";

interface LayoutProps {
    children: React.ReactNode;
    username: string;
    pagetitle?: string;
}

// Inner component that uses the sidebar context
const LayoutContent = ({ children, username, pagetitle }: LayoutProps) => {
    const { isOpen } = useSidebar();

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => useSidebar().toggleSidebar()}
                />
            )}

            <motion.div
                className="flex-1 flex flex-col"
                initial={{ x: 0 }}
                animate={{
                    marginLeft: isOpen ? "16rem" : "0",
                    width: isOpen ? "calc(100% - 16rem)" : "100%"
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
            >
                <Header title={pagetitle} username={username} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </motion.div>
        </div>
    );
};

// Wrapper component that provides the context
const Layout = (props: LayoutProps) => {
    return (
        <SidebarProvider>
            <LayoutContent {...props} />
        </SidebarProvider>
    );
};

export default Layout;