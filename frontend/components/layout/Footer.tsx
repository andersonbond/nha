import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto flex h-12 shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-[var(--border-subtle)] bg-[var(--background)] px-4 py-2 text-center text-xs text-[var(--foreground)]">
      <Link href="/privacy" className="hover:text-primary hover:underline">
        Privacy Policy
      </Link>
      <span className="text-[var(--border-subtle)]">|</span>
      <Link href="/terms" className="hover:text-primary hover:underline">
        Terms of Use
      </Link>
      <span className="text-[var(--border-subtle)]">|</span>
      <span>© {year} LIS. All rights reserved.</span>
    </footer>
  );
}
