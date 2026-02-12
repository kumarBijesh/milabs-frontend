'use client';

import Link from 'next/link';
import { Rocket } from 'lucide-react';
import React from 'react';

interface SplitAuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    rightTitle: string;
    rightSubtitle: string;
    image?: React.ReactNode;
}

export default function SplitAuthLayout({
    children,
    title,
    subtitle,
    rightTitle,
    rightSubtitle,
    image
}: SplitAuthLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                    <div className="mb-10">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Rocket className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-slate-800">MiLabs</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
                        <p className="text-slate-500">{subtitle}</p>
                    </div>

                    {children}
                </div>

                {/* Right Side - Blue Background & Illustration */}
                <div className="hidden md:flex w-1/2 bg-blue-600 p-12 lg:p-16 flex-col justify-center items-center text-white relative overflow-hidden">
                    {/* Background Circles/Decorations */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 w-full flex flex-col items-center text-center">
                        <div className="mb-12">
                            {image || (
                                // Default placeholder if no image provided
                                <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                                    <Rocket className="w-24 h-24 text-white/80" />
                                </div>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold mb-4">{rightTitle}</h3>
                        <p className="text-blue-100 max-w-md mx-auto leading-relaxed">
                            {rightSubtitle}
                        </p>

                        {/* Pagination Dots */}
                        <div className="flex gap-2 mt-8">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            <div className="w-2 h-2 bg-white/40 rounded-full" />
                            <div className="w-2 h-2 bg-white/40 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
