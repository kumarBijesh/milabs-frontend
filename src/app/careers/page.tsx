'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { Briefcase, Users, Heart, Rocket, Coffee, Globe } from 'lucide-react';

const coreValues = [
    {
        title: "Innovation First",
        description: "We constantly push boundaries in diagnostic technology to provide better healthcare solutions.",
        icon: Rocket,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
        title: "User Centric",
        description: "Everything we build starts with the patient's and lab's experience in mind.",
        icon: Heart,
        color: "text-red-500",
        bg: "bg-red-50 dark:bg-red-900/20"
    },
    {
        title: "Global Collaboration",
        description: "A diverse team working together across borders to redefine health-tech.",
        icon: Globe,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20"
    },
    {
        title: "Work-Life Balance",
        description: "We believe great work happens when you have the space to live a fulfilling life.",
        icon: Coffee,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/20"
    }
];

export default function CareersPage() {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                        Build the Future of <span className="text-blue-600">Healthcare</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Join Team MiLabs and help us transform how millions of people access diagnostic care.
                        We're building a platform that connects patients with the best labs through technology.
                    </p>
                </div>

                {/* Culture Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {coreValues.map((value, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${value.bg} ${value.color} mb-6`}>
                                <value.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Status Message */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-10 md:p-16 flex flex-col justify-center">
                            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-bold mb-6 w-fit">
                                <Briefcase className="w-4 h-4" />
                                <span>Current Status</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                                We're not currently hiring, but...
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                At MiLabs, we're always on the lookout for exceptional talent. While we don't have any open
                                positions at this moment, our journey is just beginning. We move fast and new opportunities
                                can pop up at any time.
                            </p>
                            <div className="space-y-4">
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    Interested in joining us in the future?
                                </p>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Keep an eye on this page and follow our social channels for updates. We'd love to have
                                    passionate people like you on our team when the time is right.
                                </p>
                            </div>
                            <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-700">
                                <p className="text-xl font-bold text-slate-900 dark:text-white italic">
                                    Stay tuned, Team MiLabs!
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700 relative hidden lg:block">
                            <img
                                src="https://images.unsplash.com/photo-1522071823991-b99c223a608e?auto=format&fit=crop&w=800&q=80"
                                alt="Team MiLabs Culture"
                                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 contrast-125"
                            />
                            <div className="absolute inset-0 bg-blue-600/20 mix-blend-multiply"></div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
