"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FirstLoginNudge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("alumni_password_nudge_dismissed");
    if (!dismissed) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("alumni_password_nudge_dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-5">
      <h3 className="font-semibold text-slate-900">Secure your account</h3>
      <p className="mt-1 text-sm text-slate-500">
        You are currently using a temporary password. We recommend changing it to something secure.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <Link href="/alumni/dashboard/settings" onClick={dismiss}>
          <Button size="sm">Change Password</Button>
        </Link>
        <Button size="sm" variant="ghost" onClick={dismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
