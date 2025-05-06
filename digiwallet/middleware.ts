import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/send-money', '/money-request', '/wallet'])
const isAdmin = createRouteMatcher(['/admin'])

export default clerkMiddleware(async (auth, req) => {
  //   const { pathname } = req.nextUrl;

  // // Exclude authentication pages from protection
  // if (pathname.startsWith("/signIn") || pathname.startsWith("/signUp")) {
  //   return undefined;
  // }
  if (isProtectedRoute(req)){
    // console.log("protected")
    // if(req.nextUrl.pathname === "/signIn" || req.nextUrl.pathname === "/signUp") return undefined;
    await auth.protect()
  }
  if (isAdmin(req)){
    // console.log("protected")
    // if(req.nextUrl.pathname === "/signIn" || req.nextUrl.pathname === "/signUp") return undefined;
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}