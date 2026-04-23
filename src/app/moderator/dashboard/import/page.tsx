"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

type ImportResult = {
  success: { name: string; email: string; password: string }[];
  errors: { row: number; message: string }[];
};

export default function BulkImportPage() {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const text = await file.text();
    const lines = text.trim().split("\n");

    if (lines.length < 2) {
      setError("CSV must have a header row and at least one data row.");
      setLoading(false);
      return;
    }

    // Parse header
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const nameIdx = header.indexOf("name");
    const emailIdx = header.indexOf("email");
    const branchIdx = header.indexOf("branch");
    const yearIdx = header.indexOf("graduation_year");
    const passwordIdx = header.indexOf("password");

    if (nameIdx === -1 || emailIdx === -1) {
      setError('CSV must have "name" and "email" columns.');
      setLoading(false);
      return;
    }

    // Parse rows
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      return {
        full_name: cols[nameIdx] || "",
        email: cols[emailIdx] || "",
        branch: branchIdx !== -1 ? cols[branchIdx] || "" : "",
        graduation_year:
          yearIdx !== -1 ? parseInt(cols[yearIdx]) || null : null,
        password:
          passwordIdx !== -1 && cols[passwordIdx]
            ? cols[passwordIdx]
            : generatePassword(),
      };
    });

    const successList: ImportResult["success"] = [];
    const errorList: ImportResult["errors"] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.email || !row.full_name) {
        errorList.push({ row: i + 2, message: "Missing name or email" });
        continue;
      }

      const { data, error: fnError } = await supabase.functions.invoke(
        "create-alumni",
        { body: row }
      );

      if (fnError || data?.error) {
        errorList.push({
          row: i + 2,
          message: data?.error || fnError?.message || "Unknown error",
        });
      } else {
        successList.push({
          name: row.full_name,
          email: row.email,
          password: row.password,
        });
      }
    }

    setResult({ success: successList, errors: errorList });
    setLoading(false);
  };

  const downloadCredentialCSV = () => {
    if (!result) return;
    const csvContent = [
      "name,email,password,login_url",
      ...result.success.map(
        (r) =>
          `"${r.name}","${r.email}","${r.password}","${window.location.origin}/alumni/login"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alumni-credentials-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="border-l-8 border-secondary pl-4">
        <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-foreground">Bulk CSV Import</h1>
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-2">
          Upload a CSV file with alumni data. Required columns:{" "}
          <code className="text-xs bg-foreground text-white px-1.5 py-0.5 rounded-none font-black ml-1">
            name
          </code>
          ,{" "}
          <code className="text-xs bg-foreground text-white px-1.5 py-0.5 rounded-none font-black ml-1">
            email
          </code>
          . Optional:{" "}
          <code className="text-xs bg-muted text-foreground border-2 border-foreground px-1.5 py-0.5 rounded-none font-black ml-1">
            branch
          </code>
          ,{" "}
          <code className="text-xs bg-muted text-foreground border-2 border-foreground px-1.5 py-0.5 rounded-none font-black ml-1">
            graduation_year
          </code>
          ,{" "}
          <code className="text-xs bg-muted text-foreground border-2 border-foreground px-1.5 py-0.5 rounded-none font-black ml-1">
            password
          </code>
          .
        </p>
      </div>

      <form
        onSubmit={handleImport}
        className="space-y-6 border-4 border-foreground bg-white p-8 shadow-[8px_8px_0px_#000]"
      >
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm font-bold text-foreground border-2 border-foreground p-2 shadow-[2px_2px_0px_#000] focus-visible:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-2 file:border-foreground file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-primary file:text-foreground hover:file:bg-primary/80 transition-colors cursor-pointer"
          />
        </div>

        {error && (
          <p className="text-sm font-bold uppercase tracking-tight text-white bg-destructive border-2 border-foreground p-3 shadow-[4px_4px_0px_#000]">
            {error}
          </p>
        )}

        <Button 
          type="submit" 
          disabled={loading || !file} 
          className="w-full font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
        >
          {loading ? "Importing..." : "Import Alumni"}
        </Button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Success summary */}
          {result.success.length > 0 && (
            <div className="border-4 border-foreground bg-primary p-6 shadow-[8px_8px_0px_#000] space-y-4">
              <div className="flex items-start justify-between sm:items-center flex-col sm:flex-row gap-4 border-b-4 border-foreground pb-4">
                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">
                  ✅ {result.success.length} accounts created
                </h3>
                <Button
                  onClick={downloadCredentialCSV}
                  className="text-xs font-black uppercase tracking-wider border-2 border-foreground bg-white text-foreground hover:bg-muted shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all rounded-none"
                >
                  Download Credential CSV
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {result.success.map((r, i) => (
                  <p key={i} className="text-sm font-bold uppercase tracking-wider text-foreground bg-white border-2 border-foreground p-2 shadow-[2px_2px_0px_#000]">
                    {r.name} — {r.email}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Error summary */}
          {result.errors.length > 0 && (
            <div className="border-4 border-foreground bg-destructive text-white p-6 shadow-[8px_8px_0px_#000] space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tight pb-4 border-b-4 border-foreground">
                ⚠️ {result.errors.length} rows failed
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-sm font-bold uppercase tracking-wider bg-white text-foreground border-2 border-foreground p-2 shadow-[2px_2px_0px_#000]">
                    Row {err.row}: {err.message}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function generatePassword(): string {
  const chars =
    "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}
