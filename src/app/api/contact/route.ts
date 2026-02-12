import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const inquiry = await prisma.contactInquiry.create({
            data: {
                name,
                email,
                subject: subject || 'General Inquiry',
                message,
                status: 'new'
            }
        });

        return NextResponse.json({ success: true, data: inquiry });
    } catch (error) {
        console.error('Contact form submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit inquiry' },
            { status: 500 }
        );
    }
}
