import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Lấy cookie header trình duyệt gửi đến FE
    const cookieHeader = request.headers.get("cookie") || "";
    console.log("Cookie Header:", cookieHeader);

    // Gọi BE để check token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      headers: { cookie: cookieHeader },
      credentials: "include",
    });

    const data = await res.json();

    if (data.code === "success") {
      // Token hợp lệ → cho phép truy cập page
      return NextResponse.next();
    } else {
      // Token invalid → redirect về /
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // Lỗi fetch → redirect về /
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/user-manage/:path*", "/company-manage/:path*"],
};
