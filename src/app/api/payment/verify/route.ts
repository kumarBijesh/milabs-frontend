import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendEmail, getBookingSuccessEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { razorpay_order_id, razorpay_payment_id, signature, dbOrderId, gateway } = await request.json();

        let updatedOrder;

        if (gateway === 'razorpay') {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
                .update(body.toString())
                .digest("hex");

            if (expectedSignature === signature) {
                // Update Order Status
                updatedOrder = await prisma.order.update({
                    where: { id: dbOrderId },
                    data: {
                        status: 'confirmed',
                        paymentStatus: 'paid',
                        paymentId: razorpay_payment_id,
                        paymentMethod: 'razorpay'
                    },
                    include: {
                        user: true,
                        items: { include: { test: true, package: true } }
                    }
                });
            } else {
                return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
            }
        } else if (gateway === 'stripe') {
            // Basic confirmation for demo - ideally handle via webhook
            updatedOrder = await prisma.order.update({
                where: { id: dbOrderId },
                data: {
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    paymentMethod: 'stripe'
                },
                include: {
                    user: true,
                    items: { include: { test: true, package: true } }
                }
            });
        } else {
            return NextResponse.json({ error: 'Invalid gateway' }, { status: 400 });
        }

        // Send Email Notification
        if (updatedOrder && updatedOrder.user?.email) {
            const emailHtml = getBookingSuccessEmail(
                updatedOrder.id,
                updatedOrder.user.name || 'Patient',
                gateway === 'razorpay' ? `₹${updatedOrder.totalAmount}` : `$${updatedOrder.totalAmount}`,
                updatedOrder.items.map(item => ({
                    title: item.test?.name || item.package?.name || 'Unknown Item',
                    quantity: item.quantity
                }))
            );

            // Send email asynchronously (don't block response)
            sendEmail(updatedOrder.user.email, 'MiLabs Booking Confirmation', emailHtml);
        }

        return NextResponse.json({ success: true, message: 'Payment verified and email sent' });

    } catch (error: any) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
