import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
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
    if (path.startsWith("/alumni")) return NextResponse.redirect(new URL("/alumni/login", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Fetch role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role || "student";

  // Redirect logged-in users away from login pages to their dashboard
  if (path === "/" || path.endsWith("/login")) {
    const dashboards: Record<string, string> = {
      admin: "/admin/dashboard",
      moderator: "/moderator/dashboard",
      alumni: "/alumni/dashboard",
      student: "/dashboard",
    };
    return NextResponse.redirect(new URL(dashboards[role] || "/dashboard", request.url));
  }

  // Role-based access control
  if (path.startsWith("/admin/dashboard") && role !== "admin") return NextResponse.redirect(new URL("/unauthorized", request.url));
  if (path.startsWith("/moderator/dashboard") && role !== "moderator") return NextResponse.redirect(new URL("/unauthorized", request.url));
  if (path.startsWith("/alumni/dashboard") && role !== "alumni") return NextResponse.redirect(new URL("/unauthorized", request.url));

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
