import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-24 text-center bg-slate-50">
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-black text-slate-200">404</h1>
        <h2 className="text-2xl font-bold text-slate-900">Page not found</h2>
        <p className="text-slate-500 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
          >
            Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
