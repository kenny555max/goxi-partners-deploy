// utils/agentCookies.ts
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// Define the agent data structure
export interface AgentData {
    agentID: string;
    unitID: string;
    agent: string;
    email: string;
    address: string;
    phone1: string;
    phone2: string;
    city: string;
    state: string;
    faxNo: string;
    balance: number;
    creditLimit: number;
    comRate: number;
    // Add other fields as needed
}

// Function to save agent data to cookies
export async function saveAgentDataToCookies(data: AgentData): Promise<void> {

    // Convert the object to a string to store in cookies
    const agentDataString = JSON.stringify(data);

    // Store the data in a single cookie
    (await cookies()).set({
        name: 'goxi-auth-token',
        value: agentDataString,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400, // 24 hours in seconds
        path: '/',
    });

    // Additionally store important individual values for easier access
    (await cookies()).set({
        name: 'agent-id',
        value: data.agentID,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400,
        path: '/',
    });

    (await cookies()).set({
        name: 'agent-email',
        value: data.email,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400,
        path: '/',
    });
}

// Function to get agent data from cookies
export function getAgentData(cookieStore: ReadonlyRequestCookies): AgentData | null {
    const agentDataCookie = cookieStore.get('agent-data');

    if (!agentDataCookie) {
        return null;
    }

    try {
        return JSON.parse(agentDataCookie.value) as AgentData;
    } catch (error) {
        console.error('Error parsing agent data from cookie:', error);
        return null;
    }
}

// Function to get a specific agent data field
export function getAgentField(cookieStore: ReadonlyRequestCookies, field: keyof AgentData): string | null {
    // Try to get the specific cookie first (for common fields)
    if (field === 'agentID' || field === 'email') {
        const specificCookie = cookieStore.get(`agent-${field}`);
        if (specificCookie) {
            return specificCookie.value;
        }
    }

    // Fall back to the full agent data
    const agentData = getAgentData(cookieStore);
    if (agentData && field in agentData) {
        return String(agentData[field]);
    }

    return null;
}

// Function to check if agent data exists
export function hasAgentData(cookieStore: ReadonlyRequestCookies): boolean {
    return !!cookieStore.get('agent-data');
}

// Function to clear agent data
export async function clearAgentData(): Promise<void> {
    (await cookies()).delete('goxi-auth-token');
    (await cookies()).delete('agent-id');
    (await cookies()).delete('agent-email');
}