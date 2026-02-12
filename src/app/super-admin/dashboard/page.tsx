'use client';

import { useState, useEffect } from 'react';
import { Users, Building2, CreditCard, Shield, Plus, Edit, Trash2, Eye, Activity, Search, Filter, Key, Lock, Unlock, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DashboardStats {
    totalUsers: number;
    totalAdmins: number;
    totalPatients: number;
    totalLabAdmins: number;
    totalBookings: number;
    totalRevenue: number;
}

interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    encryptedData?: string;
    createdAt: Date;
    lastLogin: Date;
}

interface Patient {
    id: string;
    name: string;
    email: string;
    phone?: string;
    walletBalance: number;
    totalBookings: number;
    encryptedData?: string;
    createdAt: Date;
}


interface Booking {
    id: string;
    user: string;
    email: string;
    date: Date;
    amount: number;
    status: string;
    paymentStatus: string;
    items: string;
}

interface ContactInquiry {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
}

export default function SuperAdminDashboard() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'overview' | 'admins' | 'patients' | 'inquiries' | 'bookings'>('overview');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [decryptedData, setDecryptedData] = useState<Record<string, string>>({});
    const [decrypting, setDecrypting] = useState<string | null>(null);

    const isSuperAdmin = (session?.user as any)?.role === 'super_admin';

    // Fetch dashboard data
    useEffect(() => {
        if (isSuperAdmin) {
            fetchStats();
            if (activeTab === 'admins') fetchAdmins();
            if (activeTab === 'patients') fetchPatients();
            if (activeTab === 'inquiries') fetchInquiries();
            if (activeTab === 'bookings') fetchBookings();
        }
    }, [isSuperAdmin, activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/super-admin/dashboard?type=stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/super-admin/dashboard?type=admins');
            if (res.ok) {
                const data = await res.json();
                setAdmins(data);
            }
        } catch (error) {
            console.error('Failed to fetch admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/super-admin/dashboard?type=patients');
            if (res.ok) {
                const data = await res.json();
                setPatients(data.patients || []);
            }
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/super-admin/inquiries');
            if (res.ok) {
                const data = await res.json();
                setInquiries(data);
            }
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/super-admin/bookings');
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecrypt = async (userId: string, encryptedData: string) => {
        if (!encryptedData) {
            toast.error('No encrypted data available');
            return;
        }

        try {
            setDecrypting(userId);
            const res = await fetch('/api/super-admin/decrypt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedData })
            });

            if (res.ok) {
                const data = await res.json();
                setDecryptedData(prev => ({ ...prev, [userId]: data.decryptedData }));
                toast.success('Credentials decrypted successfully');
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to decrypt');
            }
        } catch (error) {
            console.error('Decryption error:', error);
            toast.error('Failed to decrypt credentials');
        } finally {
            setDecrypting(null);
        }
    };

    const hideDecrypted = (userId: string) => {
        setDecryptedData(prev => {
            const newData = { ...prev };
            delete newData[userId];
            return newData;
        });
    };

    if (!isSuperAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-slate-600 dark:text-slate-400">Super Admin privileges required</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-8 h-8 text-blue-500" />
                        Super Admin Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Complete control over platform operations and user data
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-800">
                {[
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'admins', label: 'Admin Management', icon: Shield },
                    { id: 'patients', label: 'Patient Management', icon: Users },
                    { id: 'bookings', label: 'Bookings', icon: CreditCard },
                    { id: 'inquiries', label: 'Inquiries', icon: MessageCircle }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === tab.id
                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
                                { label: 'Total Admins', value: stats?.totalAdmins || 0, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
                                { label: 'Total Patients', value: stats?.totalPatients || 0, icon: Users, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
                                { label: 'Total Revenue', value: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(1)}k`, icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
                            ].map((stat, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center hover:shadow-md transition-shadow">
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
                    </div>
                )}

                {activeTab === 'admins' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Administrators</h3>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search admins..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Admin Name</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Role</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Phone</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Created</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {admins.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((admin) => (
                                            <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-white">{admin.name}</div>
                                                        <div className="text-sm text-slate-500">{admin.email}</div>
                                                        {decryptedData[admin.id] && (
                                                            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                                                                <div className="flex items-center gap-2 text-xs font-mono text-yellow-800 dark:text-yellow-300">
                                                                    <Unlock className="w-3 h-3" />
                                                                    Decrypted: {decryptedData[admin.id]}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                        {admin.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{admin.phone || 'N/A'}</td>
                                                <td className="p-4 text-sm text-slate-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {admin.encryptedData && !decryptedData[admin.id] && (
                                                            <button
                                                                onClick={() => handleDecrypt(admin.id, admin.encryptedData!)}
                                                                disabled={decrypting === admin.id}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors text-xs font-medium disabled:opacity-50"
                                                                title="Decrypt Credentials"
                                                            >
                                                                {decrypting === admin.id ? (
                                                                    <>
                                                                        <div className="w-3 h-3 border-2 border-yellow-700 border-t-transparent rounded-full animate-spin" />
                                                                        Decrypting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Key className="w-3 h-3" />
                                                                        Decrypt
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                        {decryptedData[admin.id] && (
                                                            <button
                                                                onClick={() => hideDecrypted(admin.id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs font-medium"
                                                                title="Hide Decrypted Data"
                                                            >
                                                                <Lock className="w-3 h-3" />
                                                                Hide
                                                            </button>
                                                        )}
                                                        <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Patient Database</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Patient Name</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Contact</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Wallet</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Bookings</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {patients.map((patient) => (
                                            <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-white">{patient.name}</div>
                                                        <div className="text-sm text-slate-500">{patient.email}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{patient.phone || 'N/A'}</td>
                                                <td className="p-4 text-sm font-semibold text-green-600 dark:text-green-400">₹{patient.walletBalance}</td>
                                                <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{patient.totalBookings}</td>
                                                <td className="p-4 text-right">
                                                    <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'inquiries' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact Inquiries</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Date</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Name</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Subject</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Message</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {inquiries.length > 0 ? (
                                            inquiries.map((inquiry) => (
                                                <tr key={inquiry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white">{inquiry.name}</div>
                                                            <div className="text-sm text-slate-500">{inquiry.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                                        {inquiry.subject}
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" title={inquiry.message}>
                                                        {inquiry.message}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center w-fit gap-1 ${inquiry.status === 'new'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            }`}>
                                                            {inquiry.status === 'new' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                                            {inquiry.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                                    No inquiries found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Bookings (All Time)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Order ID</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">User</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Items</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                            <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {bookings.length > 0 ? (
                                            bookings.map((booking) => (
                                                <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="p-4 text-sm font-mono text-slate-500">
                                                        #{booking.id.slice(-6).toUpperCase()}
                                                    </td>
                                                    <td className="p-4">
                                                        <div>
                                                            <div className="font-semibold text-slate-900 dark:text-white">{booking.user}</div>
                                                            <div className="text-sm text-slate-500">{booking.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" title={booking.items}>
                                                        {booking.items}
                                                    </td>
                                                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                                                        {booking.amount}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col gap-1">
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase w-fit ${booking.status === 'confirmed' || booking.status === 'completed'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                            <span className="text-xs text-slate-400 capitalize">{booking.paymentStatus}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right text-sm text-slate-500">
                                                        {new Date(booking.date).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                                    No bookings found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
