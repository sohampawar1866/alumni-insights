import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Menu } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", user.id)
    .single();

  if (!profile?.roles?.includes("admin")) redirect("/unauthorized");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <aside className="w-full md:w-72 shrink-0 flex flex-col border-b-4 md:border-b-0 md:border-r-4 border-foreground bg-white">
        <input type="checkbox" id="admin-menu" className="peer hidden" />
        <div className="border-b-4 border-foreground p-6 bg-accent flex justify-between items-center">
          <div>
            <h2 className="font-heading text-xl font-black uppercase tracking-tight text-foreground">Admin Panel</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-foreground">Platform Administration</p>
          </div>
          <label htmlFor="admin-menu" className="md:hidden p-2 border-2 border-foreground bg-white shadow-[2px_2px_0px_#000] cursor-pointer hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#000] transition-all">
            <Menu className="w-6 h-6" strokeWidth={3} />
          </label>
        </div>

        <div className="hidden peer-checked:flex md:flex flex-col flex-1">
          <nav className="flex-1 space-y-2 p-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-wider border-2 border-transparent hover:border-foreground hover:bg-accent/20 hover:shadow-[4px_4px_0px_#000] transition-all"
            >
              <Users className="w-5 h-5" strokeWidth={2.5} />
              Manage Moderators
            </Link>
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
