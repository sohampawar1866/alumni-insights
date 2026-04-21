import { AnnouncementsBoard } from "@/components/announcements-board";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ModeratorAnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/moderator/login");
  }

  return <AnnouncementsBoard currentUserRole="moderator" currentUserId={user.id} />;
}
