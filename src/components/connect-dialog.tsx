"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { MentorshipRequestSchema } from "@/types";
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
  "Company insight: Hello! I'm curious about the work culture and projects at your company.",
];

export function ConnectDialog({
  alumniId,
  alumniName,
  onClose,
  onSuccess,
}: ConnectDialogProps) {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [requestType, setRequestType] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setError(null);

    // Validate payload schema
    const validation = MentorshipRequestSchema.safeParse({
      alumni_id: alumniId,
      message: message.trim(),
    });

    if (!validation.success) {
      const errText = validation.error.issues[0]?.message || "Invalid inputs";
      setError(errText);
      toast.error(errText);
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("You must be logged in to send a request.");

      // Attempt edge function call first
      const { data, error: fnError } = await supabase.functions.invoke(
        "send-connection-request",
        { body: { alumni_id: alumniId, message: message.trim(), request_type: requestType } }
      );

      if (fnError || data?.error) {
        // Direct Database insert fallback
        const { error: dbError } = await supabase
          .from("connection_requests")
          .insert({
            student_id: user.id,
            alumni_id: alumniId,
            request_type: requestType,
            message: message.trim(),
            note: message.trim(),
            status: "pending",
          });

        if (dbError) throw new Error(dbError.message);
      }

      toast.success(`Mentorship request sent to ${alumniName}!`);
      onSuccess();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to send connection request";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] overflow-hidden">
        <div className="p-6 border-b-2 border-slate-900 bg-amber-400 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 font-heading">
              Connect with {alumniName}
            </h2>
            <p className="text-xs font-semibold text-slate-900/80 mt-1">
              Send a structured mentorship request note.
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-1.5 rounded-xl border-2 border-slate-900/0 hover:border-slate-900 hover:bg-slate-900/10 text-slate-900 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t, i) => {
                  const label = t.split(":")[0];
                  const typeKey = label.toLowerCase().replace(/\s+/g, "_");
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setMessage(t.split(": ")[1]); setRequestType(typeKey); }}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all ${requestType === typeKey ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800 hover:bg-amber-300"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Custom Request Note</label>
              <textarea
                required
                maxLength={200}
                rows={4}
                placeholder="Hi! I'm currently a CSE student at IIITN and would love your advice on..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-900 bg-white p-3.5 text-sm font-semibold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:shadow-[4px_4px_0px_#0f172a] outline-none transition-all resize-none"
              />
              <div className="flex justify-between text-xs font-semibold text-slate-400 mt-1">
                <span>Maximum 200 characters</span>
                <span>{message.length}/200</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-900 rounded-xl p-3 shadow-[2px_2px_0px_#0f172a]">
              <p className="text-xs font-bold text-red-900">
                Error: {error}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-slate-900">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <Send className="w-4 h-4" />
              {loading ? "Sending Request..." : "Send Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
