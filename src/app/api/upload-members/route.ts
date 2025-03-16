import { NextRequest, NextResponse } from 'next/server';
import {cookies} from "next/headers";

const EXTERNAL_API_URL = 'http://microlifetestapi.newgibsonline.com/api/v1/Documents/Upload/Policy';
const API_URL = "http://microlifetestapi.newgibsonline.com";

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
            membersData: membersArray
        };

        // Make request to external API
        const response = await fetch(EXTERNAL_API_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response) {
            throw Error("error uploading document");
        }

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
        // Generic error handler
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}