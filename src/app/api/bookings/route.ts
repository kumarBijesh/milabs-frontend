import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createOrderSchema = z.object({
    labId: z.string(),
    items: z.array(z.object({
        testId: z.string().optional(),
        packageId: z.string().optional(),
        quantity: z.number().min(1).default(1),
        price: z.number()
    })),
    totalAmount: z.number(),
    bookingDate: z.string().datetime(), // ISO Date string
    slotTime: z.string().optional(),
    paymentMethod: z.string().default('razorpay'),
});

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRole = (session.user as any)?.role;
        const userId = (session.user as any)?.id;

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let where: any = {};

        // Patients can only see their own orders
        if (userRole === 'patient') {
            where.userId = userId;
        }
        // Lab admins view orders for their lab (needs labId stored in user or fetched)
        // For MVP simplified: Admin can view all

        if (status) where.status = status;

        const orders = await prisma.order.findMany({
            where,
            include: {
                lab: { select: { name: true, city: true } },
                items: {
                    include: { test: true, package: true }
                },
                user: { select: { name: true, email: true, phone: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Orders GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any)?.id;
        const body = await request.json();

        const result = createOrderSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
        }

        const { labId, items, totalAmount, bookingDate, slotTime, paymentMethod } = result.data;

        const order = await prisma.order.create({
            data: {
                userId,
                labId,
                totalAmount,
                bookingDate,
                slotTime,
                paymentMethod,
                items: {
                    create: items.map(item => ({
                        testId: item.testId,
                        packageId: item.packageId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Order Creation Error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
