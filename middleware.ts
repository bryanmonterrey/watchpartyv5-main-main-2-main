import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/api/webhooks(.*)", "/api/uploadthing", "/:username", "/search"];

export default clerkMiddleware((auth, req, evt) => {
  if (publicRoutes.some(route => req.nextUrl.pathname.match(route))) {
    return NextResponse.next();
  }
  // Continue with Clerk's default behavior for protected routes
  return;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

