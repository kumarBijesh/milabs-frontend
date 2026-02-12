'use client';

import { categories } from '@/lib/constants';
import Link from 'next/link';
import {
    Sparkles, Ticket, Car, Utensils, Activity, MapPin, Plane, ShoppingBag, Tag,
    ChevronRight
} from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const IconMap: { [key: string]: any } = {
    Sparkles, Ticket, Car, Utensils, Activity, MapPin, Plane, ShoppingBag, Tag
};

export default function CategoriesPage() {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Browse Categories"
                    description="Explore deals across all our categories."
                />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const Icon = IconMap[category.icon] || Activity;
                        return (
                            <Link
                                key={category.name}
                                href={`/deals?category=${encodeURIComponent(category.name)}`}
                                className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center text-center"
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${category.highlight
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                                        : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900'
                                    }`}>
                                    <Icon className="w-8 h-8" />
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {category.name}
                                </h3>

                                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Deals <ChevronRight className="w-4 h-4" />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
