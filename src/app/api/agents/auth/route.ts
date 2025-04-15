import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://microlifeapi.gibsonline.com";

export async function POST(request: NextRequest) {
    try {
        // Get agent credentials from request body
        const { email, password } = await request.json();

        // Validate credentials
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Make request to authenticate agent
        const response = await fetch(`${API_URL}/api/v1/Agents/agent/authenticate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            }),
        });

        // Safely handle authentication response
        if (!response.ok) {
            let errorMessage = "Authentication failed";
            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorText = await response.text();
                    if (errorText) {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.message || errorMessage;
                    }
                }
            } catch (parseError) {
                console.error("Error parsing auth error response:", parseError);
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        // Handle successful response
        try {
            const responseText = await response.text();
            if (!responseText.trim()) {
                return NextResponse.json(
                    { error: "Empty authentication response" },
                    { status: 500 }
                );
            }

            const authData = JSON.parse(responseText);

            // Set token in cookies
            if (authData.accessToken) {
                const expiresIn = authData.expiresIn || 86400; // Default to 24 hours if not provided

                (await cookies()).set({
                    name: 'agent-token',
                    value: authData.accessToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: expiresIn,
                    path: '/',
                });

                return NextResponse.json({
                    message: "Agent authenticated successfully",
                    agentId: authData.agentId,
                    name: authData.name,
                    role: authData.role
                });
            } else {
                return NextResponse.json(
                    { error: "No access token in response" },
                    { status: 500 }
                );
            }
        } catch (parseError) {
            console.error("Error parsing authentication response:", parseError);
            return NextResponse.json(
                { error: "Failed to process authentication response" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error authenticating agent:", error);
        return NextResponse.json(
            { error: "Failed to authenticate agent" },
            { status: 500 }
        );
    }
}