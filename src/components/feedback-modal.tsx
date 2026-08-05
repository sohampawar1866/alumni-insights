"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";

type Props = {
  requestId: string;
  alumniId: string;
  alumniName: string;
  onClose: () => void;
  onSubmitted: () => void;
};

export function FeedbackModal({
  requestId,
  alumniId,
  alumniName,
  onClose,
  onSubmitted,
}: Props) {
  const supabase = createClient();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: insertError } = await supabase
      .from("session_feedback")
      .insert({
        request_id: requestId,
        student_id: user.id,
        alumni_id: alumniId,
        rating,
        comment: comment.trim() || null,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You've already submitted feedback for this session.");
      } else {
        setError(insertError.message);
      }
    } else {
      onSubmitted();
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] overflow-hidden">
        <div className="p-6 border-b-2 border-slate-900 bg-amber-400 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 font-heading">
              Rate Mentorship Session
            </h2>
            <p className="text-xs font-semibold text-slate-900/80 mt-1">
              Leave feedback for {alumniName}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-900/10 text-slate-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 bg-white">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:-translate-y-0.5 hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-slate-900"
                        : "fill-slate-100 text-slate-300"
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Optional Comments / Feedback
            </label>
            <textarea
              maxLength={500}
              rows={3}
              placeholder="What was most helpful about this session?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border-2 border-slate-900 bg-white p-3.5 text-sm font-semibold text-slate-900 shadow-[2px_2px_0px_#0f172a] focus:shadow-[4px_4px_0px_#0f172a] outline-none transition-all resize-none"
            />
            <p className="text-xs text-slate-400 text-right mt-1">
              {comment.length}/500
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-900 rounded-xl p-3 shadow-[2px_2px_0px_#0f172a]">
              <p className="text-xs font-bold text-red-900">
                {error}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t-2 border-slate-900">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={submitting}
            >
              Skip
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || rating === 0}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
