// services/policyService.ts
import { PolicyDetails } from '../policy/types';

export async function fetchPolicyByNumber(policyNumber: string): Promise<PolicyDetails> {
    try {
        const response = await fetch(`/api/policies/${policyNumber}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch policy');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}