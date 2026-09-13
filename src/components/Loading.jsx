export default function Loading({ label = "Loading anime..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20" role="status">
      <div className="h-14 w-14 animate-spin rounded-full border-[5px] border-ink border-t-zing" />
      <p className="font-display text-sm uppercase tracking-widest text-ink">
        {label}
      </p>
    </div>
  );
}
