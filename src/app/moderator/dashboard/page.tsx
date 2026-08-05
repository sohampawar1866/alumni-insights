"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Copy, Check, ShieldCheck } from "lucide-react";

type Credential = {
  name: string;
  email: string;
  password: string;
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
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 font-heading flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-slate-700" /> Add Alumni Member
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Create an alumni account. A shareable credential card will be generated upon creation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Full Name
            </label>
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

        <div className="grid sm:grid-cols-2 gap-4">
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
            <label className="text-xs font-semibold text-slate-700">
              Graduation Year
            </label>
            <Input
              required
              type="number"
              placeholder="2023"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Temporary Password
          </label>
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

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full gap-2"
        >
          {loading ? "Creating Alumni Account..." : "Create Alumni Account"}
        </Button>
      </form>

      {/* Credential Card */}
      {credential && (
        <div className="space-y-4 border border-emerald-200 bg-emerald-50/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Alumni Credentials Generated
              </h3>
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
          <p className="text-xs text-slate-600">
            Copy and send these credentials directly to the alumnus via WhatsApp or email.
          </p>
        </div>
      )}
    </div>
  );
}
