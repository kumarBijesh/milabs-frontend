import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { sendEmail, getOtpEmail } from '@/lib/email';

// Debug check for NextAuth keys in server console
if (typeof window === 'undefined') {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.warn('\x1b[31m%s\x1b[0m', '⚠️  NextAuth: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing!');
    }
    if (!process.env.NEXTAUTH_SECRET) {
        console.warn('\x1b[31m%s\x1b[0m', '⚠️  NextAuth: NEXTAUTH_SECRET is missing!');
    }
}

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

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                // Admin OTP Check
                if (['super_admin', 'admin', 'lab_admin', 'marketing_admin', 'support_admin', 'viewer_admin'].includes(user.role)) {
                    const otp = (credentials as any).otp?.toString();

                    if (otp) {
                        if (user.otp !== otp || !user.otpExpires || new Date() > user.otpExpires) {
                            throw new Error("Invalid or expired OTP");
                        }
                        await prisma.user.update({
                            where: { id: user.id },
                            data: {
                                otp: null,
                                otpExpires: null,
                                isVerified: true
                            }
                        });
                        return user;
                    }

                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

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
            allowDangerousEmailAccountLinking: true,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || '',
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
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
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role || 'patient';
            }
            return token;
        },
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') {
                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { isVerified: true, emailVerified: new Date() }
                    });
                } catch (error) {
                    console.error('Failed to update social user verification:', error);
                }
            }
            return true;
        }
    },
    events: {
        async createUser({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true, emailVerified: new Date() }
            });
        }
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-replace-in-prod',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
