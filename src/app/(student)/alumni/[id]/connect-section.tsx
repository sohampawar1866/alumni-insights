"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/connect-dialog";
import { CheckCircle2, MessageSquarePlus } from "lucide-react";

export function ConnectSection({
  alumniId,
  alumniName,
}: {
  alumniId: string;
  alumniName: string;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="bg-emerald-50 border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_#0f172a] space-y-1">
        <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Request sent successfully!
        </p>
        <p className="text-xs text-slate-600">
          Track the response status in your dashboard requests tab.
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
