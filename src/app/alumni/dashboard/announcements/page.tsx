import { AnnouncementsBoard } from "@/components/announcements-board";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AlumniAnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/alumni/login");
  }

  return <AnnouncementsBoard currentUserRole="alumni" currentUserId={user.id} />;
}
