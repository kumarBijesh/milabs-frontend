import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// RBAC Configuration
const ROLE_PERMISSIONS: Record<string, string[]> = {
    super_admin: ['super_admin', 'admin', 'viewer_admin', 'lab_admin', 'marketing_admin', 'support_admin'],
    admin: ['viewer_admin', 'lab_admin', 'marketing_admin', 'support_admin'], // Admin can create lower roles
    lab_admin: ['marketing_admin', 'support_admin'], // Lab Admin can only create staff for their lab
    viewer_admin: [],
    marketing_admin: [],
    support_admin: []
};

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true, labId: true }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { name, email, password, role, labId } = body;

        // 1. Verify if current user has permission to create this role
        const allowedRoles = ROLE_PERMISSIONS[currentUser.role as keyof typeof ROLE_PERMISSIONS] || [];
        if (!allowedRoles.includes(role)) {
            return NextResponse.json({
                error: `Permission denied: ${currentUser.role} cannot create ${role}`
            }, { status: 403 });
        }

        // 2. Additional Checks for Lab Admin
        // If Lab Admin is creating a user, force the labId to be their own labId
        let finalLabId = labId;
        if (currentUser.role === 'lab_admin') {
            if (!currentUser.labId) {
                return NextResponse.json({ error: 'Lab Admin is not associated with any Lab' }, { status: 400 });
            }
            finalLabId = currentUser.labId; // Force assignment to same lab
        }

        // If Super Admin is creating a lab role, they MUST provide a labId
        if (['marketing_admin', 'support_admin'].includes(role) && currentUser.role === 'super_admin' && !finalLabId) {
            // Optional: Decide if marketing/support MUST be linked to a lab or can be global. 
            // Assuming generic staff can be global, but if specific to lab, ID is needed.
            // For now, let's allow global marketing admins if no labId provided.
        }

        // 3. User Existence Check
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // 4. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                labId: finalLabId || null,
                isVerified: true, // Internal staff are verified by default
            }
        });

        const { password: _, ...userWithoutPassword } = newUser;
        return NextResponse.json(userWithoutPassword);

    } catch (error) {
        console.error('Error creating staff:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true, labId: true }
        });

        if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        let whereClause = {};

        // RBAC Filter for Listing
        if (currentUser.role === 'super_admin') {
            // Can see everyone (except maybe restrict showing other super admins if desired, but usually they can see all)
            whereClause = {
                role: { in: ['super_admin', 'admin', 'viewer_admin', 'lab_admin', 'marketing_admin', 'support_admin'] }
            };
        } else if (currentUser.role === 'lab_admin') {
            // Can only see staff in THEIR lab
            if (!currentUser.labId) return NextResponse.json({ error: 'No Lab assigned' }, { status: 400 });

            whereClause = {
                labId: currentUser.labId,
                role: { in: ['marketing_admin', 'support_admin'] } // Only see their staff
            };
        } else if (currentUser.role === 'admin') {
            // Can see everyone lower than them?
            whereClause = {
                role: { in: ['viewer_admin', 'lab_admin', 'marketing_admin', 'support_admin'] }
            };
        } else {
            return NextResponse.json({ error: 'Permission denied to view staff' }, { status: 403 });
        }

        const staff = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                labId: true,
                createdAt: true,
                isVerified: true,
                lab: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(staff);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
