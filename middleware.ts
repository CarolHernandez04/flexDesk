import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

export const middleware = withAuth(
  function middleware(request: NextRequest & { nextauth: { token: JWT | null } }) {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;

    // Public routes
    const publicRoutes = ["/login", "/register", "/"];

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Protect dashboard and other routes. The middleware protects private routes. The dashboard requires a logged-in user,and the admin page requires an admin user.
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Admin-only routes
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/protected/:path*"],
};