import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Decorative bold background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-50 point-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary rounded-full blur-[100px] opacity-50 point-events-none" />

      <div className="w-full max-w-2xl bg-muted border-8 border-foreground p-12 md:p-20 shadow-[16px_16px_0px_var(--color-foreground)] relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-[8rem] md:text-[12rem] font-black uppercase tracking-tighter text-foreground leading-none mb-4 -rotate-2 drop-shadow-[8px_8px_0px_var(--color-foreground)]">
          404
        </h1>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-background bg-foreground px-6 py-2 mb-6 rotate-1">
          PAGE NOT FOUND
        </h2>
        <p className="text-lg md:text-xl font-bold uppercase tracking-wide text-foreground mb-10 max-w-lg border-4 border-dashed border-foreground p-4 bg-background">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="group inline-flex h-16 items-center justify-center bg-primary border-4 border-foreground px-10 text-xl font-black uppercase tracking-widest text-background shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_var(--color-foreground)] hover:bg-[#00cc50]"
        >
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
