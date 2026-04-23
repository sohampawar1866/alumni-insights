export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="relative flex flex-col items-center justify-center space-y-8">
        <div className="w-16 h-16 border-8 border-foreground border-r-primary rounded-none animate-spin shadow-[8px_8px_0px_var(--color-foreground)] bg-white" />
        <div className="bg-primary text-background border-4 border-foreground px-6 py-2 shadow-[6px_6px_0px_var(--color-foreground)]">
          <h2 className="text-xl font-black uppercase tracking-widest animate-pulse">
            LOADING DATA...
          </h2>
        </div>
      </div>
    </div>
  );
}