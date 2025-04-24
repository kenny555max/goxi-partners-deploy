import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveAgentDataToCookies, AgentData } from '@/utils/agentCookies';

const API_URL = process.env.BASE_URL;

// Update the type definition for the route handler
export async function GET(
    request: NextRequest,
) {
    try {
        const url = new URL(request.url);
        //console.log(url);
        const agentId = url.pathname.split('/')[3];

        // Check if token exists in cookies
        const cookieStore = cookies();
        const token = (await cookieStore).get('goxi-token');

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

            if (!authResponse.ok) {
                return NextResponse.json(
                    { error: "Authentication failed" },
                    { status: 401 }
                );
            }

            const authData = await authResponse.json();

            // Set token in cookies
            (await cookieStore).set({
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

        console.log(`${API_URL}/Agents/${agentId}`)

        // Fetch agent data
        const apiResponse = await fetch(`${API_URL}/Agents/${agentId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            throw new Error(`API request failed with status: ${apiResponse.status}`);
        }

        console.log('Agent data:', data);

        // Extract relevant fields for agent data
        const agentData: AgentData = {
            agentID: data.agentID,
            unitID: data.unitID,
            agent: data.agent,
            email: data.email,
            address: data.address,
            phone1: data.phone1,
            phone2: data.phone2,
            city: data.city,
            state: data.state,
            faxNo: data.faxNo,
            balance: data.balance,
            creditLimit: data.creditLimit,
            comRate: data.comRate,
        };

        // Save agent data to cookies
        await saveAgentDataToCookies(agentData);

        return NextResponse.json({
            success: true,
            data: data
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching agent:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch agent'
        }, { status: 500 });
    }
}