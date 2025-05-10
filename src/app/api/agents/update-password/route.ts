import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BASE_URL;

export async function POST(request: NextRequest) {
    try {
        // Check if token exists in cookies
        const token = (await cookies()).get('goxi-token');

        let accessToken = null;

        // If token doesn't exist, get a new one
        if (!token) {
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

            // Safely parse the auth response
            if (!authResponse.ok) {
                let errorMessage = "Authentication failed";
                try {
                    const contentType = authResponse.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorText = await authResponse.text();
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
                    { status: 401 }
                );
            }

            try {
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

                // Use the new token
                accessToken = authData.accessToken;
            } catch (parseError) {
                console.error("Error parsing auth response:", parseError);
                return NextResponse.json(
                    { error: "Failed to process authentication response" },
                    { status: 500 }
                );
            }
        } else {
            // Use existing token
            accessToken = token.value;
        }

        // Get password update data from request body
        const updateData = await request.json();

        // Validate incoming data
        if (!updateData.email || !updateData.password) {
            return NextResponse.json(
                { error: "Email, current password, and new password are required" },
                { status: 400 }
            );
        }

        console.log(`Updating password for: ${updateData.email}`);

        // Prepare the data for the API call
        const passwordUpdatePayload = {
            email: updateData.email,
            password: updateData.password,
            // newPassword: updateData.newPassword
        };

        // Make request to update password
        const response = await fetch(`${API_URL}/Agents/update-password`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(passwordUpdatePayload),
        });

        // Safely handle password update response
        if (!response.ok) {
            let errorMessage = "Failed to update password";
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
                console.error("Error parsing error response:", parseError);
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        // Handle successful response
        try {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const responseText = await response.text();
                if (!responseText.trim()) {
                    return NextResponse.json({ message: "Password updated successfully (empty response)" });
                }

                const data = JSON.parse(responseText);
                return NextResponse.json({
                    message: "Password updated successfully",
                    data: data
                });
            } else {
                return NextResponse.json({
                    message: "Password updated successfully",
                    contentType: contentType || "none"
                });
            }
        } catch (parseError) {
            console.error("Error parsing response:", parseError);
            return NextResponse.json(
                { error: "Failed to process response", details: "Failed to process response" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 }
        );
    }
}