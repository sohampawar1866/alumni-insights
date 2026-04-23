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
    <div className="fixed bottom-6 right-6 z-50 max-w-sm p-6 bg-secondary border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] animate-in slide-in-from-bottom-5">
      <div className="absolute -top-3 -right-3 bg-primary border-2 border-foreground w-8 h-8 flex items-center justify-center font-black rotate-12">
        !
      </div>
      <h3 className="text-xl font-black uppercase tracking-tighter text-foreground mb-2">Secure Account</h3>
      <p className="mt-1 text-sm font-bold text-foreground/80 uppercase tracking-wide leading-relaxed">
        You are currently using a temporary passcode. Change it to remain secure.
      </p>
      <div className="mt-6 flex items-center gap-4">
        <Link href="/alumni/dashboard/settings" onClick={dismiss}>
          <Button size="sm" variant="default" className="shadow-[4px_4px_0px_var(--color-foreground)] text-xs h-10 px-4 bg-background">Update Now</Button>
        </Link>
        <Button size="sm" variant="ghost" className="border-2 border-transparent hover:border-foreground text-xs h-10 px-4 font-black uppercase" onClick={dismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}
