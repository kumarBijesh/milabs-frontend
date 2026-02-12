'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import DealCard from '@/components/deals/DealCard';

// For now, duplicate or move mock data to a shared lib
const MOCK_DEALS = [
    {
        id: '1',
        title: 'Full Body Checkup - Platinum Package',
        labName: 'City Lab Diagnostics',
        price: 1499,
        originalPrice: 4500,
        rating: 4.8,
        location: 'Mumbai, Andheri West',
        discount: 66,
        category: 'Health Tests', // Added category
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '2',
        title: 'Luxury Spa Day',
        labName: 'Serenity Spa',
        price: 2999,
        originalPrice: 6000,
        rating: 4.9,
        location: 'Mumbai, Bandra',
        discount: 50,
        category: 'Beauty & Spas', // Added category
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        title: 'Vitamin B12 & D3 Screening',
        labName: 'Wellness Labs',
        price: 899,
        originalPrice: 2000,
        rating: 4.9,
        location: 'Bangalore, Indiranagar',
        discount: 55,
        category: 'Health Tests',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '4',
        title: 'Car Detailing Package',
        labName: 'AutoGlow',
        price: 999,
        originalPrice: 2500,
        rating: 4.5,
        location: 'Delhi, Saket',
        discount: 60,
        category: 'Auto & Home',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '5',
        title: 'Womens Health Check',
        labName: 'FemCare Labs',
        price: 2499,
        originalPrice: 5000,
        rating: 5.0,
        location: 'Pune, Koregaon Park',
        discount: 50,
        category: 'Health Tests',
        image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '6',
        title: 'Pottery Workshop',
        labName: 'Art Studio',
        price: 1200,
        originalPrice: 1800,
        rating: 4.7,
        location: 'Hyderabad, Jubilee Hills',
        discount: 33,
        category: 'Things To Do',
        image: 'https://images.unsplash.com/photo-1565193566173-092dc0465c69?auto=format&fit=crop&w=800&q=80',
    },
];

function DealsContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    const filteredDeals = category
        ? MOCK_DEALS.filter(deal => deal.category === category)
        : MOCK_DEALS;

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title={category ? `${category} Deals` : "Explore All Deals"}
                    description={category ? `Best offers in ${category}` : "Find the perfect deal for you and your family."}
                />

                {filteredDeals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredDeals.map((deal) => (
                            <DealCard key={deal.id} {...deal} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">No deals found in this category yet.</p>
                        <button
                            onClick={() => window.location.href = '/deals'}
                            className="mt-4 text-blue-600 hover:underline"
                        >
                            View all deals
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DealsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <DealsContent />
        </Suspense>
    );
}
