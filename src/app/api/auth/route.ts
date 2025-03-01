import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = "http://microlifetestapi.newgibsonline.com";

export async function POST() {
    try {
        const response = await fetch(`${API_URL}/api/v1/Auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                appID: "GOXI",
                password: "api@goxi_micro"
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || "Authentication failed" },
                { status: response.status }
            );
        }

        const data = await response.json();

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
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
            { error: "Failed to authenticate" },
            { status: 500 }
        );
    }
}