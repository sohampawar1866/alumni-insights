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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bulk CSV Import</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload a CSV file with alumni data. Required columns:{" "}
          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
            name
          </code>
          ,{" "}
          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
            email
          </code>
          . Optional:{" "}
          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
            branch
          </code>
          ,{" "}
          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
            graduation_year
          </code>
          ,{" "}
          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">
            password
          </code>
          .
        </p>
      </div>

      <form
        onSubmit={handleImport}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">
            CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading || !file} className="w-full">
          {loading ? "Importing..." : "Import Alumni"}
        </Button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Success summary */}
          {result.success.length > 0 && (
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-emerald-800">
                  ✅ {result.success.length} accounts created
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadCredentialCSV}
                  className="text-xs"
                >
                  Download Credential CSV
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {result.success.map((r, i) => (
                  <p key={i} className="text-xs text-emerald-700">
                    {r.name} — {r.email}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Error summary */}
          {result.errors.length > 0 && (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 shadow-sm space-y-2">
              <h3 className="text-sm font-semibold text-red-800">
                ⚠️ {result.errors.length} rows failed
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-xs text-red-700">
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
