import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { decryptData } from '@/lib/encryption';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // CRITICAL: Only super_admin can decrypt credentials
        if (!session || (session.user as any)?.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Super Admin access required.' },
                { status: 403 }
            );
        }

        const { encryptedData } = await request.json();

        if (!encryptedData) {
            return NextResponse.json(
                { error: 'No encrypted data provided' },
                { status: 400 }
            );
        }

        // Decrypt the data
        const decryptedData = decryptData(encryptedData);

        if (!decryptedData) {
            return NextResponse.json(
                { error: 'Failed to decrypt data' },
                { status: 500 }
            );
        }

        // Log the decryption attempt for security audit
        console.log(`[SECURITY AUDIT] Super Admin ${session.user?.email} decrypted user credentials at ${new Date().toISOString()}`);

        return NextResponse.json({
            success: true,
            decryptedData
        });

    } catch (error) {
        console.error('Decryption API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
