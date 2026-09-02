function LoadingState() {
  return (
    <div
      aria-live="polite"
      className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md"
      role="status"
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-accent-400"
      />
      <p className="text-sm font-medium text-white/80">Carregando dados do clima…</p>
    </div>
  );
}

export default LoadingState;
