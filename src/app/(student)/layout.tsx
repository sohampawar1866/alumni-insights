import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { ProfileForm } from "@/components/profile-form";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isStudent = profile?.roles?.includes('student');
  const isProfileComplete = !isStudent || (profile?.branch && profile?.graduation_year);

  if (!isProfileComplete) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <Navigation />
        <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 relative z-10 w-full">
          <ProfileForm initialData={profile} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <Navigation />
      <main className="flex flex-col flex-1 relative z-10">{children}</main>
    </div>
  );
}
