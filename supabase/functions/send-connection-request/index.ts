import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  Deno.env.get("SITE_URL") || "",
  "http://localhost:3000",
].filter(Boolean);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: { user: student } } = await supabase.auth.getUser();
    if (!student) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller is a student or alumni
    const { data: profile } = await supabase
      .from("profiles")
      .select("roles")
      .eq("id", student.id)
      .single();

    if (!profile || (!profile.roles?.includes("student") && !profile.roles?.includes("alumni"))) {
      return new Response(JSON.stringify({ error: "Only students and alumni can send connection requests" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { alumni_id, message } = await req.json();

    if (!alumni_id || !message) {
      return new Response(JSON.stringify({ error: "Missing alumni_id or message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check weekly limit
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const { count: requestsSentThisWeek } = await adminSupabase
      .from("connection_requests")
      .select("*", { count: "exact", head: true })
      .eq("student_id", student.id)
      .gte("created_at", weekStart.toISOString());

    const weeklyLimit = parseInt(Deno.env.get("STUDENT_WEEKLY_REQUEST_LIMIT") || "10");

    if (requestsSentThisWeek && requestsSentThisWeek >= weeklyLimit) {
      return new Response(JSON.stringify({ error: "Weekly request limit reached. Please try again next week." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify alumni is available for mentorship
    const { data: alumniProfile } = await adminSupabase
      .from("profiles")
      .select("roles, mentorship_available")
      .eq("id", alumni_id)
      .single();

    if (!alumniProfile || !alumniProfile.roles?.includes("alumni")) {
      return new Response(JSON.stringify({ error: "Target user is not an alumni" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!alumniProfile.mentorship_available) {
      return new Response(JSON.stringify({ error: "This alumni is not currently open to mentorship requests" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if a pending or accepted request already exists
    const { data: existingRequests } = await adminSupabase
      .from("connection_requests")
      .select("status")
      .eq("student_id", student.id)
      .eq("alumni_id", alumni_id)
      .in("status", ["pending", "accepted"]);

    if (existingRequests && existingRequests.length > 0) {
      return new Response(JSON.stringify({ error: "You already have an active or pending request with this alumni" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert request using service role since we disabled insert RLS for students
    const { error: insertError } = await adminSupabase
      .from("connection_requests")
      .insert({
        student_id: student.id,
        alumni_id,
        message,
        status: "pending",
      });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});