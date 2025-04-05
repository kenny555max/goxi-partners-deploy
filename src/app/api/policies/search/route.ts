// app/api/policies/search/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://microlifeapi.gibsonline.com";

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const policyNumber = searchParams.get("policyNumber");
        const holderName = searchParams.get("holderName");
        const status = searchParams.get("status");

        // Validate at least one search parameter is provided
        if (!policyNumber && !holderName && !status) {
            return NextResponse.json(
                { message: "Please provide at least one search parameter" },
                { status: 400 }
            );
        }

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
                    { message: errorMessage },
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
                    { message: "Failed to process authentication response" },
                    { status: 500 }
                );
            }
        } else {
            // Use existing token
            accessToken = token.value;
        }

        // Build query string for policy search
        const queryParams = new URLSearchParams();
        if (policyNumber) queryParams.append("policy_number", policyNumber);
        if (holderName) queryParams.append("holder_name", holderName);
        if (status) queryParams.append("status", status);

        // Make API request to fetch policies
        const policyResponse = await fetch(
            `${API_URL}/api/v1/Policies/search?${queryParams.toString()}`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!policyResponse.ok) {
            let errorMessage = "Failed to fetch policy details";
            try {
                const errorData = await policyResponse.json();
                errorMessage = errorData.message || errorMessage;
            } catch (error) {
                console.error("Error parsing policy error response:", error);
            }

            return NextResponse.json(
                { message: errorMessage },
                { status: policyResponse.status }
            );
        }

        const policies = await policyResponse.json();

        // If no policies found
        if (!policies || policies.length === 0) {
            return NextResponse.json(
                { message: "No policies found matching your search criteria" },
                { status: 404 }
            );
        }

        // Transform API response to match the UI component's expected format
        const transformedPolicies = policies.map((policy: any) => ({
            policyNo: policy.policyNo,
            product: policy.subRiskName || policy.subRiskID,
            insuredName: policy.insFullname || `${policy.insSurname || ''} ${policy.insFirstname || ''} ${policy.insOthernames || ''}`.trim(),
            address: policy.insAddress || '',
            phone: policy.insMobilePhone || policy.insLandPhone || '',
            email: policy.insEmail || '',
            agent: policy.mktStaff || policy.bizSource || '',
            periodStart: new Date(policy.startDate).toLocaleDateString(),
            periodEnd: new Date(policy.endDate).toLocaleDateString(),
            nextRenewal: new Date(policy.endDate).toLocaleDateString(),
            sumInsured: policy.sumInsured || 0,
            premium: policy.grossPremium || 0,
            status: policy.transSTATUS
        }));

        // Return the first policy if searching by policy number, otherwise return all
        const result = policyNumber ? transformedPolicies[0] : transformedPolicies;

        return NextResponse.json(result);

    } catch (error) {
        console.error("Policy search error:", error);
        return NextResponse.json(
            { message: "An unexpected error occurred while processing your request" },
            { status: 500 }
        );
    }
}