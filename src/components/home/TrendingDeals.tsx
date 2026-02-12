"use client";

import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { trendingDeals } from '@/lib/constants';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

export default function TrendingDeals({ city = "Lutz, FL" }: { city?: string }) {
    const { currency } = useUserStore();
    const [mounted, setMounted] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAddToCart = (deal: any) => {
        addToCart({
            id: deal.id,
            title: deal.title,
            price: deal.dealPrice,
            originalPrice: deal.originalPrice,
            image: deal.image,
            labName: deal.labName
        });
        toast.success(`${deal.title} added to cart!`);
    };

    const formatPrice = (price: number) => {
        if (!mounted) return `$${price}`; // Default server-side matches 'USD'
        if (currency === 'INR') {
            return `₹${(price * 83).toLocaleString()}`;
        }
        return `$${price}`;
    };

    return (
        <section className="py-12 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Trending in {city}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Popular health packages and exclusive offers near you
                        </p>
                    </div>
                    <a href="/deals" className="hidden sm:inline-flex text-blue-600 font-semibold hover:text-blue-700 items-center gap-1">
                        View all deals
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingDeals.map((deal) => (
                        <div key={deal.id} className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                            {/* Image Header */}
                            <div className="relative h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                {deal.tags.length > 0 && (
                                    <div className="absolute top-3 left-3 z-10 flex gap-2">
                                        {deal.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-md shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {/* Placeholder Image */}
                                <Image
                                    src={deal.image}
                                    alt={deal.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                                    {deal.title}
                                </h3>
                                <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    {deal.labName}
                                </div>

                                {/* Rating & Location */}
                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    <div className="flex items-center gap-1">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(deal.rating) ? 'fill-current' : 'text-slate-300'}`} />
                                            ))}
                                        </div>
                                        <span className="font-medium">({deal.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {deal.distance}
                                    </div>
                                </div>

                                {/* Price Stack */}
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                                    <div>
                                        <span className="text-xs text-slate-500 line-through block">
                                            {formatPrice(deal.originalPrice)}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-green-600">
                                                {formatPrice(deal.dealPrice)}
                                            </span>
                                            <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded">
                                                -{Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(deal)}
                                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-50 transition-colors shadow-sm"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
