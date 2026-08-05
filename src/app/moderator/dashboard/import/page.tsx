"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, FileSpreadsheet, Download } from "lucide-react";

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
    if (!file) {
      toast.error("No file selected", {
        description: "Please attach a CSV file to import."
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    toast.info("Importing Records", {
      description: "Processing alumni records..."
    });

    const text = await file.text();
    const lines = text.trim().split("\n");

    if (lines.length < 2) {
      setError("CSV must have a header row and at least one data row.");
      toast.error("Format Error", {
        description: "CSV must have a header row and at least one data row."
      });
      setLoading(false);
      return;
    }

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
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div className="pb-6 border-b-2 border-slate-900">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-slate-700" /> Bulk Alumni CSV Import
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Upload a CSV file containing alumni accounts. Required header columns: <code className="text-xs font-bold bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">name</code>, <code className="text-xs font-bold bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">email</code>.
        </p>
      </div>

      <form
        onSubmit={handleImport}
        className="space-y-4 bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a]"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-xs font-medium text-slate-900 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_#0f172a] file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-2 file:border-slate-900 file:text-xs file:font-bold file:bg-amber-400 file:text-slate-900 cursor-pointer"
          />
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-900 rounded-xl p-3 text-xs font-bold text-red-900 shadow-[2px_2px_0px_#0f172a]">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading || !file} 
          className="w-full mt-2"
        >
          {loading ? "Importing Accounts..." : "Start Bulk Import"}
        </Button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Success summary */}
          {result.success.length > 0 && (
            <div className="bg-emerald-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a] space-y-4">
              <div className="flex items-center justify-between gap-4 border-b-2 border-emerald-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {result.success.length} Alumni Accounts Created
                </h3>
                <Button
                  onClick={downloadCredentialCSV}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs bg-white border-slate-900"
                >
                  <Download className="w-3.5 h-3.5" /> Download Credential CSV
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {result.success.map((r, i) => (
                  <p key={i} className="text-xs font-mono bg-white border border-slate-200 rounded-lg p-2 text-slate-800">
                    {r.name} &bull; {r.email}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Error summary */}
          {result.errors.length > 0 && (
            <div className="bg-red-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a] space-y-4">
              <h3 className="text-sm font-bold text-red-900 flex items-center gap-1.5 border-b-2 border-red-200 pb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" /> {result.errors.length} Rows Failed
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-xs font-medium text-red-800 bg-white border border-red-200 rounded-lg p-2">
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
