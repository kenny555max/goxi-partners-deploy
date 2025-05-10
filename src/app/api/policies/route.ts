// app/api/policies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";

// Define interface to match the expected API format
interface PolicyRequestData {
    policyNo?: string;
    coPolicyNo?: string;
    isOrg?: string;
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
    productID?: string;
    frequency?: string;
    surname?: string;
    otherNames?: string;
    customerEmail?: string;
    phoneNo?: string;
    isOrg?: string;
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
    message: string;
    data?: unknown;
    error?: string;
    statusCode?: number;
}

const API_URL = process.env.BASE_URL;

/**
 * Get an authentication token, either from cookies or by making a new request
 */
async function getAuthToken(): Promise<{ token: string | null; error?: string }> {
    try {
        // Check if token exists in cookies
        const token = (await cookies()).get('agent-token');

        if (token) {
            return { token: token.value };
        }

        // If token doesn't exist, get a new one
        const authResponse = await fetch(`${API_URL}/Agents/agent/authenticate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                appID: "admin@example.com",
                password: "adminpass123"
            }),
        });

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
                } else {
                    // If not JSON, try to get text error
                    const errorText = await authResponse.text();
                    errorMessage = errorText || `Authentication failed with status: ${authResponse.status}`;
                }
            } catch (parseError) {
                console.log(parseError);
                errorMessage = `Authentication failed with status: ${authResponse.status}`;
            }

            return { token: null, error: errorMessage };
        }

        try {
            const authText = await authResponse.text();
            if (!authText.trim()) {
                return { token: null, error: "Empty authentication response from server" };
            }

            const authData = JSON.parse(authText);

            if (!authData.accessToken) {
                return { token: null, error: "No access token in authentication response" };
            }

            // Set token in cookies
            (await cookies()).set({
                name: 'agent-token',
                value: authData.accessToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: authData.expiresIn,
                path: '/',
            });

            console.log("yeah yeah", authData);

            return { token: authData.accessToken };
        } catch (parseError) {
            console.log(parseError);
            return { token: null, error: "Failed to parse authentication response" };
        }
    } catch (error) {
        return { token: null, error: error instanceof Error ? error.message : "Unknown error during authentication" };
    }
}

/**
 * Parse API response safely
 */
async function parseApiResponse(response: Response): Promise<ApiResponse> {
    const contentType = response.headers.get('content-type');
    const status = response.status;

    // Try to get response text first
    let responseText;
    try {
        responseText = await response.text();
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Failed to read response from server",
            statusCode: status
        };
    }

    // If empty response
    if (!responseText || !responseText.trim()) {
        return {
            success: false,
            message: response.ok
                ? "Server returned empty response but operation may have succeeded"
                : `Server returned empty response with status ${status}`,
            statusCode: status
        };
    }

    // Try to parse as JSON if content type suggests it
    if (contentType && contentType.includes('application/json')) {
        try {
            const jsonData = JSON.parse(responseText);
            return {
                success: response.ok,
                message: jsonData.message || (response.ok ? "Operation successful" : "Operation failed"),
                data: jsonData,
                statusCode: status
            };
        } catch (error) {
            console.log(error);
            // JSON parsing failed despite content-type header
            return {
                success: false,
                message: "Server returned invalid JSON response",
                error: responseText,
                statusCode: status
            };
        }
    }

    // Not JSON or parsing failed, return text response
    return {
        success: response.ok,
        message: response.ok ? "Operation successful with non-JSON response" : "Operation failed",
        data: responseText,
        error: !response.ok ? responseText : undefined,
        statusCode: status
    };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {

        // Parse the incoming request body from the form
        const formData: FormData = await request.json();

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
            //policyNo: "",  // This might be auto-generated by the API
            //coPolicyNo: "",
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
            branchID: "api@goxi_micro",
            customerID: "",
            agentID: formData.agentID,
            productID: formData.product || "",
            bizSource: formData.policyType || "",
            startDate: formData.startDate || new Date().toISOString(),
            endDate: formData.maturityDate || new Date().toISOString(),
            sumInsured: parseFloat(formData.sumInsured || "0"),
            grossPremium: parseFloat(formData.premium || "0")
        };

        const endpoint = formData.isOrg ?
            `${API_URL}/Policies/create` :
            `${API_URL}/Policies/create/individual`;

        const token = request.cookies.get('goxi-auth-token')?.value;

        if (!token){
            return NextResponse.json({
                error: "unauthorized",
                status: 401
            })
        }

        const accessToken = JSON.parse(token);

        const postBody = {
            group: {
                "insured": {
                    "title": "string",
                    lastName: formData.surname || "",
                    firstName: firstName,
                    otherName: otherName,
                    gender: mapGender(formData.gender), // Convert to expected format (MALE/FEMALE)
                    email: formData.customerEmail || "",
                    address: formData.address || "",
                    phoneLine1: formData.phoneNo || "",
                    phoneLine2: "",
                    "isOrg": true, //formData.isOrg,
                    "orgName": "string",
                    "orgRegNumber": "string",
                    "orgRegDate": "2025-04-15T14:17:39.046Z",
                    "password": "string",
                    cityLGA: formData.city || "",
                    stateID: formData.state || "",
                    nationality: "Nigeria", // Default value
                    dateOfBirth: formData.dob || new Date().toISOString(),
                    "kycType": "NOT_AVAILABLE",
                    "kycNumber": "string",
                    "kycIssueDate": "2025-04-15T14:17:39.046Z",
                    "kycExpiryDate": "2025-04-15T14:17:39.046Z",
                    "nextOfKin": {
                        "title": "string",
                        "lastName": "string",
                        "firstName": "string",
                        "otherName": "string",
                        "gender": "MALE",
                        "email": "user@example.com",
                        "address": "string",
                        "phoneLine1": "string",
                        "phoneLine2": "string"
                    }
                },
                "branchID": "001",
                agentID: accessToken.agentID,//"G/A/410000808",
                productID: formData.productID || "",
                startDate: formData.startDate || new Date().toISOString(),
                endDate: formData.maturityDate || new Date().toISOString(),
                sumInsured: parseFloat(formData.sumInsured || "0"),
                grossPremium: parseFloat(formData.premium || "0"),
                "customerID": "string"
            },
            individual: {
                "insured": {
                    gender: mapGender(formData.gender), // Convert to expected format (MALE/FEMALE)
                    email: formData.customerEmail || "",
                    address: formData.address || "",
                    landPhone: formData.phoneNo || "",
                    phoneLine2: "",
                    "surname": formData.surname || "",
                    "fullName": firstName + " " + otherName,
                    "otherNames": "string",
                    "occupation": "string",
                    "nationalID": "string",
                    "mobilePhone": formData.phoneNo || "",
                     cityLGA: formData.city || "",
                    stateID: formData.state || "",
                    nationality: "Nigeria", // Default value
                    dateOfBirth: formData.dob || new Date().toISOString(),
                    "kycType": "NOT_AVAILABLE",
                    "kycNumber": "string",
                    "kycIssueDate": "2025-04-22T12:44:30.896Z",
                    "kycExpiryDate": "2025-04-22T12:44:30.896Z",
                    "nextOfKin": {
                        "title": "Mr",
                        "lastName": "Akinwale",
                        "firstName": "Tunde",
                        "otherName": "Michael",
                        "gender": "MALE",
                        "email": "tunde.akinwale@example.com",
                        "address": "15 Palm Avenue, Ikeja, Lagos",
                        "phoneLine1": "08051234567",
                        "phoneLine2": "014556677"
                    }
                },
                "transDate": "2025-04-22T12:44:30.896Z",
                "agentID": accessToken.agentID, //"string",
                //"customerID": "01082204959",
                productID: formData.productID || "",
                startDate: formData.startDate || new Date().toISOString(),
                "maturityDate": formData.maturityDate || new Date().toISOString(),
                "frequencyOfPayment": "string",
                "sumAssured": parseFloat(formData.sumInsured || "0"),
                "basicPremium": parseFloat(formData.premium || "0")
            }
        }

        const body = formData.isOrg ? { ...postBody.group } : { ...postBody.individual };

        // Make request to create policy
        const createPolicyResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken.accessToken}`
            },
            body: JSON.stringify(body),
        });

        console.log(createPolicyResponse);

        // Parse the response
        const responseData = await parseApiResponse(createPolicyResponse);

        // If it fails with a 401, our token might be expired - try to refresh and retry
        if (responseData.statusCode === 401) {
            // Clear the current token cookie to force a new token on next request
            (await cookies()).delete('goxi-token');

            return NextResponse.json({
                success: false,
                message: "Authentication failed - please try again",
                error: "Your session has expired"
            }, { status: 401 });
        }

        // General error case
        if (!responseData.success) {
            return NextResponse.json({
                success: false,
                message: 'Failed to create policy',
                error: responseData.message
            }, { status: responseData.statusCode || 500 });
        }

        // Success case
        return NextResponse.json({
            success: true,
            message: 'Policy created successfully',
            data: responseData.data
        });
    } catch (error) {
        console.error("Error creating policy:", error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const policyType = searchParams.get('type') || 'individual'; // Default to individual if not specified

        // Get authentication token
        //const { token, error: authError } = await getAuthToken();
                const cookieStore = cookies();

            const token = request.cookies.get('goxi-auth-token')?.value;

            if (!token){
                return NextResponse.json({
                    error: "unauthorized",
                    status: 401
                })
            }

            const accessToken = JSON.parse(token);

        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Authentication failed",
                error: 'Unauthorized'//authError
            }, { status: 401 });
        }

        // Determine which endpoint to use based on policyType
        const endpoint = policyType === 'group'
            ? '/Policies/group'
            : '/Policies/policies/individual';

        // Fetch policies using the token
        const policiesResponse = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                "Authorization": `Bearer ${accessToken.accessToken}`
            },
            cache: "no-store"
        });

        // Parse the response
        const responseData = await parseApiResponse(policiesResponse);

        console.log('yeah yeah', responseData.data, 'bad');

        // If it fails with a 401, our token might be expired
        if (responseData.statusCode === 401) {
            // Clear the current token cookie to force a new token on next request
            (await cookies()).delete('goxi-auth-token');

            return NextResponse.json({
                success: false,
                message: "Authentication failed - please try again",
                error: "Your session has expired"
            }, { status: 401 });
        }

        // General error case
        if (!responseData.success) {
            return NextResponse.json({
                success: false,
                message: 'Failed to fetch policies',
                error: responseData.error || responseData.message
            }, { status: responseData.statusCode || 500 });
        }

        let policyData = null;

        // @ts-ignore
        if (responseData?.data?.policies){
            // @ts-ignore
            policyData = responseData?.data?.policies;
        }else{
            policyData = responseData?.data;
        }

        // If the response is not an array (might be text or other format)
        // @ts-ignore
        if (!Array.isArray(policyData)) {
            return NextResponse.json({
                success: false,
                message: 'Unexpected response format from server',
                error: 'Expected an array of policies'
            }, { status: 500 });
        }

        // Transform the data to match the expected format for the PolicyTable component
        // @ts-ignore
        const transformedPolicies = policyData?.map((policy: any, index: number) => ({
            id: index.toString(), // Generate an ID if none exists
            policyNo: policy.policyNo || 'N/A',
            product: policy.coverType || 'N/A',
            insured: policy.fullName || 'N/A',
            periodOfCover: policy.startDate && policy.maturityDate
                ? `${new Date(policy.startDate).toLocaleDateString()} - ${new Date(policy.maturityDate).toLocaleDateString()}`
                : 'N/A',
            fop: policy.paymentFrequency || 'Annual', // Default to Annual if not provided
            premium: policy.basicPremium || 0,
            sumInsured: policy.sumAssured || 0,
            status: mapPolicyStatus(policy.status || ''),
            transDate: policy.startDate ? new Date(policy.startDate).toLocaleDateString() : 'N/A'
        }));

        return NextResponse.json({
            success: true,
            message: 'Policies fetched successfully',
            data: transformedPolicies
        });
    } catch (error) {
        console.error("Server error:", error);
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

// Helper function to map API status values to expected UI status values
function mapPolicyStatus(status: string): 'active' | 'expired' | 'pending' | 'cancelled' {
    const statusLower = status.toLowerCase();

    if (statusLower.includes('active')) return 'active';
    if (statusLower.includes('expired') || statusLower.includes('matured')) return 'expired';
    if (statusLower.includes('pending') || statusLower.includes('wait')) return 'pending';
    if (statusLower.includes('cancel') || statusLower.includes('termin')) return 'cancelled';

    // Default to pending if status doesn't match any known patterns
    return 'pending';
}