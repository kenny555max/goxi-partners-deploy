import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the API URL - ideally this would come from an environment variable
const API_URL = "https://microlifeapi.gibsonline.com";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Validation for required fields
        const policyNo = formData.get('policyNo');
        const surname = formData.get('surname');
        const email = formData.get('email');
        const lossDate = formData.get('lossDate');
        const lossType = formData.get('lossType');
        const lossDescription = formData.get('lossDescription');

        if (!policyNo || !surname || !email || !lossDate || !lossType || !lossDescription) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Authentication check
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

        // Process file if present (for future implementation)
        const file = formData.get('supportFile') as File | null;
        let fileUrl = null;

        if (file) {
            // Example file handling logic
            // In a real implementation, you would upload to cloud storage
            const fileName = `${Date.now()}-${file.name}`;
            fileUrl = `/uploads/${fileName}`;
            console.log(`File would be uploaded to: ${fileUrl}`);
        }

        // Prepare claim data according to the API requirements
        const lossNotifyDate = new Date().toISOString();

        const claimRequestBody = {
            policyNo: formData.get('policyNo') as string,
            lossNotifyDate: lossNotifyDate,
            lossDate: formData.get('lossDate') as string,
            lossType: formData.get('lossType') as string,
            lossDescription: formData.get('lossDescription') as string
        };

        // Make the API request to submit the claim
        const claimResponse = await fetch(`${API_URL}/api/v1/Claims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(claimRequestBody)
        });

        if (!claimResponse.ok) {
            let errorMessage = "Failed to submit claim";
            try {
                const errorData = await claimResponse.json();
                if (errorData.message) {
                    errorMessage = errorData.message || errorMessage;
                }else{
                    errorMessage = errorData || errorMessage;
                }
            } catch (error) {
                console.error("Error parsing claim submission error:", error);
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: claimResponse.status }
            );
        }

        // Parse the successful response
        const claimResult = await claimResponse.json();

        // Return the successful response to the client
        return NextResponse.json({
            success: true,
            message: 'Claim submitted successfully',
            claimId: claimResult.id || `CLM-${Date.now()}`, // Use API-provided ID or generate fallback
            data: claimResult
        });

    } catch (error) {
        console.error('Error submitting claim:', error);
        return NextResponse.json(
            { message: 'Failed to process claim submission', error: (error as Error).message },
            { status: 500 }
        );
    }
}