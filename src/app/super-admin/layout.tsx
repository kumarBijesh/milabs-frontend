'use client';

import { usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardLayoutWrapper from '@/components/layout/DashboardLayoutWrapper';
import { LayoutDashboard, Users, FlaskConical, CalendarDays, Settings, CreditCard, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SUPER_ADMIN_NAV_ITEMS = [
    { label: 'Overview', href: '/super-admin/dashboard', icon: LayoutDashboard },
    { label: 'Platform Users', href: '/super-admin/users', icon: Users },
    { label: 'Manage Labs', href: '/super-admin/labs', icon: FlaskConical },
    { label: 'Admin Management', href: '/super-admin/admins', icon: ShieldAlert },
    { label: 'System Revenue', href: '/super-admin/revenue', icon: CreditCard },
    { label: 'Platform Settings', href: '/super-admin/settings', icon: Settings },
];

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    // Role protection should happen here or in middleware

    return (
        <div className="dark">
            <DashboardLayoutWrapper
                Sidebar={
                    <DashboardSidebar
                        title="Super Admin"
                        items={SUPER_ADMIN_NAV_ITEMS}
                        userEmail={user?.email || 'super@milabs.com'}
                        userName={user?.name || 'Super Admin'}
                        userAvatar={user?.avatar}
                    />
                }
            >
                {children}
            </DashboardLayoutWrapper>
        </div>
    );
}
