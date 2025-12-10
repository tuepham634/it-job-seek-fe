import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prevent infinite redirect loop - if already on home/login page, allow access
  if (pathname === "/" || pathname.startsWith("/user/login") || pathname.startsWith("/company/login")) {
    return NextResponse.next();
  }

  try {
    // Lấy cookie header trình duyệt gửi đến FE
    const cookieHeader = request.headers.get("cookie") || "";
    
    // Log cookie để debug
    console.log("=== Middleware Debug ===");
    console.log("Path:", pathname);
    console.log("Cookie Header:", cookieHeader);
    console.log("Has token cookie:", cookieHeader.includes("token="));

    // Gọi BE để check token với timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      headers: { cookie: cookieHeader },
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      // HTTP error → redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    const data = await res.json();
    
    // Log auth response for debugging
    console.log("Auth check response:", data);

    if (data.code === "success") {
      // Token hợp lệ → cho phép truy cập page
      return NextResponse.next();
    } else {
      // Token invalid → redirect về /
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
