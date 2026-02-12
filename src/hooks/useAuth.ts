import { useSession, signIn, signOut } from "next-auth/react";
import { useUserStore } from '@/store/userStore';
import { useEffect } from "react";

export const useAuth = () => {
    const { data: session, status } = useSession();
    const { user, login, logout } = useUserStore();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // Sync NextAuth session with Zustand store
            login({
                id: (session.user as any).id || 'google-user',
                name: session.user.name || '',
                email: session.user.email || '',
                role: (session.user as any).role || 'patient',
                isVerified: true,
                avatar: session.user.image || undefined
            });
        }
    }, [session, status, login]);

    // If we have a manual Zustand login (demo mode), prioritize that, specific for dev
    const activeUser = user || (session?.user ? {
        id: (session.user as any).id || 'google-user',
        name: session.user.name as string,
        email: session.user.email as string,
        role: (session.user as any).role || 'patient',
        avatar: session.user.image as string || undefined,
        isVerified: true
    } : null);

    return {
        user: activeUser,
        isAuthenticated: !!activeUser,
        isLoading: status === 'loading',
        login: (userData: any) => login(userData), // Manual login
        logout: () => {
            signOut({ callbackUrl: '/' });
            logout();
        },
        signIn: (provider: string) => signIn(provider),
    };
};
