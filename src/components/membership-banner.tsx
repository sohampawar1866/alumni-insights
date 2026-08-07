"use client";

import React, { useState } from "react";
import { Sparkles, Crown, ExternalLink, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { MembershipRequestSchema } from "@/types";

interface MembershipBannerProps {
  currentMembership?: string | null;
  alumniId: string;
  gformUrl?: string;
}

export function MembershipBanner({
  currentMembership = "none",
  alumniId,
  gformUrl = "https://forms.google.com",
}: MembershipBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [membershipType, setMembershipType] = useState("lifetime");
  const [transactionId, setTransactionId] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  const isMember =
    currentMembership &&
    ["core", "lifetime", "5_year", "2_year"].includes(currentMembership.toLowerCase());

  if (isMember) return null;

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = MembershipRequestSchema.safeParse({
      plan_type: membershipType,
      transaction_id: transactionId.trim(),
      receipt_url: proofUrl.trim() || undefined,
    });

    if (!validation.success) {
      const errText = validation.error.issues[0]?.message || "Please enter valid transaction details";
      toast.error(errText);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("membership_requests").insert({
        alumni_id: alumniId,
        membership_type: membershipType,
        transaction_id: transactionId.trim(),
        proof_url: proofUrl.trim() || null,
        status: "pending",
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Membership verification submitted! Admin will verify and activate your membership.");
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to submit membership request.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Banner Component */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-900/50 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Official IIIT Nagpur Alumni Association Membership
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-white">
            Unlock Official Membership Perks & Badges 🎓
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Support your alma mater, gain official verified association badges, get priority access to college events, reunions, and network directly with core committee leaders.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 z-10 w-full md:w-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl px-5 py-3 text-xs sm:text-sm shadow-md transition-all gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            Verify / Get Membership
          </button>
          {gformUrl && (
            <a
              href={gformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl px-4 py-3 text-xs sm:text-sm border border-white/10 transition-all gap-1.5"
            >
              Google Form Link
              <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
            </a>
          )}
        </div>
      </div>

      {/* Payment Proof Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Submit Membership Verification
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-slate-900">Submission Received!</h4>
                <p className="text-xs text-slate-600">
                  The alumni committee admin will review your transaction details and activate your membership badge shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProof} className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">Select Membership Plan</label>
                  <select
                    value={membershipType}
                    onChange={(e) => setMembershipType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:ring-2 focus:ring-slate-900 font-medium"
                  >
                    <option value="lifetime">Lifetime Member (Recommended)</option>
                    <option value="5_year">5-Year Member</option>
                    <option value="2_year">2-Year Member</option>
                    <option value="core">Core Team Member</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">
                    Payment Transaction ID / Reference No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UPI/123456789012 or UTR number"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700">
                    Screenshot / Drive Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    Alternatively, you can fill out the official committee Google Form directly:{" "}
                    <a
                      href={gformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline hover:text-blue-950"
                    >
                      Open Google Form
                    </a>
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit for Verification"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
