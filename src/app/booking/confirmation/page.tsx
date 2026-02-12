"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Calendar, Clock, QrCode } from 'lucide-react';
import Link from 'next/link';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('id');
    const mode = searchParams.get('mode');

    const [order, setOrder] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!bookingId) return;
            try {
                const res = await fetch(`/api/bookings?id=${bookingId}`);
                const data = await res.json();
                // Filter for our specific order
                const ourOrder = Array.isArray(data) ? data.find((o: any) => o.id === bookingId) : data;

                if (ourOrder) {
                    setOrder(ourOrder);
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch (err) {
                console.error('Fetch order error:', err);
                setStatus('failed');
            }
        };

        fetchOrder();
    }, [bookingId]);

    const expiryString = order?.qrExpiresAt
        ? new Date(order.qrExpiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '30 Days from Booking';

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verifying Booking...</h2>
                <p className="text-slate-500">Retrieving your ticket information.</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Not Found</h2>
                <p className="text-slate-500 mb-6">We could not retrieve this booking. Please contact support.</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-slate-900 text-white rounded-lg">Try Again</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className={`${mode === 'view' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-green-500/10 border-green-500/20'} p-8 text-center border-b`}>
                    <div className={`w-16 h-16 ${mode === 'view' ? 'bg-blue-500 shadow-blue-500/30' : 'bg-green-500 shadow-green-500/30'} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        {mode === 'view' ? <QrCode className="w-8 h-8 text-white" /> : <CheckCircle className="w-8 h-8 text-white" />}
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {mode === 'view' ? 'Booking Ticket' : 'Payment Successful!'}
                    </h1>
                    <p className={`${mode === 'view' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'} font-medium mt-1`}>
                        {mode === 'view' ? 'Scan at Lab Reception' : 'Transaction Completed'}
                    </p>
                    <p className="text-slate-500 text-sm mt-2">Booking ID: {bookingId}</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* QR Code Section */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative group cursor-pointer">
                            {/* Stored QR Code */}
                            {order?.qrCode ? (
                                <img
                                    src={order.qrCode}
                                    alt="Booking QR Code"
                                    className="w-48 h-48 object-contain"
                                />
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed text-slate-400 text-xs text-center p-4">
                                    QR Code not generated yet. Please wait or refresh.
                                </div>
                            )}
                            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                <QrCode className="w-8 h-8 text-slate-900 mb-1" />
                                <span className="text-xs font-bold text-slate-900">Click to Enlarge</span>
                            </div>
                        </div>
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 max-w-xs">
                            Show this QR code at the lab reception to redeem your test.
                        </p>
                    </div>

                    {/* Validity Info */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Valid Until</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-sm">{expiryString}</p>
                                <p className="text-xs text-slate-400 mt-1">Valid for 30 days from purchase</p>
                                <div className="mt-2 text-xs text-slate-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                                    Format: 30 Days Validity
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Non-Refundable</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                                    If not used within 30 days, this booking will expire. No refunds will be issued for expired bookings.
                                </p>
                            </div>
                        </div>

                        {/* Reminder Schedule Info (Visual only) */}
                        <div className="flex items-start gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Reminder Schedule</h3>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] font-bold px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">20 Days</span>
                                    <span className="text-[10px] font-bold px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">24 Days</span>
                                    <span className="text-[10px] font-bold px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">28 Days (Final)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link href="/patient/dashboard" className="block w-full text-center py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 transition-colors">
                            Go to Dashboard
                        </Link>
                        <Link href="/" className="block w-full text-center py-3 text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center dark:text-white">Loading Booking...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
