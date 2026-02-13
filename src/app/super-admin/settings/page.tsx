'use client';

import { Save, Lock, Bell, Globe, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function PlatformSettings() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
                <p className="text-slate-500 text-sm">Configure global application settings and preferences.</p>
            </div>

            {/* General Settings */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">General Configuration</h2>
                        <p className="text-slate-500 text-xs">Basic site information and SEO details.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Platform Name</label>
                        <Input defaultValue="MiLabs Health" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Support Email</label>
                        <Input defaultValue="support@milabs.com" icon={Mail} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Maintenance Mode</label>
                        <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Put the entire platform in maintenance mode (only admins can login)</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Settings */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fees & Commissions</h2>
                        <p className="text-slate-500 text-xs">Manage platform fees and lab payouts.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Platform Commission (%)</label>
                        <Input defaultValue="10" type="number" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Minimum Payout ($)</label>
                        <Input defaultValue="500" type="number" />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notifications</h2>
                        <p className="text-slate-500 text-xs">Configure automated system emails.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {['New User Signup Alert', 'Lab Verification Request', 'Monthly Revenue Report', 'System Error Alerts'].map((item) => (
                        <div key={item} className="flex items-center justify-between">
                            <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button size="lg" className="w-full sm:w-auto">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
            </div>
        </div>
    );
}
