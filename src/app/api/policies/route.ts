// app/api/policies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {cookies} from "next/headers";

// Define interfaces for type safety
interface RequestData {
    proposalNo?: string;
    brCode?: string;
    tDate?: string;
    propDate?: string;
    assDate?: string;
    product?: string;
    productType?: string;
    title?: string;
    assuredCode?: string;
    surname?: string;
    otherNames?: string;
    address?: string;
    state?: string;
    landphone?: string;
    phoneNo?: string;
    customerEmail?: string;
    nationalID?: string;
    occupation?: string;
    gender?: string;
    maritalStatus?: string;
    country?: string;
    agentCode?: string;
    agentDescription?: string;
    startDate?: string;
    maturityDate?: string;
    dob?: string;
    frequency?: string;
    mop?: string;
    sumInsured?: string;
}

interface FormattedData {
    proposalNo: string;
    brCode: string;
    tDate: string;
    propDate: string;
    assDate: string;
    coverCode: string;
    covertype: string;
    title: string;
    assuredCode: string;
    surName: string;
    otherNames: string;
    address: string;
    fullName: string;
    state: string;
    landphone: string;
    mobilePhone: string;
    email: string;
    nationalID: string;
    occupation: string;
    sex: string;
    maritalStatus: string;
    country: string;
    agentcode: string;
    agentDescription: string;
    startDate: string;
    maturityDate: string;
    duration: number;
    dateofBirth: string;
    fop: string;
    age: number;
    mop: string;
    sumAssured: number;
}

interface ApiResponse {
    // Define your API response structure here
    // This should match the structure of the response from your external API
    [key: string]: unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // Check if token exists in cookies
        const token = (await cookies()).get('goxi-token');

        let accessToken = null;

        // If token doesn't exist, get a new one
        if (!token) {
            const authResponse = await fetch(`http://microlifetestapi.newgibsonline.com/api/v1/Auth`, {
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

        // Parse the incoming request body
        const requestData: RequestData = await request.json();

        // Format the data according to the API requirements
        const formattedData: FormattedData = {
            proposalNo: requestData.proposalNo || "",
            brCode: requestData.brCode || "",
            tDate: requestData.tDate || new Date().toISOString(),
            propDate: requestData.propDate || new Date().toISOString(),
            assDate: requestData.assDate || new Date().toISOString(),
            coverCode: mapProductToCoverCode(requestData.product),
            covertype: requestData.productType || "",
            title: requestData.title || "",
            assuredCode: requestData.assuredCode || "",
            surName: requestData.surname || "",
            otherNames: requestData.otherNames || "",
            address: requestData.address || "",
            fullName: `${requestData.surname || ""} ${requestData.otherNames || ""}`.trim(),
            state: requestData.state || "",
            landphone: requestData.landphone || "",
            mobilePhone: requestData.phoneNo || "",
            email: requestData.customerEmail || "",
            nationalID: requestData.nationalID || "",
            occupation: requestData.occupation || "",
            sex: requestData.gender || "",
            maritalStatus: requestData.maritalStatus || "",
            country: requestData.country || "Nigeria",
            agentcode: requestData.agentCode || "",
            agentDescription: requestData.agentDescription || "",
            startDate: requestData.startDate || new Date().toISOString(),
            maturityDate: requestData.maturityDate || new Date().toISOString(),
            duration: calculateDuration(requestData.startDate, requestData.maturityDate),
            dateofBirth: requestData.dob || new Date().toISOString(),
            fop: mapFrequencyToFOP(requestData.frequency),
            age: calculateAge(requestData.dob),
            mop: requestData.mop || "",
            sumAssured: parseFloat(requestData.sumInsured || "0")
        };

        // Environment variables would be better for sensitive information in production
        const API_URL = "http://microlifetestapi.newgibsonline.com/api/v1/IndividualLife";

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(formattedData)
        });

        const data: ApiResponse = await response.json();

        console.log('cutie', data);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return NextResponse.json({
                success: false,
                message: 'Failed to create policy',
                error: errorData || response.statusText
            }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            message: 'Policy created successfully',
            data
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