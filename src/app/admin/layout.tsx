'use client';

import { usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardLayoutWrapper from '@/components/layout/DashboardLayoutWrapper';
import { LayoutDashboard, Users, FlaskConical, CalendarDays, Settings, CreditCard, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ADMIN_NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Labs', href: '/admin/labs', icon: FlaskConical },
    { label: 'Deals', href: '/admin/deals', icon: Building2 },
    { label: 'Bookings', href: '/admin/bookings', icon: CalendarDays },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();

    return (
        <DashboardLayoutWrapper
            Sidebar={
                <DashboardSidebar
                    title="MiLabs Admin"
                    items={ADMIN_NAV_ITEMS}
                    userEmail={user?.email || 'admin@milabs.com'}
                    userName={user?.name || 'Admin User'}
                    userAvatar={user?.avatar}
                />
            }
        >
            {children}
        </DashboardLayoutWrapper>
    );
}
