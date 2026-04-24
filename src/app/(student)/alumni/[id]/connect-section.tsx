"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectDialog } from "@/components/connect-dialog";
import { CheckCircle } from "lucide-react";

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
      <div className="inline-block border-4 border-foreground bg-primary p-4 shadow-[4px_4px_0px_var(--color-foreground)]">
        <p className="text-sm font-black uppercase tracking-wider text-foreground">
          <CheckCircle className="w-4 h-4 inline-block mr-1" strokeWidth={2.5} /> Request sent successfully!
        </p>
        <p className="text-xs font-bold uppercase tracking-wider text-foreground mt-1">
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
