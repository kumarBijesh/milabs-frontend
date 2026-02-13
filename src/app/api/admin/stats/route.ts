import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. User Stats
        const totalUsers = await prisma.user.count();
        const usersByRole = await prisma.user.groupBy({
            by: ['role'],
            _count: {
                role: true,
            },
        });

        // 2. Lab Stats Breakdown
        const totalLabs = await prisma.lab.count();
        const activeLabs = await prisma.lab.count({ where: { isActive: true } });
        const verifiedLabs = await prisma.lab.count({ where: { isVerified: true } });

        // 3. Test & Booking Stats
        const totalTests = await prisma.test.count();
        const totalOrders = await prisma.order.count();

        // 4. Revenue (Aggregation)
        const revenueAgg = await prisma.order.aggregate({
            _sum: {
                totalAmount: true
            },
            where: {
                paymentStatus: 'paid'
            }
        });

        return NextResponse.json({
            users: {
                total: totalUsers,
                breakdown: usersByRole.reduce((acc, curr) => ({ ...acc, [curr.role]: curr._count.role }), {})
            },
            labs: {
                total: totalLabs,
                active: activeLabs,
                verified: verifiedLabs
            },
            platform: {
                tests: totalTests,
                bookings: totalOrders,
                revenue: revenueAgg._sum.totalAmount || 0
            }
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
