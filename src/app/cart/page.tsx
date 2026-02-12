"use client";

import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeFromCart, totalPrice, clearCart } = useCartStore();
    const { currency, setCurrency, isAuthenticated, user } = useUserStore();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatPrice = (price: number) => {
        if (!mounted) return `$${price}`;
        if (currency === 'INR') {
            return `₹${Math.round(price * 83).toLocaleString()}`;
        }
        return `$${price}`;
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!isAuthenticated) {
            toast.error('Please log in to proceed with payment');
            router.push('/auth/login?callbackUrl=/cart');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Create Order on Backend
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: currency === 'INR' ? Math.round(totalPrice() * 83) : totalPrice(),
                    currency: currency,
                    gateway: currency === 'INR' ? 'razorpay' : 'stripe',
                    items: items
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to initiate payment');

            // 2. Handle Gateway Specific Flow
            if (data.gateway === 'razorpay') {
                const isLoaded = await loadRazorpay();
                if (!isLoaded) {
                    toast.error('Razorpay SDK failed to load');
                    setIsLoading(false);
                    return;
                }

                const options = {
                    key: data.key,
                    amount: data.amount,
                    currency: data.currency,
                    name: 'MiLabs Health',
                    description: 'Lab Test Booking',
                    order_id: data.orderId,
                    handler: async function (response: any) {
                        // Verify Payment
                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                                dbOrderId: data.dbOrderId,
                                gateway: 'razorpay'
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            clearCart();
                            toast.success('Payment Successful!');
                            router.push('/patient/bookings');
                        } else {
                            toast.error('Payment Verification Failed');
                        }
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.email,
                    },
                    theme: {
                        color: '#2563eb',
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
                setIsLoading(false); // Modal is open, so stop loading state
            }
            else if (data.gateway === 'stripe') {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Something went wrong');
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-slate-100 dark:border-slate-800">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Looks like you haven't added any tests or packages yet.
                    </p>
                    <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors w-full">
                        Browse Tests
                    </Link>
                </div>
            </div>
        );
    }

    const total = totalPrice();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    Your Cart ({items.length} items)
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 transition-all hover:shadow-md">
                                <div className="relative w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                                            <span className="font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap ml-2">
                                                {formatPrice(item.price)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.labName}</p>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="text-xs text-slate-400">
                                            Qty: {item.quantity}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary & Payment */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h3>

                            {/* Currency Toggle */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg mb-6">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Currency</span>
                                <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setCurrency('USD')}
                                        className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${currency === 'USD' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
                                    >
                                        $ USD
                                    </button>
                                    <button
                                        onClick={() => setCurrency('INR')}
                                        className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${currency === 'INR' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
                                    >
                                        ₹ INR
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Service Fee</span>
                                    <span>{formatPrice(0)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-900 dark:text-white text-base pt-2">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isLoading}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold text-base hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 mb-4"
                            >
                                {isLoading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        Pay with {currency === 'INR' ? 'Razorpay' : 'Stripe'} <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-green-500" />
                                Secure Checkout with {currency === 'INR' ? 'Razorpay' : 'Stripe'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
