import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Apply Security Headers to prevent Clickjacking, MIME-sniffing, and Cross-Site leaks
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  const path = request.nextUrl.pathname;

  // 1. Instantly bypass static files and API assets for maximum speed
  if (
    path.startsWith("/_next") ||
    path.startsWith("/images") ||
    path.includes(".") ||
    path === "/favicon.ico"
  ) {
    return response;
  }

  // 2. Define Public Routes that do NOT require authentication
  const publicPaths = [
    "/",
    "/about",
    "/login",
    "/alumni/login",
    "/moderator/login",
    "/admin/login",
    "/api/auth",
    "/unauthorized",
    "/not-found",
    "/~offline",
  ];

  const isPublicPath = publicPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  // Check if any Supabase auth cookies exist on the request
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.includes("sb-") && c.name.includes("-auth-token"));

  // If visiting a public page and NO auth cookie exists, serve immediately (0ms delay)
  if (isPublicPath && !hasAuthCookie) {
    return response;
  }

  // Create Supabase SSR client for authenticated session verification
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is unauthenticated and attempting to access a protected route, redirect to login
  if (!user) {
    if (isPublicPath) return response;

    if (path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (path.startsWith("/moderator")) {
      return NextResponse.redirect(new URL("/moderator/login", request.url));
    }
    if (path.startsWith("/alumni/dashboard") || path === "/alumni/login") {
      return NextResponse.redirect(new URL("/alumni/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Fetch roles with optimized cache / App Metadata fallback
  let roles: string[] = (user.app_metadata?.roles as string[]) || [];

  if (roles.length === 0) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("roles")
      .eq("id", user.id)
      .single();

    roles = profile?.roles || [];
  }


  // Redirect authenticated users away from auth pages.
  // CRITICAL: Each login portal redirects ONLY to its own dashboard.
  // This prevents multi-role users (e.g. student + moderator) from being
  // hijacked to the wrong portal when they intentionally choose a specific login page.
  if (path === "/login") {
    if (!roles.includes("student")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (path === "/alumni/login") {
    if (!roles.includes("alumni")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.redirect(new URL("/alumni/dashboard", request.url));
  }
  if (path === "/moderator/login") {
    if (!roles.includes("moderator")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.redirect(new URL("/moderator/dashboard", request.url));
  }
  if (path === "/admin/login") {
    if (!roles.includes("admin")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Strict Role-Based Access Control (RBAC)
  if (path.startsWith("/admin/dashboard") && !roles.includes("admin")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (path.startsWith("/moderator/dashboard") && !roles.includes("moderator")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (path.startsWith("/alumni/dashboard") && !roles.includes("alumni")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const studentRoutes = ["/dashboard", "/search", "/announcements"];
  const isStudentRoute = studentRoutes.some(
    (r) => path === r || path.startsWith(r + "/")
  );

  if (isStudentRoute && !roles.includes("student")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const isAlumniProfileView =
    path.startsWith("/alumni/") &&
    !path.startsWith("/alumni/dashboard") &&
    path !== "/alumni/login";

  if (isAlumniProfileView && !roles.includes("student") && !roles.includes("alumni")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
