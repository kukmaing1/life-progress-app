export function ProgressBar({ completed, planned }: { completed: number; planned: number }) {
  const segments = Math.max(planned, 1);

  return (
    <div className="flex gap-1.5" role="progressbar" aria-valuenow={completed} aria-valuemax={planned}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-pill transition-colors ${
            i < completed ? "bg-gold shadow-glow" : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}
