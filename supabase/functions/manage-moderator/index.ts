// Supabase Edge Function: manage-moderator
// Creates, edits, or deletes moderator accounts.
// Only callable by the admin.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify the caller is an admin
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

    if (!callerProfile?.roles?.includes("admin")) {
      return new Response(
        JSON.stringify({ error: "Only admins can manage moderator accounts." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, moderator_id, email, password, full_name } =
      await req.json();

    // ============ CREATE ============
    if (action === "create") {
      if (!email || !password || !full_name) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: email, password, full_name" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;

        const { data: existingProfile } = await supabaseAdmin
          .from("profiles")
          .select("roles, full_name")
          .eq("id", userId)
          .single();

        const currentRoles: string[] = existingProfile?.roles || [];

        if (currentRoles.includes("moderator")) {
          return new Response(
            JSON.stringify({ error: "This email already has a moderator account." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Append moderator role (preserve existing name if not explicitly provided)
        await supabaseAdmin
          .from("profiles")
          .update({
            roles: [...currentRoles, "moderator"],
            full_name: full_name || existingProfile?.full_name,
          })
          .eq("id", userId);

        // Update the password so moderator can log in
        await supabaseAdmin.auth.admin.updateUserById(userId, { password });
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
            JSON.stringify({ error: createError?.message || "Failed to create user." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        userId = newUser.user.id;

        await supabaseAdmin.from("profiles").insert({
          id: userId,
          email,
          full_name,
          roles: ["moderator"],
        });
      }

      return new Response(
        JSON.stringify({ success: true, user_id: userId }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============ EDIT ============
    if (action === "edit") {
      if (!moderator_id) {
        return new Response(
          JSON.stringify({ error: "Missing moderator_id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updates: Record<string, unknown> = {};
      if (full_name) updates.full_name = full_name;

      if (Object.keys(updates).length > 0) {
        await supabaseAdmin
          .from("profiles")
          .update(updates)
          .eq("id", moderator_id);
      }

      if (password) {
        await supabaseAdmin.auth.admin.updateUserById(moderator_id, {
          password,
        });
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ============ DELETE ============
    if (action === "delete") {
      if (!moderator_id) {
        return new Response(
          JSON.stringify({ error: "Missing moderator_id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Remove the 'moderator' role instead of deleting the user entirely
      // (they might also be a student or alumni)
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("roles")
        .eq("id", moderator_id)
        .single();

      const currentRoles: string[] = profile?.roles || [];
      const updatedRoles = currentRoles.filter((r) => r !== "moderator");

      if (updatedRoles.length === 0) {
        // No other roles — delete the user entirely
        await supabaseAdmin.from("profiles").delete().eq("id", moderator_id);
        await supabaseAdmin.auth.admin.deleteUser(moderator_id);
      } else {
        // Just remove the moderator role
        await supabaseAdmin
          .from("profiles")
          .update({ roles: updatedRoles })
          .eq("id", moderator_id);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use: create, edit, delete" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
