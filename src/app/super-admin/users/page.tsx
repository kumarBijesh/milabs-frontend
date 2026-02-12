'use client';

import { useState } from 'react';
import { Search, UserPlus, MoreVertical, Shield, User, FlaskConical } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Mock Data
const MOCK_USERS = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'patient', date: '2024-03-01', status: 'Active' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@lab.com', role: 'lab_admin', date: '2024-02-15', status: 'Active' },
    { id: 3, name: 'Admin User', email: 'admin@milabs.com', role: 'admin', date: '2024-01-20', status: 'Active' },
    { id: 4, name: 'Jane Doe', email: 'jane@example.com', role: 'patient', date: '2024-03-05', status: 'Suspended' },
    { id: 5, name: 'Super Admin', email: 'super@milabs.com', role: 'super_admin', date: '2024-01-01', status: 'Active' },
];

export default function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const filteredUsers = MOCK_USERS.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin': return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center w-fit"><Shield className="w-3 h-3 mr-1" /> Super Admin</span>;
            case 'admin': return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center w-fit"><Shield className="w-3 h-3 mr-1" /> Admin</span>;
            case 'lab_admin': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center w-fit"><FlaskConical className="w-3 h-3 mr-1" /> Lab Admin</span>;
            default: return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center w-fit"><User className="w-3 h-3 mr-1" /> Patient</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-slate-500 text-sm">Manage all platform users and roles.</p>
                </div>
                <Button>
                    <UserPlus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex-1">
                    <Input
                        placeholder="Search users..."
                        icon={Search}
                        className="bg-slate-50 border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'patient', 'lab_admin', 'admin', 'super_admin'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors border ${filterRole === role
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {role.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-slate-500">Name</th>
                                <th className="p-4 text-sm font-semibold text-slate-500">Role</th>
                                <th className="p-4 text-sm font-semibold text-slate-500">Joined Date</th>
                                <th className="p-4 text-sm font-semibold text-slate-500">Status</th>
                                <th className="p-4 text-sm font-semibold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold mr-3">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{user.date}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${user.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No users found matching your filters.
                    </div>
                )}
            </div>
        </div>
    );
}
