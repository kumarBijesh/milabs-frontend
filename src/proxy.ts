import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authMiddleware = withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const userRole = token?.role as string;

        // 0. Redirect if NOT logged in
        if (!token) {
            if (path.startsWith("/super-admin") ||
                path.startsWith("/admin") ||
                path.startsWith("/lab") ||
                path.startsWith("/partner") ||
                path.startsWith("/doctors") ||
                path.startsWith("/corporate")) {
                return NextResponse.redirect(new URL("/auth/admin/login?callbackUrl=" + encodeURIComponent(req.url), req.url));
            }
            return NextResponse.redirect(new URL("/auth/login?callbackUrl=" + encodeURIComponent(req.url), req.url));
        }

        // 1. RBAC - Super Admin protection
        if (path.startsWith("/super-admin") && userRole !== "super_admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // 2. RBAC - Lab Admin protection (Partner Portal)
        if ((path.startsWith("/lab") || path.startsWith("/partner")) && !["super_admin", "lab_admin"].includes(userRole)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // 3. RBAC - Patient protection
        if (path.startsWith("/patient") && !["patient", "super_admin"].includes(userRole)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: () => true, // Handled by inner logic
        },
    }
);

export async function proxy(req: NextRequest) {
    // @ts-expect-error - withAuth expects NextMiddleware signature
    return await authMiddleware(req, {
        waitUntil: () => Promise.resolve()
    } as any);
}

export const config = {
    matcher: [
        "/super-admin/:path*",
        "/admin/:path*",
        "/lab/:path*",
        "/patient/:path*",
        "/partner/:path*",
        "/doctors/:path*",
        "/corporate/:path*",
    ],
};
