import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { FirstLoginNudge } from "@/components/first-login-nudge";
import { NotificationBell } from "@/components/notification-bell";

export default async function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/alumni/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "alumni") redirect("/unauthorized");

  return (
    <div className="ai-shell flex min-h-screen">
      <aside className="ai-sidebar flex w-72 shrink-0 flex-col">
        <div className="flex items-center justify-between border-b border-blue-100/80 p-6">
          <div>
            <h2 className="font-heading text-lg font-bold ai-heading-accent">Alumni Portal</h2>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {profile?.full_name || user.email}
            </p>
          </div>
          <NotificationBell />
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/alumni/dashboard"
            className="ai-sidebar-link"
          >
            <span>👤</span>
            My Profile
          </Link>
          <Link
            href="/alumni/dashboard/requests"
            className="ai-sidebar-link"
          >
            <span>💬</span>
            Requests
          </Link>
          <Link
            href="/alumni/dashboard/settings"
            className="ai-sidebar-link"
          >
            <span>⚙️</span>
            Settings
          </Link>
          <Link
            href="/alumni/dashboard/announcements"
            className="ai-sidebar-link"
          >
            <span>📢</span>
            Announcements
          </Link>
        </nav>
        <div className="border-t border-blue-100/80 p-4">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="ai-shell-main flex-1 overflow-auto">
        {children}
        <FirstLoginNudge />
      </main>
    </div>
  );
}
