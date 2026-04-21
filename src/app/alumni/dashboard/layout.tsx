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
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Alumni Portal</h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {profile?.full_name || user.email}
            </p>
          </div>
          <NotificationBell />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/alumni/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <span>👤</span>
            My Profile
          </Link>
          <Link
            href="/alumni/dashboard/requests"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <span>💬</span>
            Requests
          </Link>
          <Link
            href="/alumni/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <span>⚙️</span>
            Settings
          </Link>
          <Link
            href="/alumni/dashboard/announcements"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <span>📢</span>
            Announcements
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full text-left text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-slate-50 overflow-auto">
        {children}
        <FirstLoginNudge />
      </main>
    </div>
  );
}
