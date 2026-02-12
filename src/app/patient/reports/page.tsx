'use client';

import { FileText, Download, Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';

import useSWR from 'swr';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ReportsPage() {
    const { data: bookings, isLoading } = useSWR('/api/bookings?status=completed', fetcher);
    const reports = Array.isArray(bookings) ? bookings : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Reports</h1>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Filter</Button>
                    <Button size="sm">Compare Trends</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Referral</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center">
                                        <div className="flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
                                    </td>
                                </tr>
                            ) : reports?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-slate-500">
                                        No reports available.
                                    </td>
                                </tr>
                            ) : (
                                reports?.map((report: any) => (
                                    <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {report.items?.[0]?.test?.name || report.items?.[0]?.package?.name || 'Lab Report'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{report.lab?.name || 'Lab'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {new Date(report.bookingDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold mr-2">
                                                    L
                                                </div>
                                                {report.lab?.name || 'Lab'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                                onClick={() => toast.info('Downloading report...')}
                                            >
                                                <Download className="h-4 w-4 mr-1" /> PDF
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
