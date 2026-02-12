import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQRCode } from '@/lib/qr';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { paymentId } = await request.json();

        // 1. Verify payment (in real app, call Razorpay/Stripe API)
        // For MVP, we'll assume it's valid if paymentId exists

        // 2. Update Order
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days validity

        const qrData = `MILABS-ORD-${id}-${Date.now()}`;
        const qrImage = await generateQRCode(qrData);

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                paymentStatus: 'paid',
                status: 'confirmed',
                paymentId: paymentId,
                qrCode: qrImage,
                qrExpiresAt: expiresAt,
            },
        });

        // 3. Send Notifications (Email/SMS)
        // Here you would call your notification service
        console.log(`Sending confirmation to ${session.user?.email} for order ${id}`);

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}
