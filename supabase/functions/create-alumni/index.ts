// Supabase Edge Function: create-alumni
// Creates an alumni account and adds the 'alumni' role to their profile.
// If the user already exists (e.g., they're a student), appends 'alumni' to their roles array.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  Deno.env.get("SITE_URL") || "",
  "http://localhost:3000",
].filter(Boolean);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify the caller is a moderator
    const authHeader = req.headers.get("Authorization")!;
    const callerClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: { headers: { Authorization: authHeader } },
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    const {
      data: { user: caller },
    } = await callerClient.auth.getUser();
    if (!caller)
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    const { data: callerProfile } = await callerClient
      .from("profiles")
      .select("roles")
      .eq("id", caller.id)
      .single();

    if (!callerProfile?.roles?.includes("moderator")) {
      return new Response(
        JSON.stringify({ error: "Only moderators can create alumni accounts." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { full_name, email, branch, graduation_year, password } =
      await req.json();

    if (!email || !full_name || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: full_name, email, password" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- OPTIMIZED: Look up user by email directly instead of listing all users ---
    // First check the profiles table (covers existing users with profiles)
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, roles, full_name, branch, graduation_year")
      .eq("email", email.toLowerCase())
      .single();

    let userId: string;

    if (existingProfile) {
      // User already exists with a profile
      userId = existingProfile.id;
      const currentRoles: string[] = existingProfile.roles || [];

      if (currentRoles.includes("alumni")) {
        return new Response(
          JSON.stringify({ error: "This email already has an alumni account." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Append the alumni role and update profile fields
      await supabaseAdmin
        .from("profiles")
        .update({
          roles: [...currentRoles, "alumni"],
          full_name: full_name || existingProfile.full_name,
          branch: branch || existingProfile.branch || null,
          graduation_year: graduation_year || existingProfile.graduation_year || null,
        })
        .eq("id", userId);
    } else {
      // No existing profile - create new auth user
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (createError || !newUser?.user) {
        // Check if it's a duplicate email error (user exists in auth but no profile)
        if (createError?.message?.includes("already been registered")) {
          return new Response(
            JSON.stringify({ error: "A user with this email already exists in auth. Contact admin." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({
            error: createError?.message || "Failed to create auth user.",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = newUser.user.id;

      // Create profile with alumni role
      await supabaseAdmin.from("profiles").insert({
        id: userId,
        email,
        full_name,
        roles: ["alumni"],
        branch: branch || null,
        graduation_year: graduation_year || null,
      });
    }

    // Log the action
    await supabaseAdmin.from("audit_logs").insert({
      moderator_id: caller.id,
      action: `Created alumni account for ${full_name} (${email})`,
    });

    return new Response(
      JSON.stringify({ success: true, user_id: userId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
