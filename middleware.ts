import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Check authentication - req.auth contains the session if user is authenticated
  // In NextAuth v5, req.auth should contain the session object
  const session = req.auth;
  const isAuthenticated = !!(session?.user?.id || session?.user?.email);

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/manuscripts", "/reviews"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Debug logging (remove in production)
  console.log(`🔐 Middleware: ${pathname}`);
  console.log(`🔐 Session exists:`, !!session);
  console.log(`🔐 Session user:`, session?.user);
  console.log(`🔐 Is authenticated:`, isAuthenticated);
  console.log(`🔐 Is protected route:`, isProtectedRoute);

  // If it's a protected route and user is not authenticated, redirect to sign in
  if (isProtectedRoute && !isAuthenticated) {
    console.log(
      `🚫 Redirecting unauthenticated user from ${pathname} to sign in`
    );
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
