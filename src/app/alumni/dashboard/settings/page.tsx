"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Lock } from "lucide-react";

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
    <div className="max-w-xl mx-auto space-y-6 font-sans">
      <div className="pb-6 border-b-2 border-slate-900">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading flex items-center gap-2">
          <Lock className="w-6 h-6 text-slate-700" /> Account Security
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Update your alumni account password.
        </p>
      </div>

      <form
        onSubmit={handleChangePassword}
        className="space-y-4 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a]"
      >
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b-2 border-slate-100 pb-2">
          Change Password
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            New Password
          </label>
          <Input
            required
            type="password"
            minLength={8}
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Confirm New Password
          </label>
          <Input
            required
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-900 rounded-xl p-3 text-xs font-bold text-red-900 shadow-[2px_2px_0px_#0f172a]">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border-2 border-emerald-900 rounded-xl p-3 text-xs font-bold text-emerald-900 shadow-[2px_2px_0px_#0f172a] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Password updated successfully.
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
