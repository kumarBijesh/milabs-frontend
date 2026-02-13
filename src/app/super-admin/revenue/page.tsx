'use client';

import { TrendingUp, DollarSign, CreditCard, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SystemRevenue() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Revenue</h1>
                    <p className="text-slate-500 text-sm">Financial overview and commission reports.</p>
                </div>
                <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Total Revenue', value: '$124,500', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-green-600 bg-green-100' },
                    { title: 'Commission Earned', value: '$12,450', change: '+8.2%', trend: 'up', icon: TrendingUp, color: 'text-blue-600 bg-blue-100' },
                    { title: 'Pending Payouts', value: '$3,200', change: '-2.1%', trend: 'down', icon: CreditCard, color: 'text-orange-600 bg-orange-100' },
                    { title: 'Avg Order Value', value: '$85', change: '+4.3%', trend: 'up', icon: DollarSign, color: 'text-purple-600 bg-purple-100' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                                }`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Transaction ID</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Lab Name</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Date</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Amount</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Commission</th>
                                <th className="pb-3 text-sm font-semibold text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="py-4 font-mono text-slate-500">#TRX-{1000 + i}</td>
                                    <td className="py-4 font-medium text-slate-900 dark:text-white">City Health Labs</td>
                                    <td className="py-4 text-slate-500">Mar 1{i}, 2024</td>
                                    <td className="py-4 font-medium">$120.00</td>
                                    <td className="py-4 text-green-600 font-medium">+$12.00</td>
                                    <td className="py-4">
                                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">Completed</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
