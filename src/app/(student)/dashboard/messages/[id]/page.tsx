import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChatThread } from "@/components/chat-thread";
import { ArrowLeft } from "lucide-react";

export default async function StudentMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: request } = await supabase
    .from("connection_requests")
    .select(`
      id, status,
      alumni:profiles!connection_requests_alumni_id_fkey(full_name)
    `)
    .eq("id", id)
    .eq("student_id", user.id)
    .single();

  if (!request) notFound();

  if (request.status !== "accepted" && request.status !== "completed") {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6 font-sans">
        <div className="inline-block border-2 border-slate-900 bg-white p-8 rounded-2xl shadow-[5px_5px_0px_#0f172a] space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">Chat Unavailable</h1>
          <p className="text-xs font-semibold text-slate-600">You can only chat on accepted or completed connection requests.</p>
          <Link href="/dashboard/requests" className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 px-4 py-2.5 rounded-xl border-2 border-slate-900 hover:bg-slate-800 transition-colors shadow-[2px_2px_0px_#0f172a]">
            Return to My Requests
          </Link>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alumniName = (request.alumni as any).full_name || "Alumnus";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4 font-sans">
      <Link
        href="/dashboard/requests"
        className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors gap-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Requests
      </Link>
      
      <ChatThread 
        requestId={id} 
        currentUserId={user.id} 
        otherUserName={alumniName} 
      />
    </div>
  );
}
