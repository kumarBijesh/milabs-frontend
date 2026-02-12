export const categories = [
    { name: 'Beauty & Spas', icon: 'Sparkles' },
    { name: 'Things To Do', icon: 'Ticket' },
    { name: 'Auto & Home', icon: 'Car' },
    { name: 'Food & Drink', icon: 'Utensils' },
    { name: 'Health Tests', icon: 'Activity', highlight: true },
    { name: 'Local', icon: 'MapPin' },
    { name: 'Travel', icon: 'Plane' },
    { name: 'Goods', icon: 'ShoppingBag' },
    { name: 'Coupons', icon: 'Tag' },
];

export const heroSlides = [
    {
        id: 1,
        title: "New Year, New Me!",
        subtitle: "Kickstart your wellness journey with up to 50% off select health packages.",
        cta: "Shop Deals",
        link: "/deals",
        image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop", // Wellness/Spa
        color: "bg-purple-600"
    },
    {
        id: 2,
        title: "Preventive Health Near You",
        subtitle: "Comprehensive lab panels available at top-rated facilities in your city.",
        cta: "View Labs",
        link: "/labs",
        image: "https://images.unsplash.com/photo-1579684385136-137af75135a8?q=80&w=2070&auto=format&fit=crop", // Lab/Doctor
        color: "bg-blue-600"
    },
    {
        id: 3,
        title: "Family Health Coupons",
        subtitle: "Exclusive savings on pediatric and family care services.",
        cta: "Browse Coupons",
        link: "/coupons",
        image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=2070&auto=format&fit=crop", // Family/Kids
        color: "bg-green-600"
    }
];

// Mock data for deals
export const trendingDeals = [
    {
        id: 1,
        title: "Comprehensive Metabolic Panel",
        labName: "City Labs Inc.",
        rating: 4.8,
        reviews: 120,
        distance: "2.4 mi",
        originalPrice: 99,
        dealPrice: 49,
        tags: ["Best Seller", "Limited Time"],
        image: "https://images.unsplash.com/photo-1579684385136-137af75135a8?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "Vitamin D Screening",
        labName: "HealthPlus Diagnostics",
        rating: 4.5,
        reviews: 85,
        distance: "5.1 mi",
        originalPrice: 75,
        dealPrice: 29,
        tags: ["Popular"],
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Thyroid Function Test",
        labName: "Rapid Results Lab",
        rating: 4.9,
        reviews: 210,
        distance: "1.2 mi",
        originalPrice: 120,
        dealPrice: 65,
        tags: ["Sponsored"],
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        title: "Lipid Profile",
        labName: "City Labs Inc.",
        rating: 4.7,
        reviews: 95,
        distance: "2.4 mi",
        originalPrice: 80,
        dealPrice: 35,
        tags: [],
        image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800"
    }
];
