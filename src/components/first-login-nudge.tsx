"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export function FirstLoginNudge() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("alumni_password_nudge_dismissed");
    if (!dismissed) {
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
    <div className="fixed bottom-6 right-6 z-50 max-w-sm p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_#0f172a] animate-in slide-in-from-bottom-5 font-sans space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <h3 className="text-sm font-bold text-slate-900 font-heading">Security Notice</h3>
      </div>
      <p className="text-xs font-semibold text-slate-600 leading-relaxed">
        You are currently using a temporary passcode. Please update your password to keep your alumni account secure.
      </p>
      <div className="flex items-center gap-2 pt-1">
        <Link href="/alumni/dashboard/settings" onClick={dismiss}>
          <Button size="sm" className="text-xs h-9">Update Password</Button>
        </Link>
        <Button size="sm" variant="ghost" className="text-xs h-9" onClick={dismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
