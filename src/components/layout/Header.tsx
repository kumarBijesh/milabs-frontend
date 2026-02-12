"use client";

import {
    Search, Bell, ShoppingCart, User, MapPin, Menu, X,
    Sparkles, Ticket, Car, Utensils, Activity, Plane,
    ShoppingBag, Tag, ChevronDown, Heart
} from 'lucide-react';
import Link from 'next/link';
import { categories } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useUserStore } from '@/store/userStore';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';

// Helper to map string icon names to Lucide components
const IconMap: { [key: string]: any } = {
    Sparkles, Ticket, Car, Utensils, Activity, MapPin, Plane, ShoppingBag, Tag
};

export default function Header() {
    const { location } = useUserStore();
    const { user, isAuthenticated, logout } = useAuth();
    const itemCount = useCartStore((state) => state.itemCount());
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter(); // Initialize router
    useEffect(() => setMounted(true), []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/deals', label: 'Deals' },
        { href: '/labs', label: 'Labs' },
        { href: '/how-it-works', label: 'How It Works' },
    ];

    return (
        <div className="sticky top-0 z-50 bg-white dark:bg-slate-950 shadow-sm transition-colors duration-300">
            {/* Row A: Top Navigation */}
            <div className="border-b border-slate-100 dark:border-slate-800 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
                    {/* Logo & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 group-hover:scale-105 transition-transform">
                                MiLabs
                            </span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-4">
                            <Link href="/categories" className="flex items-center gap-2">
                                <Menu className="w-5 h-5" />
                                <span>Categories</span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="flex-1 max-w-xl hidden md:flex relative group mx-4">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for tests, labs..."
                            className="w-full pl-10 pr-32 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                        />
                        <button className="absolute right-1 top-1 bottom-1 flex items-center gap-2 px-4 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            <span className="max-w-[100px] truncate">{mounted ? location.city : 'Location'}</span>
                        </button>
                    </div>

                    {/* User Actions & Mobile Search Toggle */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Mobile Search Icon */}
                        <button className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                            <Search className="w-5 h-5" />
                        </button>

                        <Link href="/cart" className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors group">
                            <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-950">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-slate-700">
                                {/* Admin Link for Desktop */}
                                {['super_admin', 'admin', 'lab_admin'].includes(user?.role || '') && (
                                    <Link
                                        href="/super-admin/dashboard"
                                        className="hidden lg:block text-sm font-bold text-indigo-600 hover:text-indigo-700 mr-2"
                                    >
                                        Admin Panel
                                    </Link>
                                )}

                                <div className="hidden sm:flex flex-col items-end mr-3">
                                    <span className="text-sm font-bold text-slate-800 dark:text-white leading-none">
                                        {user?.name || 'User'}
                                    </span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                                        {user?.role?.replace('_', ' ')}
                                    </span>
                                </div>

                                <Link
                                    href={
                                        user?.role === 'patient' ? '/patient/dashboard' :
                                            user?.role === 'super_admin' ? '/super-admin/dashboard' :
                                                user?.role === 'lab_admin' ? '/lab/dashboard' :
                                                    '/admin/dashboard'
                                    }
                                    className="group relative"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-blue-900 dark:to-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 shadow-sm group-hover:shadow-md transition-all overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user?.name ? user.name[0].toUpperCase() : <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                </Link>
                                <button onClick={() => { logout(); router.push('/'); }} className="hidden sm:block text-sm text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors font-medium ml-2">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center pl-4 border-l border-slate-200 dark:border-slate-700">
                                <Link href="/auth/login" className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 whitespace-nowrap">
                                    Log In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-[73px] bottom-0 bg-white dark:bg-slate-950 z-40 p-4 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-top-5">
                    {/* Mobile Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-center transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <Link
                        href="/categories"
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-center border border-blue-100 dark:border-blue-800"
                    >
                        Browse All Categories
                    </Link>

                    {!isAuthenticated && (
                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                href="/auth/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-center shadow-lg shadow-blue-500/20"
                            >
                                Log In / Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Admin Dashboard Mobile Link */}
                    {isAuthenticated && ['super_admin', 'admin', 'lab_admin'].includes(user?.role || '') && (
                        <div className="flex flex-col gap-3 pt-2">
                            <Link
                                href="/super-admin/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-center shadow-lg shadow-indigo-500/20"
                            >
                                Admin Dashboard
                            </Link>
                        </div>
                    )}

                    {isAuthenticated && (
                        <button
                            onClick={() => { logout(); router.push('/'); setMobileMenuOpen(false); }}
                            className="w-full py-3 text-red-500 font-semibold bg-red-50 dark:bg-red-900/10 rounded-xl"
                        >
                            Log Out
                        </button>
                    )}
                </div>
            )}

            {/* Row B: Category Mega Nav (Desktop Only) */}
            <div className="hidden md:block border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 backdrop-blur-sm overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8 py-3 min-w-max">
                        {categories.map((category) => {
                            const Icon = IconMap[category.icon] || Activity;
                            return (
                                <Link
                                    key={category.name}
                                    href={`/deals?category=${encodeURIComponent(category.name)}`}
                                    className={`flex items-center gap-2 text-xs font-semibold transition-colors uppercase tracking-wide ${category.highlight
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 opacity-80" />
                                    {category.name}
                                </Link>
                            );
                        })}
                        <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-wide ml-auto">
                            More <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

