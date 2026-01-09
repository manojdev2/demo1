import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Create auth instance lazily to avoid build-time issues
const authMiddleware = NextAuth(authConfig).auth;

export default authMiddleware;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // Only run middleware on dashboard routes - explicitly exclude root and auth pages
  matcher: [
    "/dashboard/:path*",
  ],
};
