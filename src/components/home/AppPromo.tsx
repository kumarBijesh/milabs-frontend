import Link from 'next/link';
import { Smartphone, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AppPromo() {
    return (
        <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-20 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/30 border border-blue-400/30 text-white text-sm font-medium mb-6">
                        <Smartphone className="w-4 h-4 mr-2" /> Mobile App Coming Soon
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Healthcare in your pocket.
                    </h2>
                    <p className="text-lg text-blue-100 mb-8 max-w-lg">
                        Download the MiLabs app to book tests, track your health trends, and access your reports anytime, anywhere.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 border-none shadow-xl">
                            <Download className="mr-2 w-5 h-5" /> Download for iOS
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
                            <Download className="mr-2 w-5 h-5" /> Download for Android
                        </Button>
                    </div>
                </div>

                <div className="md:w-1/2 flex justify-center md:justify-end">
                    {/* Mock Phone UI */}
                    <div className="relative w-72 h-[550px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-8 border-slate-800 rotate-3 transform hover:rotate-0 transition-transform duration-500">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                        <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col pt-10 px-4 pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-2 w-20 bg-slate-200 rounded"></div>
                                <div className="h-8 w-8 bg-blue-100 rounded-full"></div>
                            </div>
                            <div className="h-32 w-full bg-blue-50 rounded-xl mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-16 w-full bg-slate-50 rounded-xl"></div>
                                <div className="h-16 w-full bg-slate-50 rounded-xl"></div>
                                <div className="h-16 w-full bg-slate-50 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
