"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            How was your session?
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Leave feedback for <span className="font-medium text-slate-700">{alumniName}</span>
          </p>
        </div>

        {/* Star Rating */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-3xl transition-transform hover:scale-110 focus:outline-none"
              >
                {star <= (hoveredRating || rating) ? "⭐" : "☆"}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            Comment (optional)
          </label>
          <textarea
            maxLength={500}
            rows={3}
            placeholder="What was most helpful about this session?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
          <p className="text-xs text-slate-400 text-right">
            {comment.length}/500
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
}
