import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define the API URL - ideally this would come from an environment variable
const API_URL = process.env.BASE_URL;

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
                const cookieStore = cookies();

          const token = request.cookies.get('goxi-auth-token')?.value;

          if (!token){
              return NextResponse.json({
                  error: "unauthorized",
                  status: 401
              })
          }

          const accessToken = JSON.parse(token);

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
        const claimResponse = await fetch(`${API_URL}/Claims`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken.accessToken}`
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