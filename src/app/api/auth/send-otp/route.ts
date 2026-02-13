import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendEmail, getOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !['super_admin', 'admin', 'lab_admin'].includes(user.role)) {
            return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 });
        }

        const isValid = await bcrypt.compare(password, user.password || '');

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Save to DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpires
            }
        });

        // Send Email
        const html = getOtpEmail(user.name || 'Admin', otp);
        await sendEmail(user.email!, 'MiLabs Admin OTP Login', html);

        return NextResponse.json({ success: true, message: 'OTP sent to email' });

    } catch (error) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
