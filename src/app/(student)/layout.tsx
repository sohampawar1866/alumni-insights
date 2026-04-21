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
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex flex-1 items-center justify-center p-6 bg-slate-50">
          <ProfileForm initialData={profile} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 bg-slate-50">{children}</main>
    </div>
  );
}
