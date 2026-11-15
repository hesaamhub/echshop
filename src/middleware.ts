import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Redirect to login if not authenticated
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    // Protect all dashboard routes
    "/dashboard/:path*",
    // Protect all admin routes
    "/admin/:path*",
    // Protect checkout
    "/checkout",
  ],
};
