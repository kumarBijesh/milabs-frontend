'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, ClipboardCheck, User, FolderClock, LogOut, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
    { label: 'Overview', href: '/patient/dashboard', icon: Home },
    { label: 'My Bookings', href: '/patient/bookings', icon: Calendar },
    { label: 'Lab Reports', href: '/patient/reports', icon: FileText },
    { label: 'Profile', href: '/patient/profile', icon: User },
];

export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user } = useAuth();
    // Simulating user if not logged in for dev purposes
    const username = user?.name || 'Guest User';
    const role = user?.role || 'Patient';

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-white fixed h-full z-20">
                <div className="flex items-center h-16 px-6 border-b border-slate-800">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        MiLabs
                    </Link>
                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                        Patient
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group relative overflow-hidden",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20" />
                                )}
                                <item.icon className={cn("mr-3 h-5 w-5 transition-colors relative z-10", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                <span className="relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2 ring-slate-800 overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={username} className="w-full h-full object-cover" />
                            ) : (
                                username[0].toUpperCase()
                            )}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{username}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{role}</p>
                        </div>
                    </div>
                    <Link href="/auth/login" className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header (Ideally this should be a component) */}
                <div className="md:hidden h-16 bg-slate-900 text-white flex items-center justify-between px-4 sticky top-0 z-30">
                    <span className="font-bold">MiLabs Patient</span>
                    {/* Mobile Menu Button would go here */}
                </div>

                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
