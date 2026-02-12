import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ConstructionPageProps {
    title: string;
    description?: string;
}

export default function ConstructionPage({ title, description }: ConstructionPageProps) {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-6 animate-bounce">
                <Construction className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
                {description || "We're working hard to bring you this page. Please check back soon!"}
            </p>
            <Link href="/">
                <Button className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Button>
            </Link>
        </div>
    );
}
