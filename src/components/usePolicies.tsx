'use client';

import { useState, useEffect } from 'react';

interface Policy {
    id: string;
    policyNo: string;
    product: string;
    insured: string;
    periodOfCover: string;
    fop: string;
    premium: number;
    sumInsured: number;
    status: 'active' | 'expired' | 'pending' | 'cancelled';
    transDate: string;
}

interface UsePoliciesResult {
    policies: Policy[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function usePolicies(type: 'individual' | 'group' = 'individual'): UsePoliciesResult {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPolicies = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/policies?type=${type}`);

            if (!response.ok) {
                let errorMessage = 'Failed to fetch policies';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // If parsing fails, use the default error message
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setPolicies(data?.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, [type]);

    return { policies, loading, error, refetch: fetchPolicies };
}