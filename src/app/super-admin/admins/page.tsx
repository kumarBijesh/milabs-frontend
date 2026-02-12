'use client';

import { useState } from 'react';
import { UserPlus, Shield, XCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AdminsManagement() {
    const [inviteEmail, setInviteEmail] = useState('');

    // Mock List
    // Mock List
    const [admins] = useState([
        { id: 1, name: 'Main Admin', email: 'admin@milabs.com', role: 'Super Admin', status: 'Active' },
        { id: 2, name: 'Support Lead', email: 'support@milabs.com', role: 'Support Admin', status: 'Active' },
        { id: 3, name: 'Marketing Head', email: 'marketing@milabs.com', role: 'Marketing Admin', status: 'Active' },
        { id: 4, name: 'Lab Manager', email: 'lab_ops@milabs.com', role: 'Lab Admin', status: 'Pending Invite' },
    ]);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Management</h1>
                <p className="text-slate-500">Invite and manage platform administrators.</p>
            </div>

            {/* Invite Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
                    Invite New Admin
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Enter email address"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                        />
                    </div>
                    <div className="w-48">
                        <select className="flex h-11 w-full rounded-xl border border-slate-200 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="admin">General Admin</option>
                            <option value="lab_admin">Lab Admin</option>
                            <option value="marketing_admin">Marketing Admin</option>
                            <option value="support_admin">Support Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>
                    <Button>Send Invite</Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    Invited users will receive an email with instructions to set up their account.
                </p>
            </div>

            {/* Admin List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg">Active Administrators</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-500">User</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Role</th>
                            <th className="p-4 text-sm font-semibold text-slate-500">Status</th>
                            <th className="p-4 text-sm font-semibold text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold mr-3">
                                            {admin.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{admin.name}</p>
                                            <p className="text-xs text-slate-500">{admin.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                                        {admin.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${admin.status === 'Active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {admin.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button className="text-slate-400 hover:text-red-500 transition-colors" title="Revoke Access">
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                        <button className="text-slate-400 hover:text-green-500 transition-colors" title="Update Permissions">
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
