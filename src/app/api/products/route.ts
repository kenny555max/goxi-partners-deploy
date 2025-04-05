import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://microlifeapi.gibsonline.com";

export async function GET(request: NextRequest) {
    try {
        // Extract query parameters
        const { searchParams } = new URL(request.url);
        const searchText = searchParams.get('searchText');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const pageNo = searchParams.get('pageNo');
        const pageSize = searchParams.get('pageSize');

        // Construct query string
        const queryParams = new URLSearchParams();
        if (searchText) queryParams.append('searchText', searchText);
        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);
        if (pageNo) queryParams.append('pageNo', pageNo);
        if (pageSize) queryParams.append('pageSize', pageSize);

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

        // Make request to fetch products
        const productsUrl = `${API_URL}/api/v1/Products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(productsUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        // Safely handle products response
        if (!response.ok) {
            let errorMessage = "Failed to fetch products";
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
                    return NextResponse.json({ products: [] });
                }

                const data = JSON.parse(responseText);
                return NextResponse.json({ products: data });
            } else {
                return NextResponse.json({
                    products: [],
                    message: "No products found or invalid response format",
                    contentType: contentType || "none"
                });
            }
        } catch (parseError) {
            console.error("Error parsing response:", parseError);
            return NextResponse.json(
                // @ts-ignore
                { error: "Failed to process response", details: parseError?.message },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}