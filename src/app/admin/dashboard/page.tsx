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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-l-8 border-accent pl-4 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
            Manage Moderators
          </h1>
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">
            Create, edit, and remove moderator accounts.
          </p>
        </div>
        <Button 
          onClick={() => showForm ? setShowForm(false) : openCreate()}
          className="font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {showForm ? "Cancel" : "+ Add Moderator"}
        </Button>
      </div>

      {error && (
        <p className="text-sm font-bold uppercase tracking-tight text-white bg-destructive border-2 border-foreground p-3 shadow-[4px_4px_0px_#000]">{error}</p>
      )}
      {success && (
        <p className="text-sm font-bold uppercase tracking-tight text-foreground bg-[var(--color-primary)] border-2 border-foreground p-3 shadow-[4px_4px_0px_#000]">
          {success}
        </p>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border-4 border-foreground bg-white p-8 shadow-[8px_8px_0px_#000]"
        >
          <h2 className="text-lg font-black uppercase tracking-tight text-foreground bg-secondary border-2 border-foreground px-3 py-1 inline-block">
            {editModId ? "Edit Moderator Account" : "New Moderator Account"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-foreground">
                Display Name
              </label>
              <Input
                required
                placeholder="Dr. Mehta"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-foreground">
                Email
              </label>
              <Input
                required
                type="email"
                disabled={!!editModId}
                placeholder="mehta@iiitn.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2 pb-4">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">
              {editModId ? "New Password (Optional)" : "Password"}
            </label>
            <Input
              required={!editModId}
              type="text"
              minLength={8}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <Button 
            type="submit" 
            disabled={formLoading}
            className="w-full font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            {formLoading ? "Saving..." : editModId ? "Save Changes" : "Create Moderator"}
          </Button>
        </form>
      )}

      {/* Moderator List */}
      <div className="border-4 border-foreground bg-white shadow-[8px_8px_0px_#000] overflow-hidden mt-8">
        {loading ? (
          <div className="p-10 flex justify-center min-h-[200px] items-center">
            <div className="h-12 w-12 border-4 border-foreground border-t-primary rounded-none animate-[spin_1s_linear_infinite] shadow-[4px_4px_0px_#000]" />
          </div>
        ) : moderators.length === 0 ? (
          <div className="p-10 text-center text-sm font-black uppercase tracking-wider text-muted-foreground border-4 border-foreground m-4 shadow-[4px_4px_0px_#000]">
            No moderators yet. Click &quot;+ Add Moderator&quot; to create one.
          </div>
        ) : (
          <div className="divide-y-4 divide-foreground">
            {moderators.map((mod) => (
              <div
                key={mod.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 hover:bg-muted transition-colors gap-4"
              >
                <div>
                  <p className="text-lg font-black uppercase tracking-tight text-foreground bg-accent px-2 py-0.5 border-2 border-foreground inline-block mb-2 shadow-[2px_2px_0px_#000]">
                    {mod.full_name || "Unnamed"}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{mod.email}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all bg-white"
                    onClick={() => openEdit(mod)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all bg-destructive text-white hover:bg-destructive hover:text-white"
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
