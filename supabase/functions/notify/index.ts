import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    const { type, record, old_record } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Handle connection request status changes
    if (type === "UPDATE" && record?.status && old_record?.status !== record.status) {


      const { data: alumni } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", record.alumni_id)
        .single();

      const alumniName = alumni?.full_name || "An alumni";

      if (record.status === "accepted") {
        // Notify student
        await supabase.from("notifications").insert({
          user_id: record.student_id,
          type: "request_accepted",
          title: `${alumniName} accepted your request!`,
          body: "You can now connect with them via LinkedIn.",
          link: "/dashboard/requests",
        });
      } else if (record.status === "declined") {
        await supabase.from("notifications").insert({
          user_id: record.student_id,
          type: "request_declined",
          title: `Your request was declined`,
          body: `${alumniName} is unable to connect at this time.`,
          link: "/dashboard/requests",
        });
      } else if (record.status === "completed") {
        // Notify student to leave feedback
        await supabase.from("notifications").insert({
          user_id: record.student_id,
          type: "request_completed",
          title: `Session with ${alumniName} marked complete`,
          body: "Leave feedback to help other students!",
          link: "/dashboard/requests",
        });
      }
    }

    // Handle new connection request (INSERT)
    if (type === "INSERT" && record?.alumni_id) {
      const { data: student } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", record.student_id)
        .single();

      await supabase.from("notifications").insert({
        user_id: record.alumni_id,
        type: "request_received",
        title: `New request from ${student?.full_name || "a student"}`,
        body: record.message?.substring(0, 100) || "They want to connect with you.",
        link: "/alumni/dashboard/requests",
      });
    }

    // Handle new feedback
    if (type === "INSERT" && record?.rating !== undefined && record?.alumni_id) {
      const { data: student } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", record.student_id)
        .single();

      await supabase.from("notifications").insert({
        user_id: record.alumni_id,
        type: "feedback_received",
        title: `${student?.full_name || "A student"} rated you ${record.rating}/5 stars`,
        body: record.comment?.substring(0, 100) || null,
        link: "/alumni/dashboard",
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
