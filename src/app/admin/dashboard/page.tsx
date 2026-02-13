'use client';

import { useState } from 'react';
import { Users, Building2, Calendar, CreditCard, Megaphone, TrendingUp, AlertCircle, MessageSquare, Activity, ShieldCheck, LayoutGrid } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import AdminManagement from '@/components/admin/AdminManagement';

const ADMIN_STATS = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Verified Labs', value: '56', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { label: 'Bookings Today', value: '142', icon: Calendar, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Revenue (Today)', value: '₹45,200', icon: CreditCard, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
];

const MARKETING_STATS = [
    { label: 'Active Campaigns', value: '12', icon: Megaphone, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/20' },
    { label: 'Total Leads', value: '8,432', icon: Users, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Ad Spend', value: '₹1.2L', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
];

const SUPPORT_STATS = [
    { label: 'Open Tickets', value: '24', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
    { label: 'Resolved Today', value: '45', icon: Activity, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Avg Response', value: '15m', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Satisfaction', value: '4.8/5', icon: Users, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
];

export default function AdminDashboardPage() {
    const { user } = useUserStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'team'>('overview');

    const role = user?.role || 'admin';
    const canManageTeam = ['super_admin', 'admin', 'lab_admin'].includes(role);

    const renderDashboard = () => {
        switch (role) {
            case 'marketing_admin':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Marketing Dashboard</h1>
                            <p className="text-slate-500 dark:text-slate-400">Track campaigns and user growth.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {MARKETING_STATS.map((stat, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
                                    <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mr-4`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Marketing Specific Content */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Recent Campaigns</h3>
                            <div className="space-y-4">
                                {['New Year Promo', 'Summer Body Checks', 'Corporate Wellness'].map((campaign, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{campaign}</span>
                                        <span className="text-sm text-green-500 font-bold bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">Active</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'support_admin':
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support Dashboard</h1>
                            <p className="text-slate-500 dark:text-slate-400">Manage user inquiries and tickets.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {SUPPORT_STATS.map((stat, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
                                    <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mr-4`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-lg font-bold mb-4">Recent Tickets</h3>
                            {/* Mock Tickets */}
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium">Issue with booking #{1000 + i}</p>
                                            <p className="text-xs text-slate-400">Reported by User {i}</p>
                                        </div>
                                        <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">View</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                // General Admin / Super Admin / Lab Admin Default View
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {activeTab === 'overview' ? 'Admin Dashboard' : 'Team Management'}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400">
                                    {activeTab === 'overview' ? 'Platform overview and management.' : 'Manage roles and permissions.'}
                                </p>
                            </div>

                            {/* Tab Toggle */}
                            {canManageTeam && (
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => setActiveTab('overview')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview'
                                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <LayoutGrid className="w-4 h-4" />
                                            Overview
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('team')}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'team'
                                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            Team
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content Switch */}
                        {activeTab === 'team' ? (
                            <AdminManagement />
                        ) : (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {ADMIN_STATS.map((stat, i) => (
                                        <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center">
                                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mr-4`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Recent Users */}
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <h3 className="text-lg font-bold mb-4">Recent Registrations</h3>
                                        <div className="space-y-4">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold mr-3">U{i}</div>
                                                        <div>
                                                            <p className="text-sm font-medium">User {i}</p>
                                                            <p className="text-xs text-slate-400">user{i}@example.com</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-slate-400">2 min ago</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pending Lab Approvals */}
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <h3 className="text-lg font-bold mb-4">Pending Lab Approvals</h3>
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg mr-3 shadow-sm">🏥</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">New Lab {i}</p>
                                                            <p className="text-xs text-slate-500">License: #LICENSE-{i}928</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors">Approve</button>
                                                        <button className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">Reject</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
        }
    };

    return renderDashboard();
}
