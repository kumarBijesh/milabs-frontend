'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { Building2, PieChart, FlaskConical, Bell, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PartnerPortalPage() {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Lab Partner Portal"
                    description="Professional tools to manage your diagnostic center and grow your business."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {/* Stat Card */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                                <PieChart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Business Overview</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Total Bookings</span>
                                <span className="font-bold text-slate-900 dark:text-white">1,248</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Recent Growth</span>
                                <span className="font-bold text-green-500">+12.5%</span>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-8">View Reports</Button>
                    </div>

                    {/* Manage Tests */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600">
                                <FlaskConical className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Test Inventory</h3>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">
                            Manage your test catalog, update pricing, and set TAT (Turnaround Time) for each test.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Manage Tests</Button>
                    </div>

                    {/* Active Orders */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 animate-pulse">
                            <Bell className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">12 Pending Orders</h3>
                        <p className="text-slate-500 text-sm mb-8">You have new test requests waiting for processing.</p>
                        <Link href="/lab/dashboard" className="w-full">
                            <Button className="w-full">Open Lab Dashboard</Button>
                        </Link>
                    </div>
                </div>

                {/* Dashboard Shortcut */}
                <div className="mt-12 p-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Complete Your Profile</h2>
                            <p className="text-blue-100 opacity-90">
                                Make sure your lab's address, contact, and certifications are up to date to receive more bookings.
                            </p>
                        </div>
                        <Link href="/lab/dashboard/settings">
                            <Button variant="secondary" className="px-10 py-4 shadow-xl">
                                Go to Settings
                                <Settings className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
