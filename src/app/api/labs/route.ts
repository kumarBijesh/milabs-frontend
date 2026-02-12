import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const labSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email(),
    image: z.string().optional(),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const city = searchParams.get('city');

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (city) {
            where.city = { equals: city, mode: 'insensitive' };
        }

        const labs = await prisma.lab.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                tests: {
                    select: { id: true, name: true, price: true }
                }
            }
        });

        return NextResponse.json(labs);
    } catch (error) {
        console.error('Labs GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch labs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['super_admin', 'admin', 'lab_admin'].includes((session.user as any)?.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = labSchema.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json({ error: validatedData.error.flatten() }, { status: 400 });
        }

        const lab = await prisma.lab.create({
            data: validatedData.data
        });

        return NextResponse.json(lab, { status: 201 });
    } catch (error) {
        console.error('Lab Creation Error:', error);
        return NextResponse.json({ error: 'Failed to create lab' }, { status: 500 });
    }
}
