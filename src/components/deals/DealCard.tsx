import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Tag, Activity } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils'; // Keep import consistent
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface DealCardProps {
    id: string;
    title: string;
    labName: string;
    price: number;
    originalPrice: number;
    rating: number;
    location: string;
    discount: number;
    image?: string; // Optional image URL
}

export default function DealCard({
    id,
    title,
    labName,
    price,
    originalPrice,
    rating,
    location,
    discount,
    image,
}: DealCardProps) {
    const addToCart = useCartStore((state) => state.addToCart);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("Please login to book this deal");
            const currentPath = window.location.pathname;
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`);
            return;
        }

        addToCart({
            id: Number(id), // Ensure ID is number if store expects number
            title,
            price,
            originalPrice,
            image: image || "",
            labName,
        });
        toast.success(`${title} added to cart!`);
    };

    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                {discount}% OFF
            </div>

            {/* Image Placeholder */}
            <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                    <div className="flex items-center text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                        <Activity className="w-3 h-3 mr-1 text-green-400" />
                        Health Check
                    </div>
                </div>
                {/* Placeholder Pattern / Dynamic Image */}
                <Image
                    src={image || 'https://placehold.co/600x400/e2e8f0/1e293b?text=Lab+Test'}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="ml-1 text-xs font-bold text-yellow-700 dark:text-yellow-500">{rating}</span>
                    </div>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" /> {labName} • {location}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through">₹{originalPrice}</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">₹{price}</span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="px-4 py-2 text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}
