import { AnnouncementsBoard } from "@/components/announcements-board";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentAnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  return <AnnouncementsBoard currentUserRole="student" currentUserId={user.id} />;
}
