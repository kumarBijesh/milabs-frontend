'use client';

import { useState } from 'react';
import { Search, Plus, MoreVertical, FlaskConical, MapPin, CheckCircle, XCircle, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

const INITIAL_LABS = [
    { id: 1, name: 'City Health Labs', location: 'New York, NY', revenue: '$12,500', status: 'Active', verified: true },
    { id: 2, name: 'Wellness Diagnostics', location: 'Brooklyn, NY', revenue: '$8,200', status: 'Active', verified: true },
    { id: 3, name: 'Rapid Test Center', location: 'Queens, NY', revenue: '$3,100', status: 'Pending', verified: false },
    { id: 4, name: 'BioGen Genetics', location: 'Manhattan, NY', revenue: '$45,000', status: 'Active', verified: true },
    { id: 5, name: 'Community Care Lab', location: 'Bronx, NY', revenue: '$1,200', status: 'Suspended', verified: true },
];

export default function ManageLabs() {
    const [labs, setLabs] = useState(INITIAL_LABS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [newLab, setNewLab] = useState({ name: '', location: '' });

    const filteredLabs = labs.filter(lab => {
        const matchesSearch = lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lab.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || lab.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this lab? This permanently removes them from the platform.')) {
            setLabs(prev => prev.filter(l => l.id !== id));
            toast.success('Lab deleted successfully');
        }
    };

    const handleVerify = (id: number, status: 'Active' | 'Rejected') => {
        setLabs(prev => prev.map(lab =>
            lab.id === id
                ? { ...lab, status: status === 'Active' ? 'Active' : 'Suspended', verified: status === 'Active' }
                : lab
        ));
        toast.success(status === 'Active' ? 'Lab approved and verified!' : 'Lab rejected.');
    };

    const handleAddLab = (e: React.FormEvent) => {
        e.preventDefault();
        const id = Math.max(...labs.map(l => l.id)) + 1;
        const lab = {
            id,
            ...newLab,
            revenue: '$0',
            status: 'Pending',
            verified: false
        };
        setLabs([lab, ...labs]);
        setIsAddModalOpen(false);
        setNewLab({ name: '', location: '' });
        toast.success('Lab added successfully. Pending verification.');
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Labs</h1>
                    <p className="text-slate-500 text-sm">Oversee onboarded laboratories and approval requests.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Onboard New Lab
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex-1">
                    <Input
                        placeholder="Search labs by name or location..."
                        icon={Search}
                        className="bg-slate-50 border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'active', 'pending', 'suspended'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-colors border ${filterStatus === status
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {status}
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
                                <th className="p-4 text-sm font-semibold text-slate-500">Lab Name</th>
                                <th className="p-4 text-sm font-semibold text-slate-500">Location</th>
                                <th className="p-4 text-sm font-semibold text-slate-500">Total Revenue</th>
                                <th className="p-4 text-sm font-semibold text-slate-500">Verification</th>
                                <th className="p-4 text-sm font-semibold text-slate-500">Status</th>
                                <th className="p-4 text-sm font-semibold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredLabs.map((lab) => (
                                <tr key={lab.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mr-3">
                                                <FlaskConical className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">{lab.name}</p>
                                                <p className="text-xs text-slate-500">ID: LAB-{lab.id.toString().padStart(3, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {lab.location}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">{lab.revenue}</td>
                                    <td className="p-4">
                                        {lab.verified ? (
                                            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full w-fit">
                                                <XCircle className="w-3 h-3 mr-1" /> Unverified
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${lab.status === 'Active'
                                            ? 'bg-green-100 text-green-700'
                                            : lab.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {lab.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!lab.verified && (
                                                <button
                                                    onClick={() => handleVerify(lab.id, 'Active')}
                                                    className="text-green-500 hover:text-green-700 p-1 rounded-md hover:bg-green-50"
                                                    title="Approve & Verify"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(lab.id)}
                                                className="text-slate-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                title="Delete Lab"
                                            >
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

            {/* Add Lab Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Onboard New Lab</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddLab} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lab Name</label>
                                <Input required placeholder="e.g. Health Plus Diagnostics" value={newLab.name} onChange={e => setNewLab({ ...newLab, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location (City, State)</label>
                                <Input required placeholder="e.g. Seattle, WA" value={newLab.location} onChange={e => setNewLab({ ...newLab, location: e.target.value })} />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1">Add Lab</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
