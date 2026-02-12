import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateUserSchema = z.object({
    id: z.string(),
    role: z.enum(['patient', 'admin', 'super_admin', 'lab_admin']).optional(),
    phone: z.string().optional(),
    name: z.string().optional(),
});

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role;

        if (!session || !['super_admin', 'admin'].includes(userRole)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const search = searchParams.get('search');

        const where: any = {};
        if (role) where.role = role;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // prevent massive fetches accidentally
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Users GET Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role;

        // Only Super Admin can change roles
        if (!session || userRole !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const result = updateUserSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { id, ...data } = result.data;

        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('User Update Error:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
