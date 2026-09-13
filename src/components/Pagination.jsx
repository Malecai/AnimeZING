export default function Pagination({ page, hasNextPage, onPageChange }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="panel-border-sm bg-paper px-4 py-2 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>
      <span className="font-display text-lg text-ink">Page {page}</span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="panel-border-sm bg-ink px-4 py-2 font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
