import { ArrowRight, FileText, Video, Book, Shield, Download } from 'lucide-react';

export default function ResourcesPage() {
    const resources = [
        {
            title: "Patient Guide: How to Prepare for Lab Tests",
            description: "A comprehensive guide on fasting requirements, what to bring, and what to expect during your visit.",
            type: "Guide",
            icon: Book,
            color: "text-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: "Understanding Your Lab Results",
            description: "Learn how to interpret common lab values like CBC, Lipid Panel, and Metabolic Panels.",
            type: "Video",
            icon: Video,
            color: "text-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            title: "Insurance & Billing FAQ",
            description: "Answers to common questions about insurance coverage, co-pays, and out-of-pocket costs.",
            type: "Article",
            icon: FileText,
            color: "text-green-500",
            bgColor: "bg-green-50 dark:bg-green-900/20"
        },
        {
            title: "Data Privacy & Security at MiLabs",
            description: "How we protect your sensitive health data using encryption and compliance standards.",
            type: "Whitepaper",
            icon: Shield,
            color: "text-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-900/20"
        }
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Resources Center</h2>
                    <p className="mt-2 text-lg leading-8 text-slate-600 dark:text-slate-400">
                        Helpful guides, articles, and tools to manage your health journey effectively.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    {resources.map((resource, index) => (
                        <div key={index} className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-md transition-shadow">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${resource.bgColor} mb-6`}>
                                <resource.icon className={`h-6 w-6 ${resource.color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-x-3 text-xs mb-3">
                                    <span className={`font-medium ${resource.color}`}>{resource.type}</span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-500">5 min read</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {resource.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    {resource.description}
                                </p>
                            </div>
                            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
                                <a href="#" className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors group">
                                    Access Resource <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-blue-600 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Download Our Mobile App</h3>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Get access to your reports, book appointments, and chat with support on the go. Available for iOS and Android.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-zinc-900 transition-colors">
                                <Download className="w-5 h-5" />
                                App Store
                            </button>
                            <button className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-zinc-900 transition-colors">
                                <Download className="w-5 h-5" />
                                Google Play
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
