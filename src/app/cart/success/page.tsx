"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCartStore();
    const [isValidating, setIsValidating] = useState(true);

    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    useEffect(() => {
        if (sessionId && orderId) {
            // Verify Stripe Payment (simplified for demo)
            fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    dbOrderId: orderId,
                    gateway: 'stripe'
                }),
            }).then(res => res.json())
                .then(data => {
                    if (data.success) {
                        clearCart();
                        setIsValidating(false);
                    } else {
                        // Handle failure
                        alert('Payment verification failed.');
                        router.push('/cart');
                    }
                })
                .catch(err => {
                    console.error(err);
                    setIsValidating(false);
                });
        } else {
            // If no session ID, redirect to home
            router.push('/');
        }
    }, [sessionId, orderId, clearCart, router]);

    if (isValidating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Finalizing your order...</h2>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
            >
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </motion.div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Payment Successful!</h1>

            <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                Thank you for your booking. Your order <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">#{orderId?.slice(-6)}</span> has been confirmed.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mb-8 w-full">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    A confirmation email has been sent to your registered email address.
                    You can view your booking details and track status in your dashboard.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link
                    href="/patient/bookings"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                >
                    View My Bookings <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                    href="/"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold rounded-xl transition-all"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-12 px-4">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p>Loading...</p>
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
