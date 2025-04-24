// src/app/api/dashboard/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.BASE_URL;

// Helper function to handle authentication
async function getAccessToken() {
    try {
        // Check if token exists in cookies
        const token = (await cookies()).get('goxi-token');

        // If token exists, return it
        if (token) {
            return token.value;
        }

        // Otherwise, get a new token
        const authResponse = await fetch(`${API_URL}/Auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                appID: "GOXI",
                password: "api@goxi_micro"
            }),
        });

        if (!authResponse.ok) {
            throw new Error("Authentication failed");
        }

        const authText = await authResponse.text();
        if (!authText.trim()) {
            throw new Error("Empty authentication response");
        }

        const authData = JSON.parse(authText);

        // Set token in cookies
        (await cookies()).set({
            name: 'goxi-token',
            value: authData.accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: authData.expiresIn,
            path: '/',
        });

        return authData.accessToken;
    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
}

// Helper function to safely fetch data
async function fetchWithAuth(endpoint: string) {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const responseText = await response.text();
            if (!responseText.trim()) {
                return { value: 0 }; // Default value if empty response
            }

            return JSON.parse(responseText);
        } else {
            return { value: 0 }; // Default value if not JSON
        }
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        return { value: 0 }; // Default value on error
    }
}

// API route for getting all dashboard data
export async function GET() {
    try {
        // Fetch all data in parallel
        const [totalInsured, totalPayments, totalClaims, activePolicies] = await Promise.all([
            fetchWithAuth("/api/Dashboard/total_insured"),
            fetchWithAuth("/api/Dashboard/total_payments"),
            fetchWithAuth("/api/Dashboard/total_claims"),
            fetchWithAuth("/api/Dashboard/individual/active_policies")
        ]);

        return NextResponse.json({
            insured: totalInsured.total_insured || 0,
            sales: totalPayments.total_payments || 0,
            claims: totalClaims.total_claims || 0,
            policies: activePolicies.total_active_policies || 0
        });
    } catch (error) {
        console.error("Dashboard data fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}