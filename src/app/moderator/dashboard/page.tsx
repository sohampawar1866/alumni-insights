"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Copy, Check, ShieldCheck, Award, CheckCircle2, XCircle } from "lucide-react";
import { MembershipBadge, MembershipType } from "@/components/membership-badge";

type Credential = {
  name: string;
  email: string;
  password: string;
};

type MembershipRequest = {
  id: string;
  alumni_id: string;
  membership_type: string;
  transaction_id: string | null;
  proof_url: string | null;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
    branch: string | null;
    graduation_year: number | null;
  } | null;
};

export default function AlumniManagementPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credential, setCredential] = useState<Credential | null>(null);
  const [copied, setCopied] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [password, setPassword] = useState("");
  const [initialMembership, setInitialMembership] = useState<MembershipType>("none");

  // Membership Requests State
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    const { data } = await supabase
      .from("membership_requests")
      .select("id, alumni_id, membership_type, transaction_id, proof_url, status, created_at, profiles:alumni_id(full_name, email, branch, graduation_year)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (data) {
      setRequests(data as unknown as MembershipRequest[]);
    }
    setLoadingRequests(false);
  }, [supabase]);

  useEffect(() => {
    void (async () => { await fetchRequests(); })();
  }, [fetchRequests]);

  const handleApproveRequest = async (request: MembershipRequest, newStatus: "approved" | "rejected") => {
    try {
      // 1. Update request status
      const { error: reqErr } = await supabase
        .from("membership_requests")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", request.id);

      if (reqErr) throw reqErr;

      // 2. If approved, update alumnus profile membership_type
      if (newStatus === "approved") {
        const { error: profileErr } = await supabase
          .from("profiles")
          .update({ membership_type: request.membership_type })
          .eq("id", request.alumni_id);

        if (profileErr) throw profileErr;

        // 3. Create notification for alumnus
        await supabase.from("notifications").insert({
          user_id: request.alumni_id,
          type: "membership_approved",
          title: "Membership Verified & Activated! 👑",
          body: `Your IIIT Nagpur Alumni Association membership (${request.membership_type}) has been verified and granted by the committee.`,
          link: "/alumni/dashboard",
        });
      }

      fetchRequests();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      alert("Error updating membership request: " + errMsg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCredential(null);

    const { data, error: fnError } = await supabase.functions.invoke(
      "create-alumni",
      {
        body: {
          full_name: fullName,
          email,
          branch,
          graduation_year: parseInt(graduationYear),
          password,
        },
      }
    );

    if (fnError) {
      setError(fnError.message || "Failed to create alumni account.");
      setLoading(false);
      return;
    }

    if (data?.error) {
      setError(data.error);
      setLoading(false);
      return;
    }

    // Set initial membership tier if selected
    if (initialMembership !== "none" && data?.user_id) {
      await supabase
        .from("profiles")
        .update({ membership_type: initialMembership })
        .eq("id", data.user_id);
    }

    setCredential({
      name: fullName,
      email,
      password,
    });

    // Reset form
    setFullName("");
    setEmail("");
    setBranch("");
    setGraduationYear("");
    setPassword("");
    setInitialMembership("none");
    setLoading(false);
  };

  const copyCredentials = () => {
    if (!credential) return;
    const text = `Alumni Insights Login\nName: ${credential.name}\nEmail: ${credential.email}\nPassword: ${credential.password}\nLogin at: ${window.location.origin}/alumni/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 font-sans">
      {/* Header */}
      <div className="pb-6 border-b-2 border-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-indigo-600" /> Alumni Association Management
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review membership payment verification requests and create new verified alumni accounts.
        </p>
      </div>

      {/* Membership Verification Queue */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[6px_6px_0px_#0f172a] space-y-6">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Membership Verification Queue
            </h2>
            <p className="text-xs text-slate-500">
              Verify alumni payment transactions submitted via in-app portal or Google Form.
            </p>
          </div>
          <button
            onClick={fetchRequests}
            className="text-xs font-bold text-slate-900 bg-slate-100 border-2 border-slate-900 px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#0f172a] hover:bg-slate-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
          >
            Refresh Queue
          </button>
        </div>

        {loadingRequests ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading requests...</div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-900 hover:shadow-[3px_3px_0px_#0f172a] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {req.profiles?.full_name || "Alumnus"}
                    </span>
                    <span className="text-xs text-slate-500">({req.profiles?.email})</span>
                    <MembershipBadge type={req.membership_type} size="sm" />
                  </div>
                  <div className="text-xs text-slate-600 space-x-3">
                    <span><strong>Branch:</strong> {req.profiles?.branch || "N/A"}</span>
                    <span><strong>Txn ID:</strong> {req.transaction_id || "N/A"}</span>
                  </div>
                  {req.proof_url && (
                    <a
                      href={req.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline font-medium block pt-0.5"
                    >
                      View Attached Proof Link
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {req.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(req, "approved")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 rounded-xl"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Activate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveRequest(req, "rejected")}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs gap-1 rounded-xl"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </Button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                        req.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No pending membership verification requests found.
          </div>
        )}
      </div>

      {/* Add Alumni Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-slate-700" /> Create Alumni Account
          </h2>
          <p className="text-xs text-slate-500">
            Create account credentials for IIIT Nagpur passouts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <Input
                required
                placeholder="e.g. Arjun Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <Input
                required
                type="email"
                placeholder="arjun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Branch</label>
              <Input
                required
                placeholder="e.g. CSE"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Graduation Year</label>
              <Input
                required
                type="number"
                placeholder="2023"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Assign Membership</label>
              <select
                value={initialMembership}
                onChange={(e) => setInitialMembership(e.target.value as MembershipType)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 bg-white"
              >
                <option value="none">Non-Member</option>
                <option value="core">Core Team Member</option>
                <option value="lifetime">Lifetime Member</option>
                <option value="5_year">5-Year Member</option>
                <option value="2_year">2-Year Member</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Temporary Password</label>
            <Input
              required
              type="text"
              placeholder="At least 8 characters"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-xs font-medium text-red-900 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full gap-2 rounded-xl font-bold">
            {loading ? "Creating Alumni Account..." : "Create Alumni Account"}
          </Button>
        </form>

        {/* Credential Card */}
        {credential && (
          <div className="space-y-4 border border-emerald-200 bg-emerald-50/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Alumni Credentials Generated</h3>
              </div>
              <Button
                onClick={copyCredentials}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs bg-white border-slate-200"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Card
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg p-4 text-slate-800">
              <p><span className="text-slate-400 font-sans font-semibold inline-block w-20">Name:</span> {credential.name}</p>
              <p><span className="text-slate-400 font-sans font-semibold inline-block w-20">Email:</span> {credential.email}</p>
              <p><span className="text-slate-400 font-sans font-semibold inline-block w-20">Password:</span> {credential.password}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
