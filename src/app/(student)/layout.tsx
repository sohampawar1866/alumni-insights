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

  // If the student hasn't completed their profile yet, show the form
  const isProfileComplete = profile?.role !== 'student' || (profile?.branch && profile?.graduation_year);

  if (!isProfileComplete) {
    return (
      <div className="flex flex-col min-h-screen bg-background border-t-8 border-foreground font-sans relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <Navigation />
        <main className="flex flex-1 flex-col items-center justify-center p-6 relative z-10 w-full">
          <ProfileForm initialData={profile} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background border-t-8 border-foreground font-sans relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <Navigation />
      <main className="flex flex-col flex-1 relative z-10">{children}</main>
    </div>
  );
}
