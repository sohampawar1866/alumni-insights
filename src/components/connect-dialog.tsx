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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)]">
        <div className="p-6 border-b-4 border-foreground bg-primary">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-background">
            CONNECT // {alumniName.split(' ')[0]}
          </h2>
          <p className="text-sm font-bold uppercase tracking-wider text-background mt-2">
            Send a brief message explaining what you need help with.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-background">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t, i) => {
                const label = t.split(":")[0];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(t.split(": ")[1])}
                    className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-muted border-2 border-foreground hover:bg-secondary hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--color-foreground)] transition-all"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wide text-foreground">PITCH / MESSAGE</label>
              <textarea
                required
                maxLength={200}
                rows={4}
                placeholder="Hi! I'm currently a junior in CSE and would love to get your advice..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex w-full border-2 border-foreground p-3 text-sm font-medium shadow-[4px_4px_0px_var(--color-foreground)] focus-visible:outline-none focus:bg-secondary transition-colors resize-none mb-1"
              />
              <div className="flex justify-between text-xs font-bold uppercase text-muted-foreground mt-2">
                <span>KEEP IT PROFESSIONAL.</span>
                <span>{message.length}/200</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive border-2 border-foreground p-3 shadow-[4px_4px_0px_var(--color-foreground)]">
              <p className="text-sm font-black text-background uppercase">
                ERROR: {error}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t-2 border-foreground border-dashed">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-2 border-foreground"
            >
              CANCEL
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !message.trim()}
              className="bg-primary text-background shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-[2px_2px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              {loading ? "SENDING..." : "DISPATCH REQUEST"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
