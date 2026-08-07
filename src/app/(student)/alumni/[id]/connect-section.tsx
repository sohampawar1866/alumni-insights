"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/connect-dialog";
import { CheckCircle2, MessageSquarePlus, BellOff, Clock } from "lucide-react";
import Link from "next/link";

export function ConnectSection({
  alumniId,
  alumniName,
  mentorshipAvailable,
  hasExistingRequest,
}: {
  alumniId: string;
  alumniName: string;
  mentorshipAvailable: boolean;
  hasExistingRequest: boolean;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already sent a request, show status instead of button
  if (hasExistingRequest) {
    return (
      <div className="bg-blue-50 border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_#0f172a] space-y-1.5">
        <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-600" /> Request Already Sent
        </p>
        <p className="text-xs text-slate-600">
          You have an active or pending request with this mentor.{" "}
          <Link href="/dashboard/requests" className="font-bold text-slate-900 underline hover:text-slate-700">
            View your requests &rarr;
          </Link>
        </p>
      </div>
    );
  }

  // If mentor is not available, show unavailability notice instead of button
  if (!mentorshipAvailable) {
    return (
      <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_#0f172a] space-y-1.5">
        <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <BellOff className="w-4 h-4 text-slate-500" /> Mentor Currently Unavailable
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">
          This alumnus has temporarily paused mentorship requests. Check back later or{" "}
          <Link href="/search" className="font-bold text-slate-700 underline hover:text-slate-900">
            browse other available mentors
          </Link>
          .
        </p>
      </div>
    );
  }

  // If just succeeded in sending
  if (success) {
    return (
      <div className="bg-emerald-50 border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_#0f172a] space-y-1">
        <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Request sent successfully!
        </p>
        <p className="text-xs text-slate-600">
          Track the response status in your{" "}
          <Link href="/dashboard/requests" className="font-bold text-slate-900 underline hover:text-slate-700">
            requests dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <Button
        size="lg"
        className="w-full sm:w-auto px-8 gap-2"
        onClick={() => setShowDialog(true)}
      >
        <MessageSquarePlus className="w-4 h-4" /> Request Mentorship Session
      </Button>

      {showDialog && (
        <ConnectDialog
          alumniId={alumniId}
          alumniName={alumniName}
          onClose={() => setShowDialog(false)}
          onSuccess={() => {
            setShowDialog(false);
            setSuccess(true);
          }}
        />
      )}
    </>
  );
}
