import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-background relative overflow-hidden font-sans">
      <div className="w-full max-w-2xl bg-white border-8 border-foreground p-12 md:p-20 shadow-[16px_16px_0px_var(--color-foreground)] relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-[6rem] md:text-[8rem] font-black uppercase tracking-tighter text-destructive leading-none mb-4 -rotate-3 drop-shadow-[6px_6px_0px_var(--color-foreground)]">
          HALT
        </h1>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-background bg-foreground px-6 py-2 mb-6 rotate-1">
          UNAUTHORIZED ACCESS
        </h2>
        <p className="text-lg md:text-xl font-bold uppercase tracking-wide text-foreground mb-10 max-w-lg border-4 border-destructive p-4 bg-muted text-left">
          <span className="block text-destructive font-black mb-2">ERROR_CODE: WRONG_DOMAIN</span>
          You must sign in using a valid IIIT Nagpur institutional email address (@iiitn.ac.in). Personal accounts are not permitted.
        </p>
        <Link
          href="/login"
          className="group inline-flex h-16 items-center justify-center bg-primary border-4 border-foreground px-10 text-xl font-black uppercase tracking-widest text-background shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_var(--color-foreground)] hover:bg-[#00cc50]"
        >
          RETURN TO LOGIN
        </Link>
      </div>
    </div>
  );
}
