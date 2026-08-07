"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, FileSpreadsheet, Download, Info } from "lucide-react";

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

  const downloadSampleTemplate = () => {
    const csvContent = [
      "name,email,company,role,branch,graduation_year,city",
      'Arjun Sharma,arjun.sharma@example.com,Google,Senior Software Engineer,CSE,2022,Bengaluru',
      'Priya Patel,priya.patel@example.com,Microsoft,Product Manager,ECE,2021,Hyderabad',
      'Rohan Gupta,rohan.gupta@example.com,Amazon,SDE-II,CSE,2020,Pune',
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alumni-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Template Downloaded", {
      description: "Sample alumni-import-template.csv saved."
    });
  };

  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

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
    setProgress(null);

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
    const companyIdx = header.indexOf("company");
    const roleIdx = header.indexOf("role");
    const branchIdx = header.indexOf("branch");
    const yearIdx = header.indexOf("graduation_year");
    const cityIdx = header.indexOf("city");
    const passwordIdx = header.indexOf("password");

    if (nameIdx === -1 || emailIdx === -1) {
      setError('CSV must have "name" and "email" columns.');
      setLoading(false);
      return;
    }

    const seenEmailsInFile = new Set<string>();
    const rows = lines.slice(1).map((line, idx) => {
      const cols = line.split(",").map((c) => c.trim());
      return {
        rowNum: idx + 2,
        full_name: cols[nameIdx] || "",
        email: cols[emailIdx]?.toLowerCase() || "",
        company: companyIdx !== -1 ? cols[companyIdx] || "" : "",
        role: roleIdx !== -1 ? cols[roleIdx] || "" : "",
        branch: branchIdx !== -1 ? cols[branchIdx] || "" : "",
        graduation_year: yearIdx !== -1 ? parseInt(cols[yearIdx]) || null : null,
        city: cityIdx !== -1 ? cols[cityIdx] || "" : "",
        password: passwordIdx !== -1 && cols[passwordIdx] ? cols[passwordIdx] : generatePassword(),
      };
    });

    const successList: ImportResult["success"] = [];
    const errorList: ImportResult["errors"] = [];
    const BATCH_SIZE = 5;
    let processed = 0;

    setProgress({ done: 0, total: rows.length });

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);

      // Pre-filter duplicates within the file before sending batch
      const validBatch = batch.filter((row) => {
        if (!row.email || !row.full_name) {
          errorList.push({ row: row.rowNum, message: "Missing required name or email field" });
          return false;
        }
        if (seenEmailsInFile.has(row.email)) {
          errorList.push({ row: row.rowNum, message: `Duplicate email "${row.email}" in CSV file (skipped)` });
          return false;
        }
        seenEmailsInFile.add(row.email);
        return true;
      });

      // Send the valid batch concurrently
      const batchResults = await Promise.allSettled(
        validBatch.map((row) =>
          supabase.functions
            .invoke("create-alumni", { body: row })
            .then((res: { data: { error?: string } | null; error: { message: string } | null }) => ({
              row,
              data: res.data,
              fnError: res.error,
            }))
        )
      );

      batchResults.forEach((result) => {
        if (result.status === "fulfilled") {
          const { row, data, fnError } = result.value;
          if (fnError || data?.error) {
            errorList.push({
              row: row.rowNum,
              message: data?.error || fnError?.message || "User creation failed (email may already exist)",
            });
          } else {
            successList.push({ name: row.full_name, email: row.email, password: row.password });
          }
        } else {
          errorList.push({ row: 0, message: "Network error during batch processing" });
        }
      });

      processed += batch.length;
      setProgress({ done: processed, total: rows.length });
    }

    setResult({ success: successList, errors: errorList });
    setLoading(false);
    setProgress(null);

    if (successList.length > 0) {
      toast.success("Import Completed", {
        description: `Created ${successList.length} alumni accounts.`
      });
    }
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
      <div className="pb-6 border-b-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-slate-700" /> Bulk Alumni CSV Import
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Batch import alumni profiles using a CSV file. Required columns: <code className="text-xs font-bold bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">name</code>, <code className="text-xs font-bold bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">email</code>.
          </p>
        </div>
        <Button
          onClick={downloadSampleTemplate}
          variant="outline"
          className="shrink-0 gap-2 bg-amber-400 border-2 border-slate-900 text-slate-900 font-bold text-xs shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 transition-all"
        >
          <Download className="w-4 h-4" /> Download Sample CSV Template
        </Button>
      </div>

      {/* Info Callout about Duplicates */}
      <div className="bg-blue-50/80 border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_#0f172a] text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-2 font-bold text-slate-900 font-heading">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          Duplicate Prevention & Deduplication
        </div>
        <p className="leading-relaxed">
          The system uses email addresses as unique identifiers. If the CSV contains duplicate emails or an email is already registered in the system, it will be <strong>safely skipped</strong> and reported in the summary below without stopping the rest of your import.
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
          className="w-full mt-2 font-bold text-xs shadow-[3px_3px_0px_#0f172a]"
        >
          {progress
            ? `Importing ${progress.done} of ${progress.total} records...`
            : loading
            ? "Starting Import..."
            : "Start Bulk Import"}
        </Button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Success summary */}
          {result.success.length > 0 && (
            <div className="bg-emerald-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-emerald-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-heading">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {result.success.length} Alumni Accounts Created
                </h3>
                <Button
                  onClick={downloadCredentialCSV}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs bg-white border-2 border-slate-900 text-slate-900 font-bold shadow-[2px_2px_0px_#0f172a]"
                >
                  <Download className="w-3.5 h-3.5" /> Download Shareable Credentials CSV
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {result.success.map((r, i) => (
                  <p key={i} className="text-xs font-mono bg-white border border-slate-300 rounded-lg p-2 text-slate-800">
                    {r.name} &bull; {r.email}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Error summary */}
          {result.errors.length > 0 && (
            <div className="bg-red-50 border-2 border-slate-900 rounded-2xl p-6 shadow-[5px_5px_0px_#0f172a] space-y-4">
              <h3 className="text-sm font-bold text-red-900 flex items-center gap-1.5 border-b-2 border-red-200 pb-3 font-heading">
                <AlertTriangle className="w-5 h-5 text-red-600" /> {result.errors.length} Rows Skipped / Failed
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {result.errors.map((err, i) => (
                  <p key={i} className="text-xs font-semibold text-red-800 bg-white border border-red-200 rounded-lg p-2">
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
