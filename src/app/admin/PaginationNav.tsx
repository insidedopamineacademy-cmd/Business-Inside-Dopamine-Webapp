import Link from "next/link";

export default function PaginationNav({
  label,
  nextHref,
  previousHref,
}: {
  label: string;
  nextHref: string | null;
  previousHref: string | null;
}) {
  const baseClassName =
    "type-mono inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-medium)] px-5 text-[var(--color-text)] no-underline transition-opacity duration-200";
  const disabledClassName = `${baseClassName} cursor-not-allowed opacity-40`;

  return (
    <nav aria-label={label} className="mt-5 flex items-center justify-between gap-3">
      {previousHref ? (
        <Link href={previousHref} rel="prev" className={`${baseClassName} hover:opacity-75`}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Previous
        </span>
      )}

      {nextHref ? (
        <Link href={nextHref} rel="next" className={`${baseClassName} hover:opacity-75`}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Next
        </span>
      )}
    </nav>
  );
}
