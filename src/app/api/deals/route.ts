import { NextResponse } from 'next/server';

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
        image: '/images/test1.jpg',
    },
    {
        id: '2',
        title: 'Comprehensive Thyroid Profile',
        labName: 'HealthCare Plus',
        price: 599,
        originalPrice: 1200,
        rating: 4.5,
        location: 'Delhi, Connaught Place',
        discount: 50,
        image: '/images/test2.jpg',
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
        image: '/images/test3.jpg',
    },
    {
        id: '4',
        title: 'Diabetes Screening Package',
        labName: 'Reliable PathLabs',
        price: 399,
        originalPrice: 800,
        rating: 4.2,
        location: 'Chennai, T. Nagar',
        discount: 50,
        image: '/images/test4.jpg',
    },
];

export async function GET() {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
        success: true,
        data: MOCK_DEALS,
    });
}
