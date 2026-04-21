"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Alumni</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a single alumni account. Credentials will be shown after
          creation for you to share.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
              Full Name
            </label>
            <Input
              required
              placeholder="Arjun Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Email</label>
            <Input
              required
              type="email"
              placeholder="arjun@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Branch</label>
            <Input
              required
              placeholder="CSE"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">
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

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
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
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Alumni Account"}
        </Button>
      </form>

      {/* Credential Card */}
      {credential && (
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-800">
              ✅ Account Created
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCredentials}
              className="text-xs"
            >
              {copied ? "Copied!" : "Copy Credentials"}
            </Button>
          </div>
          <div className="space-y-1 text-sm text-emerald-900">
            <p>
              <span className="font-medium">Name:</span> {credential.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {credential.email}
            </p>
            <p>
              <span className="font-medium">Password:</span>{" "}
              {credential.password}
            </p>
          </div>
          <p className="text-xs text-emerald-600">
            Share these credentials with the alumnus via WhatsApp or email.
          </p>
        </div>
      )}
    </div>
  );
}
