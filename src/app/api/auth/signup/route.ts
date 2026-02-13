import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail, getVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        let { firstName, lastName, email, password, captchaToken } = await request.json();

        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        email = email.toLowerCase().trim();

        // Name Validation
        const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            return NextResponse.json({
                error: 'Names must be 2-50 characters and contain only letters.'
            }, { status: 400 });
        }

        // Server-side password validation backup
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,32}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({
                error: 'Password must be 10-32 chars, with uppercase, lowercase, number, and special char.'
            }, { status: 400 });
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
        } else if (process.env.NODE_ENV === 'production' && !captchaToken) {
            // Basic check if we expect captcha in prod
            // console.warn('RECAPTCHA_SECRET_KEY missing in production');
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json({ error: 'User already exists. Please log in.' }, { status: 400 });
            } else {
                // User exists but is not verified. Resend verification email.
                const verificationToken = crypto.randomBytes(32).toString('hex');

                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { verificationToken }
                });

                const emailHtml = getVerificationEmail(existingUser.name || 'User', verificationToken);
                const emailSent = await sendEmail(existingUser.email!, 'Verify Your Email', emailHtml);

                if (!emailSent) {
                    // This happens if sendEmail returns null (error sending)
                    return NextResponse.json({
                        success: true,
                        message: 'Account exists but is unverified. Failed to send verification email (check server logs).'
                    });
                }

                return NextResponse.json({
                    success: true,
                    message: 'Account exists but is not verified. A new verification email has been sent.'
                });
            }
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
