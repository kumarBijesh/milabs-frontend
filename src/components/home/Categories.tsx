import Link from 'next/link';
import { Pill, Activity, Stethoscope, Microscope, Brain, Heart, Eye } from 'lucide-react';

const CATEGORIES = [
    { name: 'Blood Test', icon: Microscope, href: '/labs?category=blood' },
    { name: 'Full Body', icon: Activity, href: '/labs?category=full-body' },
    { name: 'MRI Scan', icon: Brain, href: '/labs?category=mri' },
    { name: 'X-Ray', icon: Pill, href: '/labs?category=xray' },
    { name: 'Heart Check', icon: Heart, href: '/labs?category=heart' },
    { name: 'Eye Check', icon: Eye, href: '/labs?category=eye' },
    { name: 'Ultrasound', icon: Stethoscope, href: '/labs?category=ultrasound' },
    { name: 'Other', icon: Pill, href: '/labs' },
];

export default function Categories() {
    return (
        <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Browse by Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
                    {CATEGORIES.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:scale-110 mb-3">
                                <category.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
