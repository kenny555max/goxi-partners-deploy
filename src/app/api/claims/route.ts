// app/api/policies/individual-life/route.ts
import { NextResponse, NextRequest } from 'next/server';
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

const API_URL = process.env.BASE_URL;

export async function GET(request: NextRequest): Promise<NextResponse<Claim[] | ErrorResponse>> {
    try {
        // Get query parameters from the request URL
        const url = new URL(request.url);
        const searchText = url.searchParams.get('searchText') || '';
        const dateFrom = url.searchParams.get('dateFrom') || '';
        const dateTo = url.searchParams.get('dateTo') || '';
        const pageNo = url.searchParams.get('pageNo') || '1';
        const pageSize = url.searchParams.get('pageSize') || '10';

                const cookieStore = cookies();

        // Check if token exists in cookies
          const token = request.cookies.get('goxi-auth-token')?.value;

          if (!token){
            return NextResponse.json({
                error: "Unauthorized",
                status: 401
            })
          }

        const accessToken = JSON.parse(token);

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
                'Authorization': `Bearer ${accessToken.accessToken}`,
            },
            // Using next.js 13+ fetch behavior with cache options
            cache: 'no-store'
        });

        // Handle token expiry
        if (response.status === 401) {
            // Token might have expired, clear it and ask the client to retry
            (await cookieStore).delete('goxi-auth-token');

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