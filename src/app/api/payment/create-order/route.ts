import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { stripe, razorpay } from '@/lib/payment';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, currency, gateway, items } = await request.json();

        // Create a pending order in DB first
        const order = await prisma.order.create({
            data: {
                userId: (session.user as any).id,
                totalAmount: amount,
                status: 'pending',
                paymentStatus: 'pending',
                bookingDate: new Date(), // For now, default to today
                items: {
                    create: items.map((item: any) => ({
                        testId: item.labId ? undefined : item.id, // Logic needs refinment based on item type
                        price: item.price,
                        quantity: item.quantity
                    }))
                }
            }
        });

        if (gateway === 'stripe') {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: items.map((item: any) => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.title,
                            images: item.image ? [item.image] : [],
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                })),
                mode: 'payment',
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
                metadata: { orderId: order.id },
            });

            return NextResponse.json({
                sessionId: session.id,
                url: session.url,
                orderId: order.id,
                gateway: 'stripe'
            });
        }

        if (gateway === 'razorpay') {
            const options = {
                amount: Math.round(amount * 100), // Razorpay expects paise
                currency: currency,
                receipt: order.id,
            };

            const razorpayOrder = await razorpay.orders.create(options);

            return NextResponse.json({
                orderId: razorpayOrder.id, // Razorpay Order ID
                dbOrderId: order.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                gateway: 'razorpay',
                key: process.env.RAZORPAY_KEY_ID
            });
        }

        return NextResponse.json({ error: 'Invalid gateway' }, { status: 400 });

    } catch (error: any) {
        console.error('Payment Init Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
