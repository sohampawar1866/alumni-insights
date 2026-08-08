"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Crown, GraduationCap, Menu, X, ArrowRight, Info } from "lucide-react";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-3 sm:top-4 z-50 w-full max-w-6xl mx-auto px-3 sm:px-6 font-sans">
      <div className="bg-white/95 border-2 border-slate-900 rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 shadow-[4px_4px_0px_#0f172a] backdrop-blur-md flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Title */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 group shrink min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-full"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
            <Image
              src="/images/iiitn.png"
              alt="IIIT Nagpur Logo"
              width={36}
              height={36}
              priority
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full border border-slate-200 shadow-xs"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-heading text-xs sm:text-base font-bold tracking-tight text-slate-900 leading-none truncate">
              <span className="sm:hidden">IIITN Alumni</span>
              <span className="hidden sm:inline">IIIT Nagpur Alumni Association</span>
            </span>
            <span className="text-[8px] sm:text-[10px] font-bold tracking-wider text-blue-600 uppercase mt-0.5 truncate">
              Official Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Controls (md and up) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            href="/about"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
          >
            About
          </Link>
          <Link
            href="/login"
            className="text-xs font-bold text-slate-900 border-2 border-slate-900 bg-white px-3.5 py-1.5 rounded-full hover:bg-amber-300 transition-all shadow-[2px_2px_0px_#0f172a] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
          >
            Student Login
          </Link>
          <Link
            href="/alumni/login"
            className="text-xs sm:text-sm font-bold bg-slate-900 text-white border-2 border-slate-900 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full hover:bg-slate-800 transition-all shadow-[2px_2px_0px_#0f172a] active:scale-[0.98] whitespace-nowrap flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-600 outline-none"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Alumni Sign In
          </Link>
        </div>

        {/* Mobile Action Pill & Hamburger Toggle (below md) */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <Link
            href="/alumni/login"
            className="text-[11px] font-bold bg-slate-900 text-white border-2 border-slate-900 px-2.5 py-1 rounded-full shadow-[2px_2px_0px_#0f172a] active:scale-95 transition-all flex items-center gap-1 whitespace-nowrap"
          >
            <Crown className="w-3 h-3 text-amber-400" />
            Alumni Login
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_#0f172a] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <Menu className="w-4 h-4" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Card Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[6px_6px_0px_#0f172a] space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
            Access Portals
          </p>

          <Link
            href="/alumni/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between bg-slate-900 text-white font-bold text-xs p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              Alumni Sign In / Join
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between bg-amber-400 text-slate-900 font-bold text-xs p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-900" />
              Student Login (@iiitn.ac.in)
            </span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between bg-slate-100 text-slate-800 font-bold text-xs p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] active:scale-[0.98] transition-all"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-600" />
              About Committee
            </span>
            <ArrowRight className="w-4 h-4 text-slate-600" />
          </Link>
        </div>
      )}
    </header>
  );
}
