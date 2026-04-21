"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

type ConnectDialogProps = {
  alumniId: string;
  alumniName: string;
  onClose: () => void;
  onSuccess: () => void;
};

const TEMPLATES = [
  "Informational chat: Hi! I'd love to learn more about your career journey and experience.",
  "Resume review: Hello! Could you spare a few minutes to review my resume for SDE roles?",
  "Referral ask: Hi! I'm applying to your company and would appreciate a referral if possible.",
  "Company insight: Hello! I'm curious about the work culture and projects at your company."
];

export function ConnectDialog({
  alumniId,
  alumniName,
  onClose,
  onSuccess,
}: ConnectDialogProps) {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: fnError } = await supabase.functions.invoke(
      "send-connection-request",
      { body: { alumni_id: alumniId, message } }
    );

    if (fnError || data?.error) {
      setError(data?.error || fnError?.message || "Failed to send request");
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">
            Connect with {alumniName}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Send a brief message explaining what you need help with.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t, i) => {
                const label = t.split(":")[0];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(t.split(": ")[1])}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Message</label>
              <textarea
                required
                maxLength={200}
                rows={4}
                placeholder="Hi! I'm currently a junior in CSE and would love to get your advice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Keep it professional and concise.</span>
                <span>{message.length}/200</span>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !message.trim()}>
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
