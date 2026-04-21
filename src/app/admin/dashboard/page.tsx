"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Moderator = {
  id: string;
  full_name: string | null;
  email: string;
};

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [showForm, setShowForm] = useState(false);
  const [editModId, setEditModId] = useState<string | null>(null);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchModerators = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "moderator")
      .order("created_at", { ascending: false });
    setModerators((data as Moderator[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchModerators();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditModId(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const openEdit = (mod: Moderator) => {
    setEditModId(mod.id);
    setFullName(mod.full_name || "");
    setEmail(mod.email);
    setPassword("");
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    setSuccess(null);

    const action = editModId ? "edit" : "create";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { action, full_name: fullName };
    
    if (password) payload.password = password;

    if (action === "create") {
      payload.email = email;
    } else {
      payload.moderator_id = editModId;
    }

    const { data, error: fnError } = await supabase.functions.invoke(
      "manage-moderator",
      { body: payload }
    );

    if (fnError || data?.error) {
      setError(data?.error || fnError?.message || `Failed to ${action} moderator`);
    } else {
      setSuccess(`Moderator "${fullName}" ${action}d successfully.`);
      setShowForm(false);
      fetchModerators();
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: string, name: string | null) => {
    if (!confirm(`Delete moderator "${name || "Unknown"}"? This cannot be undone.`)) return;

    const { data, error: fnError } = await supabase.functions.invoke(
      "manage-moderator",
      { body: { action: "delete", moderator_id: id } }
    );

    if (fnError || data?.error) {
      setError(data?.error || fnError?.message || "Failed to delete");
    } else {
      fetchModerators();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Manage Moderators
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and remove moderator accounts.
          </p>
        </div>
        <Button onClick={() => showForm ? setShowForm(false) : openCreate()}>
          {showForm ? "Cancel" : "+ Add Moderator"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3">
          {success}
        </p>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-slate-700">
            {editModId ? "Edit Moderator Account" : "New Moderator Account"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">
                Display Name
              </label>
              <Input
                required
                placeholder="Dr. Mehta"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">
                Email
              </label>
              <Input
                required
                type="email"
                disabled={!!editModId}
                placeholder="mehta@iiitn.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              {editModId ? "New Password (Optional)" : "Password"}
            </label>
            <Input
              required={!editModId}
              type="text"
              minLength={8}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={formLoading}>
            {formLoading ? "Saving..." : editModId ? "Save Changes" : "Create Moderator"}
          </Button>
        </form>
      )}

      {/* Moderator List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          </div>
        ) : moderators.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            No moderators yet. Click &quot;+ Add Moderator&quot; to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {moderators.map((mod) => (
              <div
                key={mod.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {mod.full_name || "Unnamed"}
                  </p>
                  <p className="text-xs text-slate-500">{mod.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-600 hover:text-slate-900"
                    onClick={() => openEdit(mod)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(mod.id, mod.full_name)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
