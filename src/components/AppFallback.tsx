export function AppFallback() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
        <div className="w-12 h-12 border-4 border-brand/60 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Loading experience…</p>
      </div>
    </div>
  );
}
