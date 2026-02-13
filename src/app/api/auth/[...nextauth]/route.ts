import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { sendEmail, getOtpEmail } from '@/lib/email';
import crypto from 'crypto';

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const email = credentials.email.toLowerCase().trim();
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user || !user.password) return null;

                // Only require verification for patients (to prevent admin lockout if not verified)
                if (!user.isVerified && user.role === 'patient') {
                    throw new Error("Please verify your email first.");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                // Admin OTP Check
                if (['super_admin', 'admin', 'lab_admin', 'marketing_admin', 'support_admin', 'viewer_admin'].includes(user.role)) {
                    const otp = (credentials as any).otp;

                    // If OTP provided, Verify it
                    if (otp) {
                        if (user.otp !== otp || !user.otpExpires || new Date() > user.otpExpires) {
                            throw new Error("Invalid or expired OTP");
                        }
                        // Clear OTP (security)
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { otp: null, otpExpires: null }
                        });
                        return user;
                    }

                    // If OTP NOT provided, Generate & Send
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { otp: newOtp, otpExpires }
                    });

                    const html = getOtpEmail(user.name || 'Admin', newOtp);
                    await sendEmail(user.email!, 'MiLabs Admin OTP Login', html);

                    throw new Error("OTP_REQUIRED");
                }

                return user;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            // When using JWT strategy, 'user' is undefined, and we use 'token'
            // When using database strategy (default with adapter), 'token' is undefined and we use 'user'
            if (session?.user) {
                if (token) {
                    (session.user as any).role = token.role || 'patient';
                    (session.user as any).id = token.sub || '';
                } else if (user) {
                    (session.user as any).role = (user as any).role || 'patient';
                    (session.user as any).id = user.id;
                }
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = (user as any).role || 'patient';
            }
            return token;
        }
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
