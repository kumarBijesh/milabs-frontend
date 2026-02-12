'use client';

import { Activity, Clock, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

import useSWR from 'swr';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Mock data imports - in real app, fetch from API
import MOCK_HEALTH_DATA from '@/lib/mockHealthData.json';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PatientDashboard() {
    const { user } = useAuth();
    const { data: bookingsData, error, isLoading } = useSWR('/api/bookings', fetcher);

    // Ensure bookings is an array, otherwise default to empty
    const recentBookings = Array.isArray(bookingsData) ? bookingsData.slice(0, 3) : [];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Hello, {user?.name || 'User'}!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Here's an overview of your health journey.
                    </p>
                </div>
                <Link href="/deals">
                    <Button className="mt-4 md:mt-0">
                        Book New Test
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Pending Reports', value: (Array.isArray(bookingsData) ? bookingsData : []).filter((b: any) => b.status === 'pending').length.toString() || '0', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
                    { label: 'Completed Tests', value: (Array.isArray(bookingsData) ? bookingsData : []).filter((b: any) => b.status === 'completed').length.toString() || '0', icon: FileCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Health Score', value: '88/100', icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                    { label: 'Insured', value: 'Active', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} mr-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Bookings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Bookings</h2>
                        <Link href="/patient/bookings" className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[200px]">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-48">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : recentBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                                <p>No recent bookings found.</p>
                                <Link href="/deals" className="text-blue-600 hover:text-blue-500 text-sm font-medium mt-2">
                                    Book a test now
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Test Name</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Lab</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Total</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {recentBookings.map((booking: any) => (
                                            <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                    {booking.items?.[0]?.test?.name || booking.items?.[0]?.package?.name || 'Lab Test'}
                                                    {booking.items?.length > 1 && <span className="text-xs text-slate-500 ml-1">+{booking.items.length - 1} more</span>}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{booking.lab?.name || 'Unknown Lab'}</td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                    {new Date(booking.bookingDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 font-medium">₹{booking.totalAmount}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${booking.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href={`/patient/bookings/${booking.id}`} className="text-blue-600 hover:text-blue-500 font-medium text-xs">
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Health Trends Summary */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Health Trends</h2>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-6">
                        {MOCK_HEALTH_DATA.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                                <div className="flex items-center">
                                    <Activity className={`w-5 h-5 mr-3 ${item.status === 'warning' ? 'text-red-500' : item.status === 'low' ? 'text-yellow-500' : 'text-green-500'}`} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.date}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">{item.value}</span>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full text-xs">View Full Health Profile</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
