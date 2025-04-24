import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.BASE_URL;

export async function POST() {
    try {
        const response = await fetch(`${API_URL}/Auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                appID: "GOXI",
                password: "api@goxi_micro"
            }),
        });

        // Check if response has content before trying to parse JSON
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            // Handle error response safely
            let errorMessage = "Authentication failed";
            try {
                // Only try to parse as JSON if content-type indicates JSON
                if (contentType && contentType.includes("application/json")) {
                    const errorText = await response.text();
                    if (errorText) {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.message || errorMessage;
                    }
                }
            } catch (parseError) {
                console.error("Error parsing error response:", parseError);
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        // Handle successful response
        try {
            // Only try to parse as JSON if content-type indicates JSON
            if (contentType && contentType.includes("application/json")) {
                const responseText = await response.text();
                if (!responseText.trim()) {
                    throw new Error("Empty response body");
                }

                const data = JSON.parse(responseText);

                // Set token in cookies
                (await cookies()).set({
                    name: 'goxi-token',
                    value: data.accessToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: data.expiresIn, // Token expiration time in seconds
                    path: '/',
                });

                return NextResponse.json({ success: true });
            } else {
                throw new Error(`Unexpected content type: ${contentType}`);
            }
        } catch (parseError) {
            console.error("Error parsing response:", parseError);
            return NextResponse.json(
                { error: "Failed to process authentication response" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
            { error: "Failed to authenticate" },
            { status: 500 }
        );
    }
}