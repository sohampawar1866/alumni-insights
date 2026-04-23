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
      <div className="border-l-8 border-primary pl-4">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-foreground">Add Alumni</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">
          Create a single alumni account. Credentials will be shown after creation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border-4 border-foreground p-8 shadow-[8px_8px_0px_#000]"
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">
              Full Name
            </label>
            <Input
              required
              placeholder="Arjun Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">Email</label>
            <Input
              required
              type="email"
              placeholder="arjun@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">Branch</label>
            <Input
              required
              placeholder="CSE"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-foreground">
              Graduation Year
            </label>
            <Input
              required
              type="number"
              placeholder="2023"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            Temporary Password
          </label>
          <Input
            required
            type="text"
            placeholder="At least 8 characters"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
          />
        </div>

        {error && (
          <p className="text-sm font-bold uppercase tracking-tight text-white bg-destructive border-2 border-foreground p-3 shadow-[4px_4px_0px_#000]">
            {error}
          </p>
        )}

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? "Creating..." : "Create Alumni"}
        </Button>
      </form>

      {/* Credential Card */}
      {credential && (
        <div className="space-y-4 border-4 border-foreground bg-primary p-6 shadow-[8px_8px_0px_#000]">
          <div className="flex items-start justify-between sm:items-center flex-col sm:flex-row gap-4">
            <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
              ACCESS GRANTED
            </h3>
            <Button
              onClick={copyCredentials}
              className="text-xs font-black uppercase tracking-wider border-2 border-foreground bg-white text-foreground hover:bg-muted shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none"
            >
              {copied ? "COPIED TO CLIPBOARD!" : "COPY CREDENTIALS"}
            </Button>
          </div>
          <div className="space-y-2 text-sm font-bold text-foreground bg-white border-2 border-foreground p-4">
            <p>
              <span className="opacity-50 inline-block w-24">NAME:</span> {credential.name}
            </p>
            <p>
              <span className="opacity-50 inline-block w-24">EMAIL:</span> {credential.email}
            </p>
            <p>
              <span className="opacity-50 inline-block w-24">PASSWORD:</span>{" "}
              {credential.password}
            </p>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-foreground">
            Share these credentials securely via WhatsApp or email.
          </p>
        </div>
      )}
    </div>
  );
}
