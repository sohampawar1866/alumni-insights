// Supabase Edge Function: create-alumni
// Creates an alumni account and adds the 'alumni' role to their profile.
// If the user already exists (e.g., they're a student), appends 'alumni' to their roles array.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
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

    // Check if a user with this email already exists in auth.users
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let userId: string;

    if (existingUser) {
      // User already exists in auth — just add the alumni role to their profile
      userId = existingUser.id;

      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("roles, full_name, branch, graduation_year")
        .eq("id", userId)
        .single();

      const currentRoles: string[] = existingProfile?.roles || [];

      if (currentRoles.includes("alumni")) {
        return new Response(
          JSON.stringify({ error: "This email already has an alumni account." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Append the alumni role and update profile fields (don't overwrite existing values with empty ones)
      await supabaseAdmin
        .from("profiles")
        .update({
          roles: [...currentRoles, "alumni"],
          full_name: full_name || existingProfile?.full_name,
          branch: branch || existingProfile?.branch || null,
          graduation_year: graduation_year || existingProfile?.graduation_year || null,
        })
        .eq("id", userId);
    } else {
      // Create new auth user
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (createError || !newUser?.user) {
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
