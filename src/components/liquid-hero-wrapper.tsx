"use client";

import dynamic from "next/dynamic";

// Must be in a Client Component to use ssr: false
const LiquidHeroCanvas = dynamic(() => import("@/components/liquid-hero"), { ssr: false });

export default function LiquidHeroWrapper() {
  return <LiquidHeroCanvas />;
}
