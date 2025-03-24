// app/api/policies/individual-life/route.ts
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

// Define TypeScript interfaces
interface AuthResponse {
    accessToken: string;
    expiresIn: number;
}

interface Claim {
    policyNo: string;
    lossNotifyDate: string;
    lossDate: string;
    lossType: string;
    lossDescription: string;
}

interface ErrorResponse {
    error: string;
}

const API_URL = "http://microlifetestapi.newgibsonline.com";

export async function GET(request: Request): Promise<NextResponse<Claim[] | ErrorResponse>> {
    try {
        // Get query parameters from the request URL
        const url = new URL(request.url);
        const searchText = url.searchParams.get('searchText') || '';
        const dateFrom = url.searchParams.get('dateFrom') || '';
        const dateTo = url.searchParams.get('dateTo') || '';
        const pageNo = url.searchParams.get('pageNo') || '1';
        const pageSize = url.searchParams.get('pageSize') || '10';

        // Check if token exists in cookies
        const cookieStore = cookies();
        const token = (await cookieStore).get('goxi-token');

        let accessToken: string | null = null;

        // If token doesn't exist, get a new one
        if (!token) {
            const authResponse = await fetch(`${API_URL}/api/v1/Auth`, {
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
                const errorText = await authResponse.text();
                console.error('Authentication failed:', authResponse.status, errorText);

                return NextResponse.json<ErrorResponse>(
                    { error: "Authentication failed" },
                    { status: 401 }
                );
            }

            const authData: AuthResponse = await authResponse.json();

            // Set token in cookies
            (await cookieStore).set({
                name: 'goxi-token',
                value: authData.accessToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: authData.expiresIn,
                path: '/',
            });

            // Use the new token
            accessToken = authData.accessToken;
        } else {
            // Use existing token
            accessToken = token.value;
        }

        // Build query string for API call
        const queryParams = new URLSearchParams();

        if (searchText) queryParams.append('SearchText', searchText);
        if (dateFrom) queryParams.append('DateFrom', dateFrom);
        if (dateTo) queryParams.append('DateTo', dateTo);
        queryParams.append('PageNo', pageNo);
        queryParams.append('PageSize', pageSize);

        // Construct the full URL with query parameters
        const apiUrl = `${API_URL}/api/v1/Claims?${queryParams.toString()}`;

        // Fetch data from the external API
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            // Using next.js 13+ fetch behavior with cache options
            cache: 'no-store'
        });

        // Handle token expiry
        if (response.status === 401) {
            // Token might have expired, clear it and ask the client to retry
            (await cookieStore).delete('goxi-token');

            return NextResponse.json<ErrorResponse>(
                { error: "Authentication token expired, please retry your request" },
                { status: 401 }
            );
        }

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            // Log the error details for debugging
            const errorText = await response.text();
            console.error('Failed to fetch claims:', response.status, errorText);

            // Return an appropriate error response
            return NextResponse.json<ErrorResponse>(
                { error: `Failed to fetch claims: ${response.statusText}` },
                { status: response.status }
            );
        }

        // Parse the response as JSON
        const data: Claim[] = await response.json();

        console.log('show', data);

        // Return the data with proper content type
        return NextResponse.json<Claim[]>(data);

    } catch (error) {
        // Handle any unexpected errors
        console.error('Error fetching claims:', error);
        return NextResponse.json<ErrorResponse>(
            { error: 'Internal server error while fetching claims' },
            { status: 500 }
        );
    }
}