"use client";

import { useState } from "react";
import {
  MapPinIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "@/app/lib/theme-provider";
import { AddressConfigSection } from "@/components/settings/AddressConfigSection";
import { UserSettingsSection } from "@/components/settings/UserSettingsSection";
import { LISSettingsSection } from "@/components/settings/LISSettingsSection";

type SettingsSection = "address" | "user" | "system" | "appearance";

const SECTIONS: { id: SettingsSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "address", label: "Address configuration", icon: MapPinIcon },
  { id: "user", label: "User settings", icon: UserCircleIcon },
  { id: "system", label: "Lot information system", icon: Cog6ToothIcon },
  { id: "appearance", label: "Appearance", icon: PaintBrushIcon },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("address");
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="shrink-0 md:w-56">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground)]/70">
          Application preferences
        </p>
        <nav className="mt-6 flex flex-col gap-0.5" aria-label="Settings sections">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeSection === id
                  ? "bg-primary text-primary-foreground"
                  : "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-w-0 flex-1 space-y-6">
        {activeSection === "address" && <AddressConfigSection />}
        {activeSection === "user" && <UserSettingsSection />}
        {activeSection === "system" && <LISSettingsSection />}
        {activeSection === "appearance" && (
          <>
            <section
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] p-4 shadow-subtle dark:shadow-subtle-dark"
              aria-labelledby="appearance-heading"
            >
              <h2 id="appearance-heading" className="text-sm font-semibold text-[var(--foreground)]">
                Theme
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
          </>
        )}
      </div>
    </div>
  );
}
