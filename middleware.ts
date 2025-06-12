import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // The authorized callback in auth.ts handles the authentication logic
  // This middleware just needs to pass through the request
  console.log(`🔐 Middleware: ${req.nextUrl.pathname}, Auth:`, !!req.auth);
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
