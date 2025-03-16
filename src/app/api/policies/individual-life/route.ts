// app/api/policies/individual-life/route.ts
import { NextResponse } from 'next/server';
import {cookies} from "next/headers";

const API_URL = "http://microlifetestapi.newgibsonline.com";

export async function GET() {
    try {
        // Check if token exists in cookies
        const token = (await cookies()).get('goxi-token');

        let accessToken = null;

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
                return NextResponse.json(
                    { error: "Authentication failed" },
                    { status: 401 }
                );
            }

            const authData = await authResponse.json();

            // Set token in cookies
            (await cookies()).set({
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

        // Fetch data from the external API
        const response = await fetch('http://microlifetestapi.newgibsonline.com/api/v1/IndividualLife', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            // Using next.js 13+ fetch behavior with cache options
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            // Log the error details for debugging
            const errorText = await response.text();
            console.error('Failed to fetch individual life policies:', response.status, errorText);

            // Return an appropriate error response
            return NextResponse.json(
                { error: `Failed to fetch policies: ${response.statusText}` },
                { status: response.status }
            );
        }

        // Parse the response as JSON
        const data = await response.json();

        // Return the data with proper content type
        return NextResponse.json(data);

    } catch (error) {
        // Handle any unexpected errors
        console.error('Error fetching individual life policies:', error);
        return NextResponse.json(
            { error: 'Internal server error while fetching policies' },
            { status: 500 }
        );
    }
}