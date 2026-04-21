"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/connect-dialog";

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
      <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 inline-block">
        <p className="text-sm font-medium text-emerald-800">
          ✅ Request sent successfully!
        </p>
        <p className="text-xs text-emerald-600 mt-1">
          You can track the status in your dashboard.
        </p>
      </div>
    );
  }

  return (
    <>
      <Button
        size="lg"
        className="w-full sm:w-auto px-8"
        onClick={() => setShowDialog(true)}
      >
        Connect with {alumniName.split(" ")[0]}
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
