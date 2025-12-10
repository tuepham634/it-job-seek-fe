import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prevent infinite redirect loop - if already on home/login page, allow access
  if (pathname === "/" || pathname.startsWith("/user/login") || pathname.startsWith("/company/login")) {
    return NextResponse.next();
  }

  try {
    // Lấy token từ cookies
    const token = request.cookies.get("token")?.value;
    
    console.log("=== Middleware Debug ===");
    console.log("Path:", pathname);
    console.log("Has token:", !!token);

    if (!token) {
      console.log("No token found, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Gọi BE để check token với timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      headers: { 
        "Cookie": `token=${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.log("Backend returned error:", res.status);
      return NextResponse.redirect(new URL("/", request.url));
    }

    const data = await res.json();
    console.log("Auth check response:", data);

    if (data.code === "success") {
      return NextResponse.next();
    } else {
      console.log("Auth failed, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    // Log error for debugging
    console.error("Middleware auth check error:", error);
    
    // Redirect to home on error
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/user-manage/:path*",
    "/company-manage/:path*"
  ],
};
