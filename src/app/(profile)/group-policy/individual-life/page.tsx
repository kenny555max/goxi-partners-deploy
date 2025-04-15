// app/individual-life/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import PolicyTable from "@/components/policy-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the policy type to match what the API returns
// You'll need to adjust this based on the actual API response structure
interface PolicyData {
    id: string;
    policyNumber?: string;
    customerName?: string;
    productType?: string;
    premium?: number;
    sumInsured?: number;
    startDate?: string;
    status?: string;
    // Add other fields that your API returns and that you want to display
}

export default function IndividualLifePage() {
    // State to store the fetched policies
    const [policies, setPolicies] = useState<PolicyData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch policies from our API route
    const fetchPolicies = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/policies/individual-life');

            if (!response.ok) {
                throw new Error(`Failed to fetch policies: ${response.statusText}`);
            }

            const data = await response.json();

            console.log(data);

            // Assuming the API returns an array of policies directly
            // If the structure is different, you'll need to adjust this
            setPolicies(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error('Error fetching policies:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setPolicies([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch policies when the component mounts
    useEffect(() => {
        fetchPolicies();
    }, []);

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="border-b border-slate-200 bg-slate-50">
                    <CardTitle className="text-xl font-semibold text-gray-800 mb-6">My Policies</CardTitle>
                    <p className="text-gray-600 mb-6">
                        Find below all the insurance policies you have registered with us
                    </p>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-green"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            <p>Error loading policies: {error}</p>
                            <button
                                onClick={fetchPolicies}
                                className="mt-4 px-4 py-2 bg-custom-green text-white rounded-md hover:bg-opacity-90"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : policies.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No policies found</p>
                        </div>
                    ) : (
                        <PolicyTable policyType={"individual"} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}