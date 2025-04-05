import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";

// Updated API URL
const EXTERNAL_API_URL = 'https://microlifeapi.gibsonline.com/api/v1/Documents/Upload/Policy';
const API_URL = "https://microlifeapi.gibsonline.com";

export async function POST(req: NextRequest) {
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

        // Extract form data
        const formData = await req.formData();

        // Extract values from the form data
        const policyNo = formData.get('policyNo');
        const endorsementNo = formData.get('endorsementNo');
        const membersDataString = formData.get('membersData') as string;

        // Validate required fields
        if (!policyNo) {
            return NextResponse.json(
                { error: 'Policy number is required' },
                { status: 400 }
            );
        }

        if (!membersDataString) {
            return NextResponse.json(
                { error: 'Members data is required' },
                { status: 400 }
            );
        }

        // Parse the members array from JSON string
        let membersArray;
        try {
            membersArray = JSON.parse(membersDataString);

            if (!Array.isArray(membersArray) || membersArray.length === 0) {
                throw new Error('Invalid or empty members data');
            }
        } catch (parseError) {
            console.error('Error parsing members data:', parseError);
            return NextResponse.json(
                { error: 'Invalid members data format' },
                { status: 400 }
            );
        }

        // Prepare payload for external API
        const payload = {
            policyNo,
            ...(endorsementNo && { endorsementNo }),
            file: membersArray
        };

        // Make request to external API with multipart form data
        const apiFormData = new FormData();
        apiFormData.append('policyNo', policyNo);
        if (endorsementNo) {
            apiFormData.append('endorsementNo', endorsementNo);
        }
        apiFormData.append('file', JSON.stringify(membersArray));

        const response = await fetch(EXTERNAL_API_URL, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                // No Content-Type header for multipart/form-data as the browser will set it with boundary
            },
            body: apiFormData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData || `Error uploading document: ${response.status}`);
        }

        const data = await response.json();

        // Return the response from the external API
        return NextResponse.json(
            {
                success: true,
                message: 'Upload successful',
                data: data
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in upload API route:', error);
        // Return specific error message if available
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}