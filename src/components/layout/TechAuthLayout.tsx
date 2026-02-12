'use client';

import React from 'react';
import { motion } from 'framer-motion';

const CircuitLines = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
            </linearGradient>
        </defs>

        {/* Left Connection */}
        <path d="M0,150 L100,150 L150,200 L300,200" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="opacity-30" />
        <rect x="0" y="130" width="60" height="40" rx="4" fill="#1e293b" stroke="#334155" />
        <circle cx="100" cy="150" r="3" fill="#3b82f6" />

        <path d="M0,600 L80,600 L120,550 L300,550" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="opacity-30" />
        <rect x="0" y="580" width="60" height="40" rx="4" fill="#1e293b" stroke="#334155" />
        <circle cx="80" cy="600" r="3" fill="#3b82f6" />

        {/* Right Connection */}
        <path d="M1000,150 L900,150 L850,200 L700,200" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="opacity-30" />
        <rect x="940" y="130" width="60" height="40" rx="4" fill="#1e293b" stroke="#334155" />
        <circle cx="900" cy="150" r="3" fill="#3b82f6" />

        <path d="M1000,600 L920,600 L880,550 L700,550" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="opacity-30" />
        <rect x="940" y="580" width="60" height="40" rx="4" fill="#1e293b" stroke="#334155" />
        <circle cx="920" cy="600" r="3" fill="#3b82f6" />
    </svg>
);

export default function TechAuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden text-white">
            {/* Circuit Background */}
            <div className="hidden md:block absolute inset-0 w-full h-full">
                {/* Simplified CSS lines for responsiveness if SVG is too static, usually SVG is better for fixed 'circuit' look */}
                <div className="absolute top-1/2 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-900/40 to-transparent -translate-y-48" />
                <div className="absolute top-1/2 right-0 w-1/3 h-[1px] bg-gradient-to-l from-transparent via-blue-900/40 to-transparent -translate-y-48" />

                <div className="absolute top-1/2 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-900/40 to-transparent translate-y-48" />
                <div className="absolute top-1/2 right-0 w-1/3 h-[1px] bg-gradient-to-l from-transparent via-blue-900/40 to-transparent translate-y-48" />

                {/* Nodes */}
                <div className="absolute top-1/2 left-[10%] w-20 h-12 bg-slate-900/80 border border-slate-800 rounded -translate-y-52 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-center justify-center">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                    </div>
                </div>
                <div className="absolute top-1/2 right-[10%] w-20 h-12 bg-slate-900/80 border border-slate-800 rounded -translate-y-52 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-center justify-center">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                    </div>
                </div>

                <div className="absolute top-1/2 left-[10%] w-20 h-12 bg-slate-900/80 border border-slate-800 rounded translate-y-44 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-center justify-center">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                    </div>
                </div>
                <div className="absolute top-1/2 right-[10%] w-20 h-12 bg-slate-900/80 border border-slate-800 rounded translate-y-44 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-center justify-center">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                    </div>
                </div>

                {/* Connecting Lines (Diagonal) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 15% 50% Q 25% 50% 30% 50%" stroke="rgba(59, 130, 246, 0.2)" fill="none" />
                </svg>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                {children}
            </div>
        </div>
    );
}
