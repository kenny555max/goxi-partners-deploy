// src/components/Dashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Briefcase,
    Users,
    Flame,
    ShoppingCart
} from 'lucide-react';
import { AgentData } from "@/utils/agentCookies";
import { useRouter } from "next/navigation";

interface DashboardStats {
    policies: number;
    insured: number;
    claims: number;
    sales: number;
    isLoading: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
  isLoading
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    isLoading: boolean;
}) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-0 flex overflow-hidden">
            <div className={`${color} w-1/3 flex items-center justify-center py-6`}>
                {icon}
            </div>
            <div className="p-6 flex flex-col justify-center">
                {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                    <p className="text-3xl font-bold">{value}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">{title}</p>
            </div>
        </CardContent>
    </Card>
);

const Dashboard = ({ agent }: { agent: AgentData }) => {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        policies: 0,
        insured: 0,
        claims: 0,
        sales: 0,
        isLoading: true
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard');
                if (!response.ok) {
                    throw new Error("Failed to fetch dashboard data");
                }
                const data = await response.json();

                setStats({
                    policies: data.policies || 0,
                    insured: data.insured || 0,
                    claims: data.claims || 0,
                    sales: data.sales || 0,
                    isLoading: false
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setStats(prev => ({ ...prev, isLoading: false }));
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        {
            title: 'Policies',
            value: stats.policies,
            icon: <Briefcase size={36} className="text-white" />,
            color: 'bg-green-600'
        },
        {
            title: 'Insured',
            value: stats.insured,
            icon: <Users size={36} className="text-white" />,
            color: 'bg-custom-red'
        },
        {
            title: 'Claims',
            value: stats.claims,
            icon: <Flame size={36} className="text-white" />,
            color: 'bg-custom-yellow'
        },
        {
            title: 'Sales',
            value: stats.sales,
            icon: <ShoppingCart size={36} className="text-white" />,
            color: 'bg-blue-500'
        }
    ];

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl text-black font-bold">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        isLoading={stats.isLoading}
                    />
                ))}
            </div>

            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-custom-green to-custom-yellow text-white p-8 shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-3xl font-bold">Welcome to Partner Platform</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">
                        GibsPartner v1.0 is bringing you closer to your insurance partners
                    </p>
                    <div className="mt-6 bg-black/20 rounded-full p-4 text-center">
                        <p className="text-xl font-medium">{agent?.agent}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center py-8 text-gray-500">
                            <p>No recent activity to display</p>
                            <p className="mt-2 text-sm">Your recent actions will appear here</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card onClick={() => router.push('/policy/new')}  className="bg-green-600 text-white cursor-pointer hover:bg-green-700 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <p className="font-medium">Create New Policy</p>
                            <Briefcase size={24} />
                        </CardContent>
                    </Card>
                    <Card onClick={() => router.push('/claims/report-claim')} className="bg-custom-yellow text-white cursor-pointer hover:bg-yellow-600 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <p className="font-medium">Submit a Claim</p>
                            <Flame size={24} />
                        </CardContent>
                    </Card>
                    <Card className="bg-custom-red text-white cursor-pointer hover:bg-red-700 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <p className="font-medium">View Reports</p>
                            <ShoppingCart size={24} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;