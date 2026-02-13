'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { ShieldCheck, UserPlus, Trash2, Edit2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types
interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    lab: { name: string } | null;
    createdAt: string;
}

const ROLES = [
    { value: 'super_admin', label: 'Super Admin', description: 'Full system access' },
    { value: 'admin', label: 'Admin', description: 'Can manage most settings' },
    { value: 'viewer_admin', label: 'Viewer Admin', description: 'Read-only access' },
    { value: 'lab_admin', label: 'Lab Admin', description: 'Manages specific lab' },
    { value: 'marketing_admin', label: 'Marketing Admin', description: 'Manages campaigns' },
    { value: 'support_admin', label: 'Support Admin', description: 'Handles tickets' },
];

export default function AdminManagement() {
    const [isCreating, setIsCreating] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch Staff (SWR or useEffect)
    // For simplicity, let's assume we fetch on mount
    const [staff, setStaff] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Logic
    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/staff');
            if (res.ok) {
                const data = await res.json();
                setStaff(data);
            }
        } catch (error) {
            console.error('Failed to fetch staff');
        } finally {
            setIsLoading(false);
        }
    };

    // Use Effect to load initial data
    useState(() => {
        fetchStaff();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            setIsCreating(true);
            const res = await fetch('/api/admin/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create admin');
            }

            toast.success('Admin user created successfully');
            reset();
            fetchStaff(); // Refresh list
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this admin?')) return;

        try {
            const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Admin deleted');
                fetchStaff();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage roles and permissions for your team.</p>
                </div>
            </div>

            {/* Creation Form */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-500" />
                    Create New Admin
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Admin Name"
                            />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                            <input
                                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="admin@example.com"
                            />
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="******"
                            />
                            {errors.password && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                            <select
                                {...register('role', { required: 'Role is required' })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Role</option>
                                {ROLES.map(role => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                            {errors.role && <span className="text-xs text-red-500">{errors.role.message as string}</span>}
                        </div>

                        {/* Optional Lab ID field if Lab Admin/Marketing need specific lab */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Lab ID (Optional - Required for Lab-Specific Admins)
                            </label>
                            <input
                                {...register('labId')}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Lab ID if applicable"
                            />
                            <p className="text-xs text-slate-500 mt-1">Leave empty for global admins (Super Admin, Support Admin).</p>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            Create Admin
                        </button>
                    </div>
                </form>
            </div>

            {/* Staff List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-lg font-bold">Existing Admins</h3>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-slate-500">Loading staff...</div>
                ) : staff.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No other admins found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Associated Lab</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {staff.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'lab_admin' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-slate-100 text-slate-800'}
                                            `}>
                                                {user.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {user.lab?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
