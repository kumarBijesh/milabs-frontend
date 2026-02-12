import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';

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
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user || !user.password) return null;
                const isValid = await bcrypt.compare(credentials.password, user.password);
                return isValid ? user : null;
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
