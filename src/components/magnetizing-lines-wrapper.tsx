"use client";

import dynamic from "next/dynamic";

// Must be in a Client Component to use ssr: false
const MagnetizingLinesCanvas = dynamic(() => import("@/components/magnetizing-lines"), { ssr: false });

export default function MagnetizingLinesWrapper() {
  return <MagnetizingLinesCanvas />;
}
