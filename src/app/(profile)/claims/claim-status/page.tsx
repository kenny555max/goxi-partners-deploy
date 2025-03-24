'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Define types for our data structures
interface SearchParams {
    searchText: string;
    dateFrom: string;
    dateTo: string;
    pageNo: number;
    pageSize: number;
}

interface Claim {
    policyNo: string;
    lossNotifyDate: string;
    lossDate: string;
    lossType: string;
    lossDescription: string;
}

const ClaimStatusChecker: React.FC = () => {
    // State for search parameters with type annotation
    const [searchParams, setSearchParams] = useState<SearchParams>({
        searchText: '',
        dateFrom: '',
        dateTo: '',
        pageNo: 1,
        pageSize: 10
    });

    // State for results and loading with type annotations
    const [claims, setClaims] = useState<Claim[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: name === 'pageNo' || name === 'pageSize' ? parseInt(value, 10) : value
        }));
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy');
        } catch (error) {
            console.log(error);
            return 'Invalid Date';
        }
    };

    // Search claims
    const searchClaims = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // Build query string from search parameters (filtering out empty values)
            const queryParams = Object.entries(searchParams)
                .filter(([_, value]) => {
                    console.log(_);
                    return value !== ''
                })
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

            const response = await fetch(`/api/claims?${queryParams}`);

            if (!response.ok) {
                const errorData: { error: string } = await response.json();
                throw new Error(errorData.error || 'Failed to fetch claims');
            }

            const data: Claim[] = await response.json();
            setClaims(data);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'An error occurred while fetching claims');
            setClaims([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset search form
    const resetSearch = (): void => {
        setSearchParams({
            searchText: '',
            dateFrom: '',
            dateTo: '',
            pageNo: 1,
            pageSize: 10
        });
        setClaims([]);
        setError(null);
    };

    // Handle pagination
    const handlePageChange = (direction: 'next' | 'previous'): void => {
        setSearchParams(prev => ({
            ...prev,
            pageNo: direction === 'next' ? prev.pageNo + 1 : Math.max(1, prev.pageNo - 1)
        }));

        // Using setTimeout to ensure state is updated before search
        setTimeout(() => {
            searchClaims();
        }, 0);
    };

    return (
        <div className="bg-slate-50 p-6 flex flex-col items-center">
            <Card className="w-full max-w-4xl shadow-lg border-t-4 border-t-custom-yellow mb-6">
                <CardHeader className="bg-gradient-custom text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">Claim Status</CardTitle>
                    <p className="text-gray-100">Search for claims using the filters below</p>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Search Text Field */}
                        <div className="relative">
                            <Input
                                placeholder="Search by policy number or description"
                                name="searchText"
                                value={searchParams.searchText}
                                onChange={handleInputChange}
                                className="pl-10 border-slate-300 focus:border-custom-green focus:ring-custom-green"
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        </div>

                        {/* Date From Field */}
                        <div className="relative">
                            <Input
                                type="date"
                                name="dateFrom"
                                value={searchParams.dateFrom}
                                onChange={handleInputChange}
                                className="pl-10 border-slate-300 focus:border-custom-green focus:ring-custom-green"
                            />
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <span className="absolute left-10 top-3 text-xs text-gray-500">From</span>
                        </div>

                        {/* Date To Field */}
                        <div className="relative">
                            <Input
                                type="date"
                                name="dateTo"
                                value={searchParams.dateTo}
                                onChange={handleInputChange}
                                className="pl-10 border-slate-300 focus:border-custom-green focus:ring-custom-green"
                            />
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <span className="absolute left-10 top-3 text-xs text-gray-500">To</span>
                        </div>

                        {/* Page Size Selection */}
                        <div className="relative">
                            <label className="text-sm text-gray-500 mb-1 block">Results per page</label>
                            <select
                                name="pageSize"
                                value={searchParams.pageSize}
                                onChange={handleInputChange}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-custom-green focus:ring-custom-green"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            className="flex-1 bg-custom-green hover:bg-custom-green/90 text-white"
                            onClick={searchClaims}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Searching...' : 'Search Claims'}
                        </Button>

                        <Button
                            variant="outline"
                            className="border-slate-300 text-slate-700"
                            onClick={resetSearch}
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Claims Table */}
            {claims.length > 0 && (
                <Card className="w-full max-w-4xl shadow-lg">
                    <CardHeader className="bg-slate-100 pb-3">
                        <CardTitle className="text-xl font-bold text-slate-800">
                            Claims Results ({claims.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-slate-700">Policy No</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-700">Loss Date</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-700">Notify Date</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-700">Loss Type</th>
                                    <th className="px-6 py-3 text-left font-medium text-slate-700">Description</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y">
                                {claims.map((claim, index) => (
                                    <tr key={index} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium">{claim.policyNo}</td>
                                        <td className="px-6 py-4">{formatDate(claim.lossDate)}</td>
                                        <td className="px-6 py-4">{formatDate(claim.lossNotifyDate)}</td>
                                        <td className="px-6 py-4">{claim.lossType || 'N/A'}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={claim.lossDescription}>
                                            {claim.lossDescription || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center p-4 border-t">
                            <div className="text-sm text-slate-500">
                                Showing page {searchParams.pageNo} with {claims.length} results
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange('previous')}
                                    disabled={searchParams.pageNo <= 1 || isLoading}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange('next')}
                                    disabled={claims.length < searchParams.pageSize || isLoading}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ClaimStatusChecker;