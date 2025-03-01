import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://microlifetestapi.newgibsonline.com";

export async function POST(request: NextRequest) {
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

        // Get agent data from request body
        const agentData = await request.json();

        // Make request to create agent
        const response = await fetch(`${API_URL}/api/v1/Agents`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(agentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || "Failed to create agent" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error creating agent:", error);
        return NextResponse.json(
            { error: "Failed to create agent" },
            { status: 500 }
        );
    }
}