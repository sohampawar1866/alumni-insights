"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AlumniSettingsPage() {
  const supabase = createClient();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="border-l-8 border-primary pl-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground">Settings</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">
          Update your account password.
        </p>
      </div>

      <form
        onSubmit={handleChangePassword}
        className="space-y-6 border-4 border-foreground bg-white p-8 shadow-[8px_8px_0px_var(--color-foreground)]"
      >
        <h2 className="text-sm font-black uppercase tracking-wider text-foreground border-b-4 border-foreground pb-3">
          Change Password
        </h2>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            New Password
          </label>
          <Input
            required
            type="password"
            minLength={8}
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            Confirm New Password
          </label>
          <Input
            required
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] rounded-none focus-visible:ring-0 focus-visible:border-primary text-base font-bold h-12"
          />
        </div>

        {error && (
          <div className="border-4 border-foreground bg-destructive text-background p-4 shadow-[4px_4px_0px_var(--color-foreground)]">
            <p className="text-sm font-black uppercase tracking-widest">{error}</p>
          </div>
        )}

        {success && (
          <div className="border-4 border-foreground bg-primary text-foreground p-4 shadow-[4px_4px_0px_var(--color-foreground)]">
            <p className="text-sm font-black uppercase tracking-widest">✅ Password updated successfully.</p>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="h-14 px-10 bg-secondary text-foreground border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] text-lg font-black uppercase tracking-widest hover:-translate-y-1 hover:translate-x-1 hover:shadow-[12px_12px_0px_var(--color-foreground)] transition-all rounded-none"
          >
            {loading ? "UPDATING..." : "UPDATE PASSWORD"}
          </Button>
        </div>
      </form>
    </div>
  );
}
