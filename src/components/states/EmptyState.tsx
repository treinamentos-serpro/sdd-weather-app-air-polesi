interface EmptyStateProps {
  title?: string;
  hint?: string;
}

function EmptyState({
  title = 'Nenhuma cidade encontrada',
  hint = 'Confira a grafia ou tente outro nome de cidade.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
      <span aria-hidden="true" className="text-4xl">
        🔍
      </span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-sm text-white/75">{hint}</p>
    </div>
  );
}

export default EmptyState;
