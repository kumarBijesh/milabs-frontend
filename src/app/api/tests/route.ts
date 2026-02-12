import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const testSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    category: z.string(),
    price: z.number().min(0),
    discount: z.number().min(0).max(100).optional(),
    labId: z.string().cuid(),
    duration: z.string().optional(),
    preparation: z.string().optional(),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const labId = searchParams.get('labId');
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: any = { isActive: true };

        if (labId) where.labId = labId;
        if (category) where.category = category;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const tests = await prisma.test.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                lab: {
                    select: { id: true, name: true, city: true }
                }
            }
        });

        return NextResponse.json(tests);
    } catch (error) {
        console.error('Tests GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !['super_admin', 'admin', 'lab_admin'].includes((session.user as any)?.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = testSchema.safeParse(body);

        if (!validatedData.success) {
            return NextResponse.json({ error: validatedData.error.flatten() }, { status: 400 });
        }

        const test = await prisma.test.create({
            data: validatedData.data
        });

        return NextResponse.json(test, { status: 201 });
    } catch (error) {
        console.error('Test Creation Error:', error);
        return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
    }
}
