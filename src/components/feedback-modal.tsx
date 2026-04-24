"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)]">
        <div className="p-6 border-b-4 border-foreground bg-secondary">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
            RATE SESSION
          </h2>
          <p className="text-sm font-bold uppercase tracking-wider text-foreground mt-2">
            Leave feedback for {alumniName.split(' ')[0]}
          </p>
        </div>

        <div className="p-6 space-y-6 bg-background">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-black uppercase tracking-wide text-foreground">SESSION RATING</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:-translate-y-1 hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-[#fdc800] text-foreground"
                        : "fill-none text-foreground/30"
                    }`}
                    strokeWidth={2.5}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="block text-sm font-black uppercase tracking-wide text-foreground">
              DEBRIEF / COMMENTS (OPTIONAL)
            </label>
            <textarea
              maxLength={500}
              rows={3}
              placeholder="What was most helpful about this session?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex w-full border-2 border-foreground p-3 text-sm font-medium shadow-[4px_4px_0px_var(--color-foreground)] focus-visible:outline-none focus:bg-secondary transition-colors resize-none mb-1"
            />
            <p className="text-xs font-bold uppercase text-muted-foreground text-right w-full mt-2">
              {comment.length}/500
            </p>
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
              variant="outline" 
              onClick={onClose} 
              disabled={submitting}
              className="border-2 border-foreground"
            >
              SKIP DEBRIEF
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || rating === 0}
              className="bg-primary text-background shadow-[4px_4px_0px_var(--color-foreground)] hover:shadow-[2px_2px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              {submitting ? "UPLOADING..." : "SUBMIT LOG"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
