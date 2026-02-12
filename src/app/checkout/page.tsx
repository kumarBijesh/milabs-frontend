"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { trendingDeals } from '@/lib/constants';
import { useState, Suspense, useEffect } from 'react';
import { CreditCard, Wallet, Lock, ShieldCheck } from 'lucide-react';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const dealId = searchParams.get('dealId');
    const { currency, isAuthenticated } = useUserStore();
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe');
    const [isProcessing, setIsProcessing] = useState(false);

    // Find the deal
    const deal = trendingDeals.find(d => d.id === Number(dealId));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!deal) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <p className="text-slate-500">Deal not found or invalid ID.</p>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        if (!mounted) return `$${price}`; // Prevent hydration mismatch
        if (currency === 'INR') {
            return `₹${(price * 83).toLocaleString()}`;
        }
        return `$${price}`;
    };

    const router = useRouter(); // Initialize router

    // ... (existing code)

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // 1. Create Order in our DB first (Pending status)
            const bookingResponse = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labId: deal.labId || 'default-lab-id',
                    items: [{
                        testId: deal.id.toString(),
                        quantity: 1,
                        price: deal.dealPrice
                    }],
                    totalAmount: currency === 'INR' ? deal.dealPrice * 83 : deal.dealPrice,
                    bookingDate: new Date().toISOString(),
                }),
            });

            const dbOrder = await bookingResponse.json();
            if (!bookingResponse.ok) throw new Error(dbOrder.error || 'Failed to create booking');

            if (paymentMethod === 'stripe') {
                // Stripe Simulation
                setTimeout(() => {
                    setIsProcessing(false);
                    router.push(`/booking/confirmation?id=${dbOrder.id}&dealId=${deal.id}`);
                }, 2000);
                return;
            }

            // 2. Create Razorpay Order
            const rpResponse = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: currency === 'INR' ? deal.dealPrice * 83 : deal.dealPrice }),
            });

            const rpOrder = await rpResponse.json();

            // 3. Open Razorpay Popup
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: rpOrder.amount,
                currency: rpOrder.currency,
                name: 'MiLabs',
                description: deal.title,
                order_id: rpOrder.id,
                handler: async function (response: any) {
                    // 4. Verify Payment & Generate QR Code
                    const verifyRes = await fetch(`/api/bookings/${dbOrder.id}/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentId: response.razorpay_payment_id }),
                    });

                    if (verifyRes.ok) {
                        router.push(`/booking/confirmation?id=${dbOrder.id}&dealId=${deal.id}&paymentId=${response.razorpay_payment_id}`);
                    } else {
                        alert('Payment recorded but verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: 'User',
                    email: 'user@example.com',
                },
                theme: {
                    color: '#2563eb',
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert('Payment Failed: ' + response.error.description);
            });
            rzp.open();
        } catch (error: any) {
            console.error('Payment Error:', error);
            alert(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-green-500" />
                            Secure Checkout
                        </h2>

                        {/* 1. User Info (Mock) */}
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">1. Contact Information</h3>
                            {isAuthenticated ? (
                                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                                        ME
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Logged in User</p>
                                        <p className="text-xs text-slate-500">user@example.com</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="email" placeholder="Email Address" className="col-span-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-full outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            )}
                        </div>

                        {/* 2. Payment Method */}
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">2. Payment Method</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="stripe"
                                            checked={paymentMethod === 'stripe'}
                                            onChange={() => setPaymentMethod('stripe')}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                            <span className="font-medium text-slate-900 dark:text-white">Pay with Card (Stripe)</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                        <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                    </div>
                                </label>

                                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="razorpay"
                                            checked={paymentMethod === 'razorpay'}
                                            onChange={() => setPaymentMethod('razorpay')}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Wallet className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                            <span className="font-medium text-slate-900 dark:text-white">UPI / NetBanking (Razorpay)</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing ? 'Processing...' : `Pay ${formatPrice(deal.dealPrice)}`}
                    </button>

                    <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Payments are SSL encrypted and secured.
                    </p>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>

                        <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${deal.image})` }}></div>
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2">{deal.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{deal.labName}</p>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span>{formatPrice(deal.originalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-{formatPrice(deal.originalPrice - deal.dealPrice)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Service Fee</span>
                                <span>{formatPrice(0)}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="font-bold text-slate-900 dark:text-white">Total</span>
                            <span className="font-bold text-xl text-slate-900 dark:text-white">{formatPrice(deal.dealPrice)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
