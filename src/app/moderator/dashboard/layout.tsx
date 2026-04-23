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
    <div className="flex min-h-screen bg-background">
      <aside className="w-72 shrink-0 flex-col border-r-4 border-foreground bg-white">
        <div className="border-b-4 border-foreground p-6 bg-secondary">
          <h2 className="font-heading text-xl font-black uppercase tracking-tight text-foreground">Moderator Panel</h2>
          <p className="mt-1 truncate text-xs font-bold uppercase tracking-wider text-foreground">
            {profile?.full_name || user.email}
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <SidebarLink href="/moderator/dashboard" label="Add Alumni" icon="👤" />
          <SidebarLink href="/moderator/dashboard/import" label="Bulk Import" icon="📁" />
          <SidebarLink href="/moderator/dashboard/applications" label="Applications" icon="📝" />
          <SidebarLink href="/moderator/dashboard/audit" label="Audit Log" icon="📋" />
          <SidebarLink href="/moderator/dashboard/analytics" label="Analytics" icon="📊" />
          <SidebarLink href="/moderator/dashboard/announcements" label="Outreach" icon="📢" />
        </nav>

        <div className="border-t-4 border-foreground p-4 bg-muted">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full text-left font-black uppercase tracking-wider text-sm px-4 py-3 border-2 border-foreground bg-destructive text-destructive-foreground shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#1b1c1a_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none" />
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </main>
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
      className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-wider border-2 border-transparent hover:border-foreground hover:bg-primary/20 hover:shadow-[4px_4px_0px_#000] transition-all"
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}
