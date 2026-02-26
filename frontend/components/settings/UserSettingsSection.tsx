"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { clearSession } from "@/app/lib/session";

const DISPLAY_NAME_KEY = "lis-user-display-name";
const EMAIL_KEY = "lis-user-email";

export function UserSettingsSection() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDisplayName(localStorage.getItem(DISPLAY_NAME_KEY) ?? "");
    setEmail(localStorage.getItem(EMAIL_KEY) ?? "");
  }, []);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window === "undefined") return;
    localStorage.setItem(DISPLAY_NAME_KEY, displayName.trim());
    localStorage.setItem(EMAIL_KEY, email.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="space-y-6">
      <section
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
        aria-labelledby="user-profile-heading"
      >
        <h2 id="user-profile-heading" className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
          <UserCircleIcon className="h-5 w-5" aria-hidden />
          Profile
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Stored locally until a user API is available.
        </p>
        <form onSubmit={handleSaveProfile} className="mt-4 max-w-md space-y-3">
          <div>
            <label htmlFor="settings-display-name" className="block text-sm font-medium text-[var(--foreground)]/80">
              Display name
            </label>
            <input
              id="settings-display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="settings-email" className="block text-sm font-medium text-[var(--foreground)]/80">
              Email
            </label>
            <input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {saved ? "Saved" : "Save profile"}
          </button>
        </form>
      </section>

      <section
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
        aria-labelledby="user-security-heading"
      >
        <h2 id="user-security-heading" className="text-sm font-semibold text-[var(--foreground)]">
          Session
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Sign out of the application.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
        >
          Log out
        </button>
      </section>
    </div>
  );
}
