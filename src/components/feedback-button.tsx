"use client";

import { useState } from "react";
import { FeedbackModal } from "@/components/feedback-modal";
import { CheckCircle, Star } from "lucide-react";

type Props = {
  requestId: string;
  alumniId: string;
  alumniName: string;
  hasFeedback: boolean;
};

export function FeedbackButton({
  requestId,
  alumniId,
  alumniName,
  hasFeedback,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(hasFeedback);

  if (submitted) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
        <CheckCircle className="w-4 h-4" strokeWidth={2.5} /> Feedback submitted
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-amber-300 border-2 border-slate-900 px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#0f172a] hover:bg-amber-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
      >
        <Star className="w-4 h-4" strokeWidth={2.5} /> Leave Feedback
      </button>
      {showModal && (
        <FeedbackModal
          requestId={requestId}
          alumniId={alumniId}
          alumniName={alumniName}
          onClose={() => setShowModal(false)}
          onSubmitted={() => {
            setSubmitted(true);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
