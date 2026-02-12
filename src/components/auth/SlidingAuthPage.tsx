"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Check, ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

interface SlidingAuthPageProps {
    initialMode?: 'login' | 'signup';
}

export default function SlidingAuthPage({ initialMode = 'login' }: SlidingAuthPageProps) {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, isAuthenticated } = useAuth();

    // Get callback URL or default to home
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push(callbackUrl);
        }
    }, [isAuthenticated, router, callbackUrl]);


    // Login Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup Form State
    const [signupData, setSignupData] = useState({ firstName: '', lastName: '', email: '', password: '' });

    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Optionally update URL without reload
        const newPath = !isLogin ? '/auth/login' : '/auth/signup';
        window.history.pushState({}, '', newPath);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email: loginEmail,
                password: loginPassword,
                redirect: false
            });

            if (result?.error) {
                alert(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error);
                return;
            }

            router.push(callbackUrl);
            router.refresh(); // Refresh to catch session in navbar/middleware
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            login({
                id: 'mock-user-new',
                name: `${signupData.firstName} ${signupData.lastName}`.trim(),
                email: signupData.email,
                role: 'patient',
                isVerified: true
            });
            router.push(callbackUrl);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center font-sans px-4 py-12 relative min-h-[calc(100vh-80px)]">

            <div className="w-full max-w-[1000px] h-[600px] relative bg-white dark:bg-zinc-900/50 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm">

                {/* LOGIN FORM (Left Side) - When Active */}
                <div className={`
                    w-full h-full flex flex-col justify-center px-8 transition-opacity duration-500
                    lg:absolute lg:top-0 lg:left-0 lg:w-1/2 lg:px-12
                    ${isLogin ? 'opacity-100 z-10' : 'hidden lg:flex lg:opacity-0 lg:z-0'}
                `}>
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm">Log in to track your health journey</p>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-purple-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-medium text-slate-500 dark:text-zinc-400">Password</label>
                                    <Link href="/auth/forgot-password" className="text-xs text-blue-600 dark:text-purple-400 hover:text-blue-500 dark:hover:text-purple-300 transition-colors">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-purple-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-black font-bold py-3 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/20"
                            >
                                {isLoading ? 'Logging In...' : 'Log In'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-8 flex gap-4">
                            <button onClick={() => signIn('google', { callbackUrl })} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-xs text-slate-600 dark:text-zinc-300 font-medium bg-white dark:bg-black/30">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                Google
                            </button>
                            <button onClick={() => signIn('facebook', { callbackUrl })} className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-xs text-slate-600 dark:text-zinc-300 font-medium bg-white dark:bg-black/30">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>

                {/* SIGN UP FORM (Right Side) - Hidden on Mobile */}
                <div className={`
                    hidden lg:flex lg:absolute lg:top-0 lg:right-0 lg:w-1/2 lg:h-full flex-col justify-center px-12 transition-opacity duration-500
                    ${!isLogin ? 'lg:opacity-100 lg:z-10' : 'lg:opacity-0 lg:z-0'}
                `}>
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
                            <p className="text-slate-500 dark:text-zinc-400 text-sm">Join MiLabs for better health management</p>
                        </div>

                        <form onSubmit={handleSignupSubmit} className="space-y-3">
                            <div className="flex gap-3">
                                <div className="space-y-1 flex-1">
                                    <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 ml-1">First Name</label>
                                    <input
                                        type="text"
                                        value={signupData.firstName}
                                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-purple-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                        placeholder="John"
                                        required
                                    />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={signupData.lastName}
                                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-purple-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 ml-1">Email</label>
                                <input
                                    type="email"
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-purple-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 dark:text-zinc-400 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-purple-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                                        placeholder="Create a password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-black font-bold py-3 rounded-xl transition-all mt-6 flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
                            >
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </div>
                </div>

                {/* SLIDING OVERLAY - Hidden on Mobile */}
                <motion.div
                    className="
                        hidden lg:flex absolute top-0 w-1/2 h-full bg-blue-600 dark:bg-[#1e0b36] z-20 overflow-hidden flex-col items-center justify-center p-12 text-center text-white
                    "
                    initial={false}
                    animate={{
                        x: isLogin ? "100%" : "0%"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* Gradient Backgrounds */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-purple-600 dark:via-violet-900 dark:to-black opacity-90 z-0"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-purple-500/30 rounded-full blur-3xl translate-x-12 -translate-y-12"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 dark:bg-blue-500/20 rounded-full blur-3xl -translate-x-12 translate-y-12"></div>

                    {/* Content for Sign Up Mode (When overlay is on Left) - Shows "Sign In" option */}
                    <motion.div
                        className="relative z-10 w-full max-w-xs flex flex-col items-center gap-6"
                        animate={{ opacity: isLogin ? 0 : 1, y: isLogin ? 20 : 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ display: isLogin ? 'none' : 'flex' }}
                    >
                        <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md mb-2">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">Welcome Back!</h2>
                        <p className="text-blue-100 dark:text-gray-300 text-sm">
                            To keep connected with us please login with your personal info.
                        </p>
                        <button
                            onClick={toggleMode}
                            className="px-8 py-3 rounded-xl border border-white text-white font-medium hover:bg-white hover:text-blue-600 dark:hover:text-black transition-all transform hover:scale-105"
                        >
                            Sign In
                        </button>
                    </motion.div>

                    {/* Content for Login Mode (When overlay is on Right) - Shows "Sign Up" option */}
                    <motion.div
                        className="relative z-10 w-full max-w-xs flex flex-col items-center gap-6"
                        animate={{ opacity: isLogin ? 1 : 0, y: isLogin ? 0 : 20 }}
                        transition={{ delay: 0.1 }}
                        style={{ display: isLogin ? 'flex' : 'none' }}
                    >
                        <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-md mb-2">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">New Here?</h2>
                        <p className="text-blue-100 dark:text-gray-300 text-sm">
                            Enter your personal details and start your journey with us.
                        </p>
                        <button
                            onClick={toggleMode}
                            className="px-8 py-3 rounded-xl border border-white text-white font-medium hover:bg-white hover:text-blue-600 dark:hover:text-black transition-all transform hover:scale-105"
                        >
                            Sign Up
                        </button>
                    </motion.div>

                </motion.div>
            </div>

            {/* Admin Login Link */}
            <div className="absolute bottom-4 left-0 w-full text-center">
                <Link href="/auth/admin/login" className="text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
                    Admin Access
                </Link>
            </div>

        </div>
    );
}
