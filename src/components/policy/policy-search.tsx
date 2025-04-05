'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchIcon, FileTextIcon, UserIcon, HomeIcon, PhoneIcon, MailIcon, UserCheckIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';

interface PolicyDetails {
    policyNo: string;
    product: string;
    insuredName: string;
    address: string;
    phone: string;
    email: string;
    agent: string;
    periodStart: string;
    periodEnd: string;
    nextRenewal: string;
    sumInsured: number;
    premium: number;
    status?: string;
}

const PolicySearch: React.FC = () => {
    const [searchParams, setSearchParams] = useState({
        policyNumber: '',
        holderName: '',
        status: ''
    });
    const [activeSearchField, setActiveSearchField] = useState<'policyNumber' | 'holderName'>('policyNumber');
    const [isSearching, setIsSearching] = useState(false);
    const [policyDetails, setPolicyDetails] = useState<PolicyDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));

        // Update active search field
        if (name === 'policyNumber' && value) {
            setActiveSearchField('policyNumber');
            setSearchParams(prev => ({ ...prev, holderName: '' }));
        } else if (name === 'holderName' && value) {
            setActiveSearchField('holderName');
            setSearchParams(prev => ({ ...prev, policyNumber: '' }));
        }

        // Clear previous results when input changes
        setPolicyDetails(null);
        setError(null);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that at least one search parameter is provided
        const searchField = activeSearchField === 'policyNumber' ? 'policyNumber' : 'holderName';
        if (!searchParams[searchField].trim()) {
            setError(`Please enter a ${searchField === 'policyNumber' ? 'policy number' : 'holder name'}`);
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            if (searchParams.policyNumber.trim()) {
                queryParams.append('policyNumber', searchParams.policyNumber.trim());
            }
            if (searchParams.holderName.trim()) {
                queryParams.append('holderName', searchParams.holderName.trim());
            }
            if (searchParams.status.trim()) {
                queryParams.append('status', searchParams.status.trim());
            }

            // API integration for policy search
            const response = await fetch(`/api/policies/search?${queryParams.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Policy not found');
            }

            // Handle potential array response when searching by holder name
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    throw new Error('No policies found matching your search criteria');
                }
                setPolicyDetails(data[0]); // Display the first policy
            } else {
                setPolicyDetails(data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while searching');
            setPolicyDetails(null);
        } finally {
            setIsSearching(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="shadow-lg border-t-4 border-t-custom-yellow">
                <CardHeader className="bg-gradient-custom text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">Search Policy</CardTitle>
                    <p className="text-gray-100">View your policy details</p>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex gap-3 mb-3">
                            <div className="flex-1 relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    name="policyNumber"
                                    placeholder="Search by policy number"
                                    value={searchParams.policyNumber}
                                    onChange={handleInputChange}
                                    className="pl-10 border-gray-300 focus:ring-custom-yellow focus:border-custom-yellow"
                                />
                            </div>
                            <p className="text-gray-500 self-center">or</p>
                            <div className="flex-1 relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    name="holderName"
                                    placeholder="Search by policyholder name"
                                    value={searchParams.holderName}
                                    onChange={handleInputChange}
                                    className="pl-10 border-gray-300 focus:ring-custom-yellow focus:border-custom-yellow"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSearching}
                                className="bg-custom-yellow hover:bg-yellow-600 text-white font-medium py-2 px-6 rounded-md transition-all"
                            >
                                {isSearching ? "Searching..." : "Search"}
                            </Button>
                        </div>
                    </form>

                    {error && (
                        <div className="p-4 mb-4 bg-red-50 border-l-4 border-l-custom-red text-custom-red rounded-md">
                            {error}
                        </div>
                    )}

                    {policyDetails && (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="bg-custom-green text-white p-4">
                                <h3 className="text-xl font-bold flex items-center">
                                    <FileTextIcon className="mr-2 h-5 w-5" />
                                    Policy Details
                                </h3>
                                <p className="text-green-100 text-sm">Policy Number: {policyDetails.policyNo}</p>
                                {policyDetails.status && (
                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-700 text-white">
                                        {policyDetails.status}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <UserIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Insured Name</p>
                                            <p className="text-foreground font-semibold">{policyDetails.insuredName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <HomeIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Address</p>
                                            <p className="text-foreground">{policyDetails.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <PhoneIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                            <p className="text-foreground">{policyDetails.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <MailIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                            <p className="text-foreground">{policyDetails.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <UserCheckIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Agent</p>
                                            <p className="text-foreground">{policyDetails.agent}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm text-gray-500 font-medium">Product</p>
                                        <p className="text-foreground font-semibold">{policyDetails.product}</p>
                                    </div>

                                    <div className="flex items-start">
                                        <CalendarIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Period of Cover</p>
                                            <p className="text-foreground">
                                                {policyDetails.periodStart} to {policyDetails.periodEnd}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <CalendarIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Next Renewal Date</p>
                                            <p className="text-foreground font-medium">{policyDetails.nextRenewal}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <DollarSignIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Sum Insured</p>
                                            <p className="text-foreground font-semibold">
                                                {formatCurrency(policyDetails.sumInsured)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <DollarSignIcon className="text-custom-green mr-3 h-5 w-5 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Premium</p>
                                            <p className="text-foreground font-semibold">
                                                {formatCurrency(policyDetails.premium)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                                <Button className="bg-custom-green hover:bg-green-600 text-white mr-2">
                                    Download Policy
                                </Button>
                                <Button variant="outline" className="border-custom-green text-custom-green hover:bg-green-50">
                                    Report Claim
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PolicySearch;