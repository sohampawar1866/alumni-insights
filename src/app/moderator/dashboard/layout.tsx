import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, FolderUp, FileText, ClipboardList, BarChart3, Megaphone, Menu, LogOut } from "lucide-react";

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
    .select("roles, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.roles?.includes("moderator")) redirect("/unauthorized");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans relative">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col bg-white border-b-2 md:border-b-0 md:border-r-2 border-slate-900 relative z-20 shadow-[4px_0px_0px_#0f172a] md:min-h-screen">
        <input type="checkbox" id="mod-menu" className="peer hidden" />
        
        {/* Sidebar Header */}
        <div className="p-5 border-b-2 border-slate-900 bg-amber-400 flex items-center justify-between">
          <div className="min-w-0 pr-2 flex items-center gap-2.5">
            <div className="relative w-9 h-9 shrink-0">
              <Image
                src="/images/iiitn.png"
                alt="IIIT Nagpur Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-full"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 font-heading truncate">Moderator Panel</h2>
              <p className="text-xs font-semibold text-slate-900/80 truncate">
                {profile?.full_name || user.email}
              </p>
            </div>
          </div>
          <label htmlFor="mod-menu" className="md:hidden p-2.5 rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_#0f172a] cursor-pointer">
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </label>
        </div>

        {/* Navigation Items */}
        <div className="hidden peer-checked:flex md:flex flex-col flex-1 justify-between p-4">
          <nav className="space-y-2">
            <Link
              href="/moderator/dashboard"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-xs font-bold uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 hover:-translate-y-0.5 transition-all"
            >
              <span>Add Alumni</span>
              <UserPlus className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/moderator/dashboard/import"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-xs font-bold uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 hover:-translate-y-0.5 transition-all"
            >
              <span>Bulk Import</span>
              <FolderUp className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/moderator/dashboard/applications"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-xs font-bold uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 hover:-translate-y-0.5 transition-all"
            >
              <span>Applications</span>
              <FileText className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/moderator/dashboard/audit"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-xs font-bold uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 hover:-translate-y-0.5 transition-all"
            >
              <span>Audit Log</span>
              <ClipboardList className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/moderator/dashboard/analytics"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-xs font-bold uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 hover:-translate-y-0.5 transition-all"
            >
              <span>Analytics</span>
              <BarChart3 className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/moderator/dashboard/announcements"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-white text-xs font-bold uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-100 hover:-translate-y-0.5 transition-all"
            >
              <span>Outreach</span>
              <Megaphone className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </nav>
          
          <div className="pt-4 border-t-2 border-slate-900 mt-6">
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-red-50 text-xs font-bold uppercase tracking-wider text-red-700 shadow-[2px_2px_0px_#0f172a] hover:bg-red-100 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-8 relative z-10 w-full">
        {children}
      </main>
    </div>
  );
}
