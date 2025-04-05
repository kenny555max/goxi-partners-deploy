// app/api/policies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";

// Define interface to match the expected API format
interface PolicyRequestData {
    policyNo?: string;
    coPolicyNo?: string;
    insured: {
        title?: string;
        lastName?: string;
        firstName?: string;
        otherName?: string;
        gender?: string;
        email?: string;
        address?: string;
        phoneLine1?: string;
        phoneLine2?: string;
        isOrg?: boolean;
        orgName?: string;
        orgRegNumber?: string;
        orgRegDate?: string;
        password?: string;
        cityLGA?: string;
        stateID?: string;
        nationality?: string;
        dateOfBirth?: string;
        kycType?: string;
        kycNumber?: string;
        kycIssueDate?: string;
        kycExpiryDate?: string;
        nextOfKin?: {
            title?: string;
            lastName?: string;
            firstName?: string;
            otherName?: string;
            gender?: string;
            email?: string;
            address?: string;
            phoneLine1?: string;
            phoneLine2?: string;
        };
    };
    branchID?: string;
    agentID?: string;
    customerID?: string;
    productID?: string;
    bizSource?: string;
    startDate?: string;
    endDate?: string;
    sumInsured?: number;
    grossPremium?: number;
}

// Define interface for the form data coming from the frontend
interface FormData {
    product?: string;
    productType?: string;
    agentEmail?: string;
    sumInsured?: string;
    agentID?: string;
    premium?: string;
    policyType?: string;
    startDate?: string;
    maturityDate?: string;
    frequency?: string;
    surname?: string;
    otherNames?: string;
    customerEmail?: string;
    phoneNo?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    gender?: string;
    maritalStatus?: string;
    dob?: string;
    terms?: boolean;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: unknown;
    error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // Check if token exists in cookies
        const token = (await cookies()).get('goxi-token');

        let accessToken = null;

        // If token doesn't exist, get a new one
        if (!token) {
            const authResponse = await fetch(`https://microlifeapi.gibsonline.com/api/v1/Auth`, {
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
                    { success: false, error: errorMessage },
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
                    { success: false, error: "Failed to process authentication response" },
                    { status: 500 }
                );
            }
        } else {
            // Use existing token
            accessToken = token.value;
        }

        // Parse the incoming request body from the form
        const formData: FormData = await request.json();
        console.log("Received form data:", formData);

        // Split otherNames into firstName and otherName if needed
        let firstName = "";
        let otherName = "";
        if (formData.otherNames) {
            const nameParts = formData.otherNames.trim().split(' ');
            firstName = nameParts[0] || "";
            otherName = nameParts.slice(1).join(' ');
        }

        // Format the data according to the API requirements
        const policyRequestData: PolicyRequestData = {
            policyNo: "",  // This might be auto-generated by the API
            coPolicyNo: "",
            insured: {
                title: "", // You may need to add this field to your form
                lastName: formData.surname || "",
                firstName: firstName,
                otherName: otherName,
                gender: mapGender(formData.gender), // Convert to expected format (MALE/FEMALE)
                email: formData.customerEmail || "",
                address: formData.address || "",
                phoneLine1: formData.phoneNo || "",
                phoneLine2: "",
                isOrg: false, // Default to individual unless specified
                cityLGA: formData.city || "",
                password: "kenny",
                stateID: formData.state || "",
                nationality: "Nigeria", // Default value
                dateOfBirth: formData.dob || new Date().toISOString(),
                kycType: "NOT_AVAILABLE",
                kycNumber: "",
            },
            branchID: "",
            agentID: formData.agentID,
            productID: formData.product || "",
            bizSource: formData.policyType || "",
            startDate: formData.startDate || new Date().toISOString(),
            endDate: formData.maturityDate || new Date().toISOString(),
            sumInsured: parseFloat(formData.sumInsured || "0"),
            grossPremium: parseFloat(formData.premium || "0")
        };

        console.log("Sending policy data to API:", policyRequestData);

        // Make request to create policy
        const API_URL = "https://microlifeapi.gibsonline.com/api/v1/Policies/create";
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(policyRequestData),
        });

        // Improved response handling with proper content-type checking
        let data: ApiResponse;

        try {
            // Check if there's a content-type header and if it contains application/json
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const responseText = await response.text();

                // Ensure we have content before parsing
                if (responseText && responseText.trim()) {
                    data = JSON.parse(responseText);
                } else {
                    // Handle empty response case
                    data = {
                        success: response.ok,
                        message: response.ok ? 'Policy created successfully (empty response)' : 'Empty response received'
                    };
                }
            } else {
                // Handle non-JSON response
                const responseText = await response.text();
                console.log("Non-JSON response:", responseText);

                data = {
                    success: response.ok,
                    message: response.ok ? 'Policy created successfully (non-JSON response)' : 'Non-JSON response received',
                    data: responseText
                };
            }

            console.log('API Response:', data);

            if (!response.ok) {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to create policy',
                    error: data.error || data.message || response.statusText
                }, { status: response.status });
            }

            return NextResponse.json({
                success: true,
                message: 'Policy created successfully',
                data
            });
        } catch (error) {
            console.error("Error parsing response:", error);
            return NextResponse.json({
                success: false,
                message: 'Error parsing API response',
                error: error instanceof Error ? error.message : 'Unknown error'
            }, { status: 500 });
        }
    } catch (error) {
        console.error("Error creating policy:", error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Helper function to map gender values
function mapGender(gender?: string): string {
    if (!gender) return "MALE";

    const genderMap: Record<string, string> = {
        'male': 'MALE',
        'female': 'FEMALE',
        'other': 'OTHER'
    };

    return genderMap[gender.toLowerCase()] || 'MALE';
}

// Helper functions
function calculateDuration(startDate?: string, maturityDate?: string): number {
    if (!startDate || !maturityDate) return 0;

    const start = new Date(startDate);
    const end = new Date(maturityDate);

    // Calculate difference in years
    const durationInYears = Math.max(0, end.getFullYear() - start.getFullYear());
    return durationInYears;
}

function calculateAge(dateOfBirth?: string): number {
    if (!dateOfBirth) return 0;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return Math.max(0, age);
}

function mapProductToCoverCode(product?: string): string {
    // Map your product values to the appropriate cover codes
    const productMap: Record<string, string> = {
        'life': 'LIFE001',
        'health': 'HEALTH001',
        'property': 'PROP001',
        'auto': 'AUTO001',
    };

    return product ? productMap[product] || "" : "";
}

function mapFrequencyToFOP(frequency?: string): string {
    // Map frequency of payment to FOP codes
    const frequencyMap: Record<string, string> = {
        'monthly': 'M',
        'quarterly': 'Q',
        'biannually': 'H',
        'annually': 'A',
    };

    return frequency ? frequencyMap[frequency] || "" : "";
}