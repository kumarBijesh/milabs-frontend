import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || (session.user as any).role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bookings = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                items: {
                    include: {
                        test: { select: { name: true } },
                        package: { select: { name: true } }
                    }
                }
            }
        });

        // Format for frontend
        const formattedBookings = bookings.map(booking => ({
            id: booking.id,
            user: booking.user?.name || 'Unknown User',
            email: booking.user?.email || 'N/A',
            date: booking.createdAt,
            amount: booking.totalAmount,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            items: booking.items.map(i => i.test?.name || i.package?.name || 'Item').join(', ')
        }));

        return NextResponse.json(formattedBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
