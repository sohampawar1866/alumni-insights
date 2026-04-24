import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const path = request.nextUrl.pathname;

  // Skip static assets
  if (path.startsWith("/_next") || path.includes(".")) {
    return response;
  }

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

  // Public paths — no auth required
  if (!user) {
    const publicPaths = ["/", "/login", "/alumni/login", "/moderator/login", "/admin/login", "/api/auth", "/unauthorized"];
    if (publicPaths.some((p) => path === p || path.startsWith(p + "/"))) {
      return response;
    }

    if (path.startsWith("/admin")) return NextResponse.redirect(new URL("/admin/login", request.url));
    if (path.startsWith("/moderator")) return NextResponse.redirect(new URL("/moderator/login", request.url));
    // Only /alumni/dashboard* and /alumni/login are alumni-portal routes.
    // /alumni/[id] is a student page (inside the (student) route group) — redirect to student login.
    if (path.startsWith("/alumni/dashboard") || path === "/alumni/login") {
      return NextResponse.redirect(new URL("/alumni/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Fetch roles (multi-role array)
  const { data: profile } = await supabase.from("profiles").select("roles").eq("id", user.id).single();
  const roles: string[] = profile?.roles || [];

  // Determine the "primary" role for dashboard redirect (priority: admin > moderator > alumni > student)
  const getPrimaryRole = (r: string[]): string => {
    if (r.includes("admin")) return "admin";
    if (r.includes("moderator")) return "moderator";
    if (r.includes("alumni")) return "alumni";
    if (r.includes("student")) return "student";
    return "student";
  };

  // Redirect logged-in users away from login pages to their dashboard
  const loginPaths = ["/", "/login", "/alumni/login", "/moderator/login", "/admin/login"];
  if (loginPaths.includes(path)) {
    const primaryRole = getPrimaryRole(roles);
    const dashboards: Record<string, string> = {
      admin: "/admin/dashboard",
      moderator: "/moderator/dashboard",
      alumni: "/alumni/dashboard",
      student: "/dashboard",
    };
    return NextResponse.redirect(new URL(dashboards[primaryRole] || "/dashboard", request.url));
  }

  // Role-based access control (multi-role: user needs at least one matching role)
  if (path.startsWith("/admin/dashboard") && !roles.includes("admin")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (path.startsWith("/moderator/dashboard") && !roles.includes("moderator")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (path.startsWith("/alumni/dashboard") && !roles.includes("alumni")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  // Student routes — (student) route group pages: /dashboard, /search, /announcements, /alumni/[id]
  // /alumni/[id] is inside the (student) group but maps to /alumni/<uuid> in the URL.
  // We match it as: starts with /alumni/ but NOT /alumni/dashboard or /alumni/login.
  const studentRoutes = ["/dashboard", "/search", "/announcements"];
  const isStudentRoute = studentRoutes.some((r) => path === r || path.startsWith(r + "/"));
  const isAlumniProfileView = path.startsWith("/alumni/") && !path.startsWith("/alumni/dashboard") && path !== "/alumni/login";
  if ((isStudentRoute || isAlumniProfileView) && !roles.includes("student")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
