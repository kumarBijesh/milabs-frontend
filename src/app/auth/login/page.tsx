import { Suspense } from 'react';
import SlidingAuthPage from '@/components/auth/SlidingAuthPage';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SlidingAuthPage initialMode="login" />
        </Suspense>
    );
}
