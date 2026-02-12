"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon, LogOut } from 'lucide-react';

interface SidebarItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

interface DashboardSidebarProps {
    title: string;
    items: SidebarItem[];
    userEmail?: string;
    userName?: string;
    userAvatar?: string;
}

export default function DashboardSidebar({ title, items, userEmail, userName, userAvatar }: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {title}
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all group",
                                isActive
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/30 shadow-lg shadow-blue-500/10"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("mr-3 h-5 w-5 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
                <div className="flex items-center mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-slate-800 overflow-hidden">
                        {userAvatar ? (
                            <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            (userName || userEmail || 'U')[0].toUpperCase()
                        )}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{userName || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                    </div>
                </div>
                <Link href="/auth/login" className="flex items-center px-4 py-2 text-sm font-medium text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}
