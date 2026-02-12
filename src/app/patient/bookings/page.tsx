'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
// import MOCK_BOOKINGS from '@/lib/mockBookings.json'; // Removed mock
import { useState } from 'react';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';
import { toast } from 'sonner';
import Link from 'next/link';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BookingsPage() {
    const { data: bookingsData, error, isLoading, mutate } = useSWR('/api/bookings', fetcher);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    // Filter or sort bookings if needed
    const bookings = Array.isArray(bookingsData) ? bookingsData : [];

    const handlePayment = async (bookingId: string, amount: number) => {
        setIsProcessing(bookingId);
        try {
            // 1. Create order
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const order = await response.json();

            // 2. Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID', // Replace with your actual key
                amount: order.amount,
                currency: order.currency,
                name: 'MiLabs',
                description: 'Lab Test Booking Payment',
                order_id: order.id,
                handler: function (response: any) {
                    // 3. Handle success
                    toast.success('Payment Successful!', {
                        description: `Payment ID: ${response.razorpay_payment_id}`,
                    });

                    // Update local state to reflect payment
                    // Update SWR cache
                    mutate();
                    /*
                    setBookings((prev) =>
                        prev.map((b) =>
                            b.id === bookingId ? { ...b, status: 'Confirmed' } : b
                        )
                    );
                    */
                },
                prefill: {
                    name: 'John Doe', // In a real app, get this from auth context
                    email: 'john@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error('Payment Failed', {
                    description: response.error.description,
                });
            });

            rzp1.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Something went wrong', {
                description: 'Could not initiate payment. Please try again.',
            });
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
                    <Button size="sm">New Booking</Button>
                </div>

                <div className="grid gap-6">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            No bookings found.
                        </div>
                    ) : (
                        bookings.map((booking: any) => (
                            <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
                                <div className="space-y-2 mb-4 md:mb-0">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider
                                        ${booking.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-gray-100 text-gray-700'}`}>
                                            {booking.status}
                                        </span>
                                        <span className="text-slate-400 text-xs">ID: #{booking.id.substring(0, 8)}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {booking.items?.[0]?.test?.name || booking.items?.[0]?.package?.name || 'Lab Test'}
                                        {booking.items?.length > 1 && <span className="text-sm font-normal text-slate-500 ml-2">+{booking.items.length - 1} others</span>}
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 dark:text-slate-400 space-y-1 sm:space-y-0 sm:space-x-4">
                                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {booking.lab?.name || 'Lab Name'}</span>
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {booking.slotTime || '10:00 AM'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end space-y-2 w-full md:w-auto">
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">₹{booking.totalAmount}</span>
                                    <div className="flex space-x-2 w-full md:w-auto">
                                        {booking.status === 'pending' && booking.paymentStatus !== 'paid' ? (
                                            <Button
                                                size="sm"
                                                className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
                                                onClick={() => handlePayment(booking.id, booking.totalAmount)}
                                                isLoading={isProcessing === booking.id}
                                            >
                                                Pay Now
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" className="flex-1 md:flex-none">Reschedule</Button>
                                        )}

                                        {booking.status === 'completed' ? (
                                            <Button size="sm" className="flex-1 md:flex-none">View Report</Button>
                                        ) : booking.status !== 'pending' ? (
                                            <Link href={`/booking/confirmation?id=${booking.id}&mode=view`} className="flex-1 md:flex-none">
                                                <Button size="sm" className="w-full">View Ticket</Button>
                                            </Link>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
