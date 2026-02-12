
import { CheckCircle2, QrCode, Stethoscope, FileText } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            title: "Select a Deal",
            desc: "Browse huge savings on lab tests near you.",
            icon: CheckCircle2,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
        },
        {
            title: "Book & Pay",
            desc: "Securely pay online and receive your QR code instantly.",
            icon: QrCode,
            color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
        },
        {
            title: "Visit Lab",
            desc: "Show your code at the lab. No extra payments needed.",
            icon: Stethoscope,
            color: "text-green-600 bg-green-50 dark:bg-green-900/20"
        },
        {
            title: "Get Results",
            desc: "Receive your digital report directly from the lab.",
            icon: FileText,
            color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
        }
    ];

    return (
        <section className="py-16 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How MiLabs Works</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Simple, affordable, and transparent healthcare.</p>
                </div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] border-t-2 border-dashed border-slate-200 dark:border-slate-700 -z-10"></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${step.color}`}>
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 inline-block px-4 py-2 rounded-full">
                        Note: MiLabs does not store medical records. Reports are issued directly by the certified laboratory.
                    </p>
                </div>
            </div>
        </section>
    );
}
