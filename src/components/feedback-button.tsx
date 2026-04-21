"use client";

import { useState } from "react";
import { FeedbackModal } from "@/components/feedback-modal";

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
      <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">
        ✅ Feedback submitted
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        ⭐ Leave Feedback
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
