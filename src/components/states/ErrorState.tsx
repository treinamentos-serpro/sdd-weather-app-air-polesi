interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

function ErrorState({
  message = 'Não foi possível carregar os dados do clima.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md"
      role="alert"
    >
      <span aria-hidden="true" className="text-4xl">
        ⚠️
      </span>
      <p className="text-sm font-medium text-white/85">{message}</p>
      <button
        className="min-h-11 rounded-lg bg-accent-500 px-5 py-2.5 font-medium text-white transition hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-night-900"
        onClick={onRetry}
        type="button"
      >
        Tentar novamente
      </button>
    </div>
  );
}

export default ErrorState;
