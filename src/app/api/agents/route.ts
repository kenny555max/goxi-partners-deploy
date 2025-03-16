// app/api/claims/submit/route.ts
/*
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://microlifetestapi.newgibsonline.com";

export async function POST(request: NextRequest) {
    try {
        // Parse form data from the request
        const formData = await request.formData();



        // Extract fields from the form data and format them according to the API requirements
        const claimData = {
            policyNo: formData.get('policyNo') as string,
            lossNotifyDate: new Date().toISOString(), // Current date as notification date
            lossDate: formData.get('lossDate') as string,
            lossType: "General", // Default loss type or could be added to your form
            lossDescription: formData.get('lossDetails') as string
        };

        // Check if token exists in cookies
        const token = (await cookies()).get('goxi-token');

        let accessToken = null;

        console.log(accessToken);

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
                console.error("Authentication failed:", await authResponse.text());
                return NextResponse.json(
                    { message: "Authentication failed" },
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

        console.log(accessToken);

        // Submit the claim to the API
        const response = await fetch(`${API_URL}/api/v1/claims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(claimData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error response:", errorText);

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: "API returned an error" };
            }

            return NextResponse.json(
                { message: errorData.message || "Failed to submit claim" },
                { status: response.status }
            );
        }

        // Process successful response
        const data = await response.json();

        // Handle file upload if a file was provided
        const supportFile = formData.get('supportFile') as File;
        if (supportFile && data.claimId) {
            // You would need an API endpoint for attaching documents to claims
            // This is an example of how you might implement it:
            const documentFormData = new FormData();
            documentFormData.append('claimId', data.claimId);
            documentFormData.append('file', supportFile);

            const documentResponse = await fetch(`${API_URL}/api/v1/claims/documents`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                body: documentFormData,
            });

            if (!documentResponse.ok) {
                console.warn("Document upload failed, but claim was submitted");
                // Note: We don't fail the whole request if just the document upload fails
            }
        }

        // Send additional claim details to your database or another API
        // This would contain the fields not accepted by the primary API
        const additionalData = {
            claimId: data.claimId,
            policyNo: formData.get('policyNo') as string,
            surname: formData.get('surname') as string,
            othernames: formData.get('othernames') as string,
            certificateNo: formData.get('certificateNo') as string,
            mobileNo: formData.get('mobileNo') as string,
            email: formData.get('email') as string,
            // Add any other fields you need to store
        };

        // You would implement this according to your needs, e.g.:
        // await saveAdditionalClaimData(additionalData);

        return NextResponse.json({
            message: "Claim submitted successfully",
            claimId: data.claimId,
            ...data
        });
    } catch (error) {
        console.error("Error submitting claim:", error);
        return NextResponse.json(
            { message: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}

// Helper function to save additional claim data (implement as needed)
async function saveAdditionalClaimData(data: any) {
    // This could be an API call to your database or another service
    // For example:
    // await fetch('/api/internal/claim-details', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
}
 */

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