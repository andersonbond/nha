"use client";

import { useTheme } from "@/app/lib/theme-provider";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Application preferences
        </p>
      </div>

      <section
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
        aria-labelledby="appearance-heading"
      >
        <h2 id="appearance-heading" className="text-sm font-semibold text-[var(--foreground)]">
          Appearance
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <span className="text-sm text-[var(--foreground)]/80">Theme</span>
          <div className="flex rounded-md border border-[var(--border-subtle)] p-0.5">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                theme === "light"
                  ? "bg-primary text-primary-foreground"
                  : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded px-3 py-1.5 text-sm font-medium ${
                theme === "dark"
                  ? "bg-primary text-primary-foreground"
                  : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      </section>

      <section
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
        aria-labelledby="locale-heading"
      >
        <h2 id="locale-heading" className="text-sm font-semibold text-[var(--foreground)]">
          Language / Locale
        </h2>
        <p className="mt-2 text-sm text-[var(--foreground)]/70">
          Locale selection will be available in a future release. Default: English.
        </p>
      </section>
    </div>
  );
}
