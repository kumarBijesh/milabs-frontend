import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail, getVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, password, captchaToken } = await request.json();

        if (!email || !password || !firstName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify CAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (captchaToken && secretKey) {
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
            const captchaRes = await fetch(verifyUrl, { method: 'POST' });
            const captchaData = await captchaRes.json();

            if (!captchaData.success) {
                return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
            }
        } else if (process.env.NODE_ENV === 'production') {
            // Log warning in production if keys are missing
            console.warn('RECAPTCHA_SECRET_KEY missing in production');
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
                role: 'patient',
                isVerified: false,
                emailVerified: null,
                verificationToken,
                walletBalance: 0,
            },
        });

        // Send Verification Email
        const emailHtml = getVerificationEmail(user.name || 'User', verificationToken);
        await sendEmail(user.email!, 'Verify Your Email', emailHtml);

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: userWithoutPassword,
            message: 'User created successfully. Please check your email for verification.'
        });

    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
