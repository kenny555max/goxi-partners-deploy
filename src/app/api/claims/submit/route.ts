import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Validation example
        const policyNo = formData.get('policyNo');
        const surname = formData.get('surname');
        const email = formData.get('email');

        if (!policyNo || !surname || !email) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Process file if present
        const file = formData.get('supportFile') as File | null;
        let fileUrl = null;

        if (file) {
            // Example file handling (in a real app, you'd upload to storage)
            //const fileBuffer = await file.arrayBuffer();
            const fileName = `${Date.now()}-${file.name}`;

            // Here you would upload to your storage service
            // For example with AWS S3, Azure Blob Storage, etc.
            // fileUrl = await uploadToStorage(fileBuffer, fileName, file.type);

            // Mock URL for demonstration
            fileUrl = `/uploads/${fileName}`;
        }

        // Create claim in database
        // This is where you'd integrate with your backend service
        /*
        const claimData = {
            policyNo: formData.get('policyNo'),
            surname: formData.get('surname'),
            othernames: formData.get('othernames'),
            certificateNo: formData.get('certificateNo'),
            mobileNo: formData.get('mobileNo'),
            email: formData.get('email'),
            lossDetails: formData.get('lossDetails'),
            lossDate: formData.get('lossDate'),
            supportFileUrl: fileUrl,
            status: 'New',
            createdAt: new Date().toISOString(),
        };

         */

        // In a real app, you would save this data to your database
        // const savedClaim = await db.claims.create(claimData);

        // Mock claim ID for demonstration
        const claimId = `CLM-${Date.now()}`;

        return NextResponse.json({
            success: true,
            message: 'Claim submitted successfully',
            claimId
        });

    } catch (error) {
        console.error('Error submitting claim:', error);
        return NextResponse.json(
            { message: 'Failed to process claim submission' },
            { status: 500 }
        );
    }
}