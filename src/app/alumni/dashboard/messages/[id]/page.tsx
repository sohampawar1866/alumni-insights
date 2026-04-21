import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChatThread } from "@/components/chat-thread";

export default async function AlumniMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify the user is part of this connection request and it is accepted
  const { data: request } = await supabase
    .from("connection_requests")
    .select(`
      id, status,
      student:profiles!connection_requests_student_id_fkey(full_name)
    `)
    .eq("id", id)
    .eq("alumni_id", user.id)
    .single();

  if (!request) notFound();

  // Optionally, we could allow chat even if it's "completed", but usually chat happens when "accepted".
  if (request.status !== "accepted" && request.status !== "completed") {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Chat Unavailable</h1>
        <p className="text-slate-500">You can only chat on accepted or completed requests.</p>
        <Link href="/alumni/dashboard/requests" className="text-blue-600 hover:underline">
          Return to Incoming Requests
        </Link>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studentName = (request.student as any).full_name || "Student";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <Link
        href="/alumni/dashboard/requests"
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← Back to Requests
      </Link>
      
      <ChatThread 
        requestId={id} 
        currentUserId={user.id} 
        otherUserName={studentName} 
      />
    </div>
  );
}
