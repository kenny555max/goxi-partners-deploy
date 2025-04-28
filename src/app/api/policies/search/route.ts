// app/api/policies/search/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.BASE_URL;

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

         const token = request.cookies.get('goxi-auth-token')?.value;

         const accessToken = JSON.parse(token);

        // Build query string for policy search
        const queryParams = new URLSearchParams();
        if (policyNumber) queryParams.append("policy_number", policyNumber);
        if (holderName) queryParams.append("holder_name", holderName);
        if (status) queryParams.append("status", status);

        // Make API request to fetch policies
        const policyResponse = await fetch(
            `${API_URL}/Policies/search?${queryParams.toString()}`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken.accessToken}`,
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