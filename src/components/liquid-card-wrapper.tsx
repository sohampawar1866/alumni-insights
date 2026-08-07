"use client";

import dynamic from "next/dynamic";

const LiquidCardCanvas = dynamic(() => import("@/components/liquid-card"), { ssr: false });

export default function LiquidCardWrapper() {
  return <LiquidCardCanvas />;
}
