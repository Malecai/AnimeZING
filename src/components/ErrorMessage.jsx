export default function ErrorMessage({
  message = "Unable to retrieve the data. Please try again.",
  onRetry,
}) {
  return (
    <div className="panel-border mx-auto flex max-w-md flex-col items-center gap-4 bg-paper p-8 text-center">
      <span className="grid h-12 w-12 place-items-center border-[3px] border-ink bg-zing font-display text-2xl text-paper">
        !
      </span>
      <p className="font-semibold text-ink">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="panel-border-sm bg-ink px-5 py-2 font-semibold text-paper transition-colors hover:bg-zing"
        >
          Try again
        </button>
      )}
    </div>
  );
}
