import Link from 'next/link';
import { ArrowRight, Activity, ShieldCheck, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-16 pb-32 lg:pt-32 lg:pb-40">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-ping" />
                    The Future of Healthcare Marketplace
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white animate-fade-in-up delay-100">
                    Your Health, <br className="hidden md:block" />
                    <span className="text-blue-600 dark:text-blue-400">Decentralized & Simplified.</span>
                </h1>

                <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-200">
                    Compare prices, book lab tests instantly, and manage your medical records securely.
                    Join thousands of patients taking control of their health data.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up delay-300">
                    <Link href="/deals">
                        <Button size="lg" className="rounded-full shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40">
                            Find Tests Near Me <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/how-it-works">
                        <Button variant="outline" size="lg" className="rounded-full border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            How it works
                        </Button>
                    </Link>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left animate-fade-in-up delay-500">
                    {[
                        {
                            icon: Activity,
                            title: "Instant Booking",
                            desc: "Book appointments in seconds with real-time availability."
                        },
                        {
                            icon: ShieldCheck,
                            title: "Secure Records",
                            desc: "Your medical data is encrypted and only accessible by you."
                        },
                        {
                            icon: Clock,
                            title: "Fast Reports",
                            desc: "Get digital reports delivered to your dashboard instantly."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
