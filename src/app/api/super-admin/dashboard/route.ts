import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is super admin
        if (!session || (session.user as any)?.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Super Admin access required.' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        switch (type) {
            case 'stats':
                const [
                    totalUsers,
                    totalAdmins,
                    totalPatients,
                    totalLabAdmins,
                    totalOrders,
                    pendingOrders,
                    completedOrders,
                    revenueResult
                ] = await Promise.all([
                    prisma.user.count(),
                    prisma.user.count({ where: { role: { in: ['admin', 'super_admin'] } } }),
                    prisma.user.count({ where: { role: 'patient' } }),
                    prisma.user.count({ where: { role: 'lab_admin' } }),
                    prisma.order.count(),
                    prisma.order.count({ where: { status: 'pending' } }),
                    prisma.order.count({ where: { status: 'completed' } }),
                    prisma.order.aggregate({
                        _sum: {
                            totalAmount: true
                        },
                        where: {
                            status: 'completed'
                        }
                    })
                ]);

                return NextResponse.json({
                    totalUsers,
                    totalAdmins,
                    totalPatients,
                    totalLabAdmins,
                    totalBookings: totalOrders,
                    totalRevenue: revenueResult._sum.totalAmount || 0,
                    activeBookings: pendingOrders, // Mapping pending to active for now
                    pendingBookings: pendingOrders
                });

            case 'admins':
                const admins = await prisma.user.findMany({
                    where: {
                        role: { in: ['admin', 'super_admin', 'lab_admin'] }
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        phone: true,
                        createdAt: true,
                        // lastLogin is not typically stored in default next-auth schema unless custom
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });
                return NextResponse.json(admins);

            case 'patients':
                const page = parseInt(searchParams.get('page') || '1');
                const limit = parseInt(searchParams.get('limit') || '10');
                const skip = (page - 1) * limit;

                const [patients, total] = await Promise.all([
                    prisma.user.findMany({
                        where: { role: 'patient' },
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            phone: true,
                            walletBalance: true,
                            createdAt: true,
                            _count: {
                                select: { orders: true }
                            }
                        },
                        skip,
                        take: limit,
                        orderBy: { createdAt: 'desc' }
                    }),
                    prisma.user.count({ where: { role: 'patient' } })
                ]);

                const formattedPatients = patients.map(p => ({
                    ...p,
                    totalBookings: p._count.orders
                }));

                return NextResponse.json({
                    patients: formattedPatients,
                    total,
                    page,
                    totalPages: Math.ceil(total / limit)
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid type parameter' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('Super Admin API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
