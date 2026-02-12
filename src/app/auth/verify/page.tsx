"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerificationContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await fetch(`/api/auth/verify?token=${token}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Verification failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred during verification.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-800 text-center">
            {status === 'verifying' && (
                <>
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifying Email...</h2>
                    <p className="text-slate-500 dark:text-slate-400">Please wait while we verify your account.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Verified!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Your account has been successfully verified. You can now log in.
                    </p>
                    <Link
                        href="/auth/login"
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                        Go to Login
                    </Link>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification Failed</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        {message}
                    </p>
                    <Link
                        href="/auth/signup"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Try Signing Up Again
                    </Link>
                </>
            )}
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <VerificationContent />
            </Suspense>
        </div>
    );
}
