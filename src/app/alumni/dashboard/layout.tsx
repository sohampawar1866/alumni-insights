import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, MessageSquare, Settings, Megaphone, Menu } from "lucide-react";

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
    .select("roles, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.roles?.includes("alumni")) redirect("/unauthorized");

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-background font-sans relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Sidebar */}
      <aside className="w-full md:w-72 shrink-0 flex flex-col bg-white border-b-8 md:border-b-0 md:border-r-8 border-foreground relative z-20 shadow-[8px_0px_0px_var(--color-foreground)] md:overflow-y-auto">
        <input type="checkbox" id="alumni-menu" className="peer hidden" />
        <div className="p-6 border-b-4 border-foreground bg-primary text-background flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <h2 className="text-xl font-black uppercase tracking-tighter">ALUMNI PORTAL</h2>
            <p className="text-sm font-bold uppercase tracking-wider opacity-90 truncate max-w-[180px]">
              {profile?.full_name || user.email}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-background text-foreground border-2 border-foreground shadow-[2px_2px_0px_var(--color-foreground)]">
              <NotificationBell />
            </div>
            <label htmlFor="alumni-menu" className="md:hidden p-2 border-2 border-foreground bg-white text-foreground shadow-[2px_2px_0px_#000] cursor-pointer hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all">
              <Menu className="w-6 h-6" strokeWidth={3} />
            </label>
          </div>
        </div>

        <div className="hidden peer-checked:flex md:flex flex-col flex-1">
          <nav className="flex-1 space-y-4 p-6">
            <Link
              href="/alumni/dashboard"
              className="flex items-center justify-between px-4 py-3 bg-muted border-4 border-foreground font-black uppercase tracking-widest text-foreground shadow-[4px_4px_0px_var(--color-foreground)] transition-all hover:bg-secondary hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_var(--color-foreground)]"
            >
              <span>My Profile</span>
              <User className="w-5 h-5" strokeWidth={2.5} />
            </Link>
            <Link
              href="/alumni/dashboard/requests"
              className="flex items-center justify-between px-4 py-3 bg-muted border-4 border-foreground font-black uppercase tracking-widest text-foreground shadow-[4px_4px_0px_var(--color-foreground)] transition-all hover:bg-secondary hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_var(--color-foreground)]"
            >
              <span>Requests</span>
              <MessageSquare className="w-5 h-5" strokeWidth={2.5} />
            </Link>
            <Link
              href="/alumni/dashboard/settings"
              className="flex items-center justify-between px-4 py-3 bg-muted border-4 border-foreground font-black uppercase tracking-widest text-foreground shadow-[4px_4px_0px_var(--color-foreground)] transition-all hover:bg-secondary hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_var(--color-foreground)]"
            >
              <span>Settings</span>
              <Settings className="w-5 h-5" strokeWidth={2.5} />
            </Link>
            <Link
              href="/alumni/dashboard/announcements"
              className="flex items-center justify-between px-4 py-3 bg-muted border-4 border-foreground font-black uppercase tracking-widest text-foreground shadow-[4px_4px_0px_var(--color-foreground)] transition-all hover:bg-secondary hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_var(--color-foreground)]"
            >
              <span>Noticeboard</span>
              <Megaphone className="w-5 h-5" strokeWidth={2.5} />
            </Link>
          </nav>
          
          <div className="p-6 border-t-4 border-foreground border-dashed bg-white">
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-destructive border-4 border-foreground font-black uppercase tracking-widest text-background shadow-[4px_4px_0px_var(--color-foreground)] transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_var(--color-foreground)]"
              >
                SIGN OUT
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10 w-full">
        {children}
        <FirstLoginNudge />
      </main>
    </div>
  );
}
