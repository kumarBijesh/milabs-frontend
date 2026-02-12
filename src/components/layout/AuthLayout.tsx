import Link from 'next/link';
import { Rocket } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10 glass p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center justify-center mb-6 group">
                        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
                            <Rocket className="w-7 h-7" />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {subtitle}
                    </p>
                </div>

                {children}

                <div className="mt-6 text-center text-xs text-slate-500">
                    By continuing, you agree to MiLabs's{' '}
                    <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                        Privacy Policy
                    </Link>.
                </div>
            </div>
        </div>
    );
}
