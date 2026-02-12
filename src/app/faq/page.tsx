"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            category: "Appointments",
            question: "How do I book a lab test?",
            answer: "You can book a lab test by navigating to the 'Labs' or 'Deals' page, selecting a test package, and choosing a convenient time slot and location. You'll receive a confirmation email once booked."
        },
        {
            category: "Payments",
            question: "Do you accept insurance?",
            answer: "Yes, we partner with major insurance providers. You can add your insurance details during the checkout process. For specific coverage questions, please contact our support team."
        },
        {
            category: "Results",
            question: "How long does it take to get results?",
            answer: "Most routine test results are available within 24-48 hours. Specialized tests may take 3-5 business days. You will be notified via email and SMS as soon as your report is ready."
        },
        {
            category: "Appointments",
            question: "Can I cancel or reschedule my appointment?",
            answer: "Yes, you can cancel or reschedule up to 2 hours before your appointment time through your dashboard. Refunds for cancellations are processed within 5-7 business days."
        },
        {
            category: "General",
            question: "Is home sample collection avaliable?",
            answer: "Absolutely! We offer home sample collection for most tests at no extra cost in serviceable areas. Our phlebotomist will visit your home at the scheduled time."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Have questions? We're here to help.
                    </p>

                    <div className="mt-8 relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
                                >
                                    <span className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                        {faq.question}
                                    </span>
                                    <span className="ml-6 flex h-7 items-center">
                                        {openIndex === index ? (
                                            <ChevronUp className="h-5 w-5 text-blue-500" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-slate-400" />
                                        )}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-0 text-base leading-7 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 mt-2 pt-4">
                                                {faq.answer}
                                                <div className="mt-3">
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">
                                                        {faq.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            No matching questions found.
                        </div>
                    )}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        Can't find what you're looking for?{' '}
                        <a href="/contact" className="font-semibold text-blue-600 hover:text-blue-500">
                            Contact our support team
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
