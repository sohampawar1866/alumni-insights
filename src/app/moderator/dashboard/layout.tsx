import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/moderator/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "moderator") redirect("/unauthorized");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-900">Moderator Panel</h2>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {profile?.full_name || user.email}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink href="/moderator/dashboard" label="Alumni Management" icon="👤" />
          <SidebarLink href="/moderator/dashboard/import" label="Bulk Import" icon="📁" />
          <SidebarLink href="/moderator/dashboard/applications" label="Applications" icon="📝" />
          <SidebarLink href="/moderator/dashboard/audit" label="Audit Log" icon="📋" />
          <SidebarLink href="/moderator/dashboard/analytics" label="Analytics" icon="📊" />
          <SidebarLink href="/moderator/dashboard/announcements" label="Announcements" icon="📢" />
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

      {/* Main content */}
      <main className="flex-1 bg-slate-50 overflow-auto">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
