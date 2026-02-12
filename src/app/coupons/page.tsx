import { ArrowRight, Tag, Percent, Baby, ShieldCheck, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CouponsPage() {
    const coupons = [
        {
            id: 1,
            title: "Pediatric Checkup Special",
            description: "Complete health assessment for children under 12.",
            discount: "20% OFF",
            code: "KIDS20",
            validUntil: "March 31, 2026",
            icon: Baby,
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            id: 2,
            title: "Family Health Bundle",
            description: "Book tests for 3 or more family members and save big.",
            discount: "Flat ₹500 OFF",
            code: "FAMILY500",
            validUntil: "April 15, 2026",
            icon: ShieldCheck,
            color: "text-green-500",
            bg: "bg-green-100 dark:bg-green-900/20"
        },
        {
            id: 3,
            title: "Early Bird Offer",
            description: "Get extra discount on slots before 8 AM.",
            discount: "10% OFF",
            code: "EARLY10",
            validUntil: "Anytime",
            icon: Clock,
            color: "text-orange-500",
            bg: "bg-orange-100 dark:bg-orange-900/20"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Family Health Coupons
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Exclusive savings on pediatric and family care services. Use these coupons at checkout to get the best value for your health.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-800 p-6 flex flex-col relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${coupon.color}`}>
                                <coupon.icon size={100} />
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${coupon.bg} ${coupon.color}`}>
                                    <coupon.icon size={32} />
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Valid Until</div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-300">{coupon.validUntil}</div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{coupon.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{coupon.description}</p>

                            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between group-hover:border-blue-500/50 transition-colors">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase">Coupon Code</div>
                                    <div className="text-lg font-mono font-bold text-slate-900 dark:text-white tracking-wider">{coupon.code}</div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xl font-bold ${coupon.color}`}>{coupon.discount}</div>
                                </div>
                            </div>

                            <Button className="w-full mt-6 gap-2" variant="primary">
                                Apply Now <ArrowRight size={16} />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Additional Info Section */}
                <div className="mt-16 bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Terms & Conditions</h2>
                    <ul className="space-y-4 text-slate-600 dark:text-slate-400 list-disc list-inside">
                        <li>Coupons cannot be combined with other offers unless specified.</li>
                        <li>Valid only at participating labs and healthcare centers.</li>
                        <li>Must present digital coupon or code at the time of booking or payment.</li>
                        <li>Family Health Bundle applies to bookings made for 3 or more distinct patients in a single transaction.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
