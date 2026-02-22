"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/lib/theme-provider";
import { clearSession } from "@/app/lib/session";
import { apiFetch } from "@/app/lib/api";
import type { SearchResponse } from "@/app/lib/search";
import { SidebarToggle } from "./Sidebar";
import { SearchDropdown } from "@/components/search/SearchDropdown";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const SEARCH_DEBOUNCE_MS = 280;
const MIN_QUERY_LENGTH = 2;
const BLUR_DELAY_MS = 150;

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (phrase: string) => {
    if (phrase.trim().length < MIN_QUERY_LENGTH) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<SearchResponse>(
        `/search?q=${encodeURIComponent(phrase)}&limit=5`
      );
      setResults(data);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setResults(null);
      setLoading(false);
      return;
    }
    setOpen(true);
    debounceRef.current = setTimeout(() => {
      runSearch(query);
      debounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  const handleFocus = useCallback(() => {
    if (blurRef.current) {
      clearTimeout(blurRef.current);
      blurRef.current = null;
    }
    if (query.trim().length >= MIN_QUERY_LENGTH || results) setOpen(true);
  }, [query, results]);

  const handleBlur = useCallback(() => {
    blurRef.current = setTimeout(() => setOpen(false), BLUR_DELAY_MS);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        setResults(null);
      }
    },
    []
  );

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 md:gap-4 border-b border-[var(--border-subtle)] bg-[var(--background)] px-4 shadow-subtle dark:shadow-subtle-dark md:px-6">
      {onMenuClick && <SidebarToggle onClick={onMenuClick} />}
      {/* Search - center */}
      <div className="flex flex-1 justify-center max-w-xl mx-auto">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground)]/50" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, programs, applications, beneficiaries…"
            className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--background)] py-2 pl-10 pr-3 text-sm text-[var(--foreground)] placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Search"
          />
          <div id="search-results">
            <SearchDropdown
              query={query}
              results={results}
              loading={loading}
              open={open}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Right: username, theme toggle, logout */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm text-[var(--foreground)] truncate max-w-[120px] md:max-w-[180px]" title="User">
          <UserCircleIcon className="h-5 w-5 shrink-0 text-[var(--foreground)]/70" aria-hidden />
          User
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md p-2 text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <MoonIcon className="h-5 w-5" aria-hidden />
          ) : (
            <SunIcon className="h-5 w-5" aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" aria-hidden />
          Logout
        </button>
      </div>
    </header>
  );
}
