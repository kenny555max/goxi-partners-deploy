'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const ClaimStatusChecker = () => {
    const [claimNumber, setClaimNumber] = useState('');
    const [response, setResponse] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        setIsSearching(true);
        // Simulate API call
        setTimeout(() => {
            setResponse('Invalid claim no, try again');
            setIsSearching(false);
        }, 800);
    };

    return (
        <div className="bg-slate-50 p-6 flex items-start justify-center">
            <Card className="w-full max-w-2xl shadow-lg border-t-4 border-t-custom-yellow">
                <CardHeader className="bg-gradient-custom text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">Claim Status</CardTitle>
                    <p className="text-gray-100">Search for claim status here</p>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="relative mb-6">
                        <Input
                            placeholder="Enter your claim number"
                            value={claimNumber}
                            onChange={(e) => setClaimNumber(e.target.value)}
                            className="pl-10 border-slate-300 focus:border-custom-green focus:ring-custom-green"
                        />
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>

                    <Button
                        className="w-full bg-custom-green hover:bg-custom-green/90 text-white"
                        onClick={handleSearch}
                        disabled={isSearching || !claimNumber.trim()}
                    >
                        {isSearching ? 'Searching...' : 'Check Claim Status'}
                    </Button>

                    {response && (
                        <div className="mt-6 border rounded-md overflow-hidden">
                            <div className="bg-blue-500 text-white p-3">
                                <h3 className="font-medium">Claim No:</h3>
                            </div>
                            <div className="border-t p-4 flex justify-between items-center">
                                <span className="font-medium">Response:</span>
                                <span className="text-red-500">{response}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ClaimStatusChecker;