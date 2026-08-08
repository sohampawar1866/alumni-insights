"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";

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
      .contains("roles", ["moderator"])
      .order("created_at", { ascending: false });
    setModerators((data as Moderator[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void (async () => { await fetchModerators(); })();
  }, [fetchModerators]);

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-slate-700" /> Admin Control Panel
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create, update, and manage Alumni Committee, IIITN moderator credentials.
          </p>
        </div>
        <Button
          onClick={() => showForm ? setShowForm(false) : openCreate()}
          className="gap-2 shrink-0 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
        >
          {showForm ? "Cancel" : <><Plus className="w-4 h-4" /> Add Moderator</>}
        </Button>
      </div>

      {error && (
        <div className="text-xs font-medium text-red-900 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}
      {success && (
        <div className="text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {success}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 border border-slate-200 bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {editModId ? "Edit Moderator Account" : "New Moderator Account"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Display Name
              </label>
              <Input
                required
                placeholder="e.g. Dr. Mehta"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Institutional Email (@iiitn.ac.in)
              </label>
              <Input
                required
                type="email"
                disabled={!!editModId}
                placeholder="mehta@iiitn.ac.in"
                pattern=".*@iiitn\.ac\.in$"
                title="Email must end with @iiitn.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
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
          <Button 
            type="submit" 
            disabled={formLoading}
            className="w-full"
          >
            {formLoading ? "Saving..." : editModId ? "Save Changes" : "Create Moderator"}
          </Button>
        </form>
      )}

      {/* Moderator List */}
      <div className="border-2 border-slate-900 bg-white rounded-xl shadow-[5px_5px_0px_#0f172a] overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center items-center">
            <div className="h-8 w-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
          </div>
        ) : moderators.length === 0 ? (
          <div className="p-10 text-center text-sm font-medium text-slate-500">
            No active moderators found. Click &quot;Add Moderator&quot; above to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {moderators.map((mod) => (
              <div
                key={mod.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {mod.full_name || "Unnamed Moderator"}
                  </p>
                  <p className="text-xs text-slate-500">{mod.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => openEdit(mod)}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(mod.id, mod.full_name)}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
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
