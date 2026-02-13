import SectionHeader from '@/components/ui/SectionHeader';
import { ShieldCheck, Star, MapPin, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/prisma';

// Helper to format location
function formatLocation(lab: any) {
    const parts = [lab.address, lab.city, lab.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not available';
}

async function getLabs() {
    try {
        const labs = await prisma.lab.findMany({
            where: { isActive: true },
            orderBy: { rating: 'desc' }
        });
        return labs;
    } catch (error) {
        console.error("Error fetching labs:", error);
        return [];
    }
}

export default async function LabsPage() {
    const labs = await getLabs();

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Partner Labs"
                    description="Leading diagnostic centers trusted by thousands."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {labs.length > 0 ? (
                        labs.map((lab) => (
                            <div key={lab.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                                <div className="h-48 relative overflow-hidden">
                                    <div className="absolute top-4 right-4 z-10">
                                        {lab.isVerified && (
                                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                                                <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <img
                                        src={lab.image || '/images/placeholder-lab.jpg'}
                                        alt={lab.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <Button size="sm" className="w-full">View Details</Button>
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{lab.name}</h3>
                                        <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                            <span className="ml-1 text-xs font-bold text-yellow-700 dark:text-yellow-500">{lab.rating || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-sm flex items-center mb-4 flex-grow">
                                        <MapPin className="w-4 h-4 mr-1 text-slate-400 flex-shrink-0" />
                                        {formatLocation(lab)}
                                    </p>
                                    <div className="flex space-x-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            <Phone className="w-3 h-3 mr-2" /> Call
                                        </Button>
                                        <Button size="sm" className="flex-1">
                                            Book Test
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-slate-500 text-lg">No labs found. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
