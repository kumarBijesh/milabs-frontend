"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    Sidebar: React.ReactNode;
}

export default function DashboardLayoutWrapper({ children, Sidebar }: DashboardLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-800 dark:text-slate-100">
            <div className="hidden md:block w-64 h-screen fixed left-0 top-0 z-30 shadow-xl border-r border-slate-800">
                {Sidebar}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:ml-64 relative bg-slate-50 dark:bg-slate-900 min-h-screen">
                {/* Mobile Header */}
                <div className="sticky top-0 right-0 left-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md md:hidden z-20 flex justify-between items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">MiLabs</span>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-400">
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
                        <div className="absolute top-0 left-0 bottom-0 w-64 bg-slate-900 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            {/* Re-rendering Sidebar content for mobile - ideally this should be cleaner */}
                            {Sidebar}
                        </div>
                    </div>
                )}

                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
