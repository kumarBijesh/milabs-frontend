'use client';

import React from 'react';
import { Rocket, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface StepItem {
    id: number;
    label: string;
    status: 'active' | 'completed' | 'pending';
}

interface DarkStepAuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    steps?: StepItem[];
    isLogin?: boolean;
}

export default function DarkStepAuthLayout({ children, title, subtitle, steps, isLogin = false }: DarkStepAuthLayoutProps) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-[1200px] h-[800px] bg-black rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/5">

                {/* Left Side - Purple Gradient */}
                <div className="w-full md:w-1/2 relative p-12 flex flex-col justify-center items-center text-center overflow-hidden bg-[#1e0b36]">
                    {/* Gradient Mesh Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-900 to-black opacity-80 z-0" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(168,85,247,0.5),_transparent_70%)] z-0" />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_rgba(79,70,229,0.3),_transparent_60%)] z-0" />

                    <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                        {/* Brand */}
                        <div className="flex items-center gap-2 mb-12">
                            <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
                                <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-semibold text-lg tracking-wide">MiLabs</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-gray-300 text-lg mb-12 font-light">
                            {subtitle}
                        </p>

                        {/* Steps (Signup only usually) */}
                        {steps && (
                            <div className="w-full space-y-4">
                                {steps.map((step) => (
                                    <div
                                        key={step.id}
                                        className={`flex items-center p-4 rounded-xl transition-all duration-300 ${step.status === 'active'
                                                ? 'bg-white text-black shadow-xl transform scale-105'
                                                : 'bg-white/5 text-gray-400 border border-white/10 backdrop-blur-sm'
                                            }`}
                                    >
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-4 text-sm font-bold ${step.status === 'active' ? 'bg-black text-white' : 'bg-white/10 text-gray-500'
                                            }`}>
                                            {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : step.id}
                                        </div>
                                        <span className="font-medium">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 bg-black p-8 md:p-16 flex flex-col justify-center relative">
                    {children}
                </div>
            </div>
        </div>
    );
}
