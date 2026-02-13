"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signIn } from 'next-auth/react';
import { Shield, Lock, Mail, ArrowLeft, Loader2, Building2, Megaphone, Headphones, Crown, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type AdminRole = 'super_admin' | 'lab_admin' | 'marketing_admin' | 'support_admin' | 'viewer_admin' | null;

const ADMIN_ROLES = [
    {
        id: 'super_admin',
        title: 'Super Admin',
        description: 'Complete platform access & control',
        icon: Crown,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        hover: 'hover:border-yellow-500/50',
    },
    {
        id: 'viewer_admin',
        title: 'Viewer Admin',
        description: 'Read-only access to all panels',
        icon: Eye,
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        hover: 'hover:border-cyan-500/50',
    },
    {
        id: 'lab_admin',
        title: 'Lab Admin',
        description: 'Manage lab profile, tests & orders',
        icon: Building2,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        hover: 'hover:border-purple-500/50',
    },
    {
        id: 'marketing_admin',
        title: 'Marketing Admin',
        description: 'Campaigns, ads & lead management',
        icon: Megaphone,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        hover: 'hover:border-pink-500/50',
    },
    {
        id: 'support_admin',
        title: 'Support Admin',
        description: 'Customer inquiries & ticket resolution',
        icon: Headphones,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        hover: 'hover:border-blue-500/50',
    },
];

const AdminLoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [selectedRole, setSelectedRole] = useState<AdminRole>(null);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;

        setIsLoading(true);

        try {
            // First Attempt: Standard Credentials
            // Second Attempt (if showOtp): Include OTP
            const credentials: any = {
                email,
                password,
                redirect: false
            };

            if (showOtp) {
                credentials.otp = otp;
            }

            const result = await signIn('credentials', credentials);

            if (result?.error) {
                // If backend signals OTP required
                if (result.error === 'OTP_REQUIRED') {
                    setShowOtp(true);
                    toast.message('Verification Code Sent', {
                        description: `We've sent an OTP to ${email}. Please verify to continue.`
                    });
                    setIsLoading(false);
                    return;
                }

                toast.error(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error);
                setIsLoading(false);
                return;
            }

            toast.success('Login successful!');
            window.location.reload();

        } catch (error) {
            console.error('Admin login error:', error);
            toast.error('An unexpected error occurred');
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email || !password) return;
        try {
            toast.loading('Resending OTP...');
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            toast.dismiss();

            if (res.ok) {
                toast.success('New OTP sent successfully');
            } else {
                toast.error(data.error || 'Failed to resend OTP');
            }
        } catch (error) {
            toast.dismiss();
            toast.error('Network error');
        }
    };

    const activeRoleConfig = ADMIN_ROLES.find(r => r.id === selectedRole);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Subtle light effect */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${selectedRole ? activeRoleConfig?.bg.replace('/10', '/5') : 'bg-blue-500/5'}`}></div>

            <div className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl p-8 relative z-10 animate-fade-in">

                {!selectedRole ? (
                    // VIEW 1: ROLE SELECTION
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-700 shadow-inner">
                                <Shield className="w-8 h-8 text-zinc-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
                            <p className="text-zinc-400">Select your administrative role to continue</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ADMIN_ROLES.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id as AdminRole)}
                                    className={`group relative p-4 rounded-xl border bg-zinc-900/50 hover:bg-zinc-800/80 text-left transition-all duration-300 ${role.hover} ${role.border}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg ${role.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <role.icon className={`w-5 h-5 ${role.color}`} />
                                    </div>
                                    <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-blue-400 transition-colors">{role.title}</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">{role.description}</p>

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-zinc-800 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-xs text-zinc-500 hover:text-white transition-colors gap-1.5 group"
                            >
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                                Back to main site
                            </Link>
                        </div>
                    </div>
                ) : (
                    // VIEW 2: LOGIN FORM
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col items-center mb-8 text-center">
                            <button
                                onClick={() => { setSelectedRole(null); setShowOtp(false); setOtp(''); }}
                                className="absolute top-0 left-0 p-2 text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-xs"
                            >
                                <ArrowLeft className="w-3 h-3" /> Back
                            </button>

                            <div className={`w-16 h-16 ${activeRoleConfig?.bg} rounded-2xl flex items-center justify-center mb-4 border ${activeRoleConfig?.border}`}>
                                {activeRoleConfig && <activeRoleConfig.icon className={`w-8 h-8 ${activeRoleConfig.color}`} />}
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">{activeRoleConfig?.title} Login</h1>
                            <p className="text-zinc-500 text-sm mt-2">
                                {showOtp ? 'Enter verification code sent to your email' : `Enter credentials to access ${activeRoleConfig?.title} panel`}
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">

                            {!showOtp ? (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 bg-black/40 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all sm:text-sm"
                                                placeholder={`${selectedRole}@milabs.com`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 bg-black/40 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all sm:text-sm"
                                                placeholder="••••••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex justify-center">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="block w-full text-center tracking-[1em] text-2xl font-bold py-4 bg-black/40 border border-zinc-800 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                            placeholder="••••••"
                                            maxLength={6}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                                        >
                                            Resend Verification Code
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all shadow-lg mt-2",
                                    isLoading ? "bg-zinc-800 cursor-not-allowed" :
                                        activeRoleConfig?.id === 'super_admin' ? "bg-yellow-600 hover:bg-yellow-500" :
                                            activeRoleConfig?.id === 'lab_admin' ? "bg-purple-600 hover:bg-purple-500" :
                                                activeRoleConfig?.id === 'marketing_admin' ? "bg-pink-600 hover:bg-pink-500" :
                                                    "bg-blue-600 hover:bg-blue-500"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {showOtp ? "Verifying..." : "Authenticating..."}
                                    </>
                                ) : (
                                    showOtp ? "Verify & Login" : "Access Dashboard"
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLoginPage;
