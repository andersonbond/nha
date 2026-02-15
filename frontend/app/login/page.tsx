"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { setSession, hasSession } from "@/app/lib/session";

const LoginScene = dynamic(
  () =>
    import("@/components/login/LoginScene").then((mod) => ({
      default: mod.LoginScene,
    })),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (hasSession()) {
      router.replace("/");
      return;
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSession();
    router.replace("/");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f0f4f2] px-4 text-[var(--foreground)]">
      {/* 3D parcel grid background */}
      <div className="fixed inset-0 z-0">
        <LoginScene />
      </div>
      {/* Gradient overlay: calmer center, soft vignette at edges */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(255,255,255,0.4) 50%, rgba(240,244,242,0.85) 100%)`,
        }}
      />
      {/* Glassmorphic login card */}
      <div className="relative z-10 w-full max-w-sm space-y-8 rounded-2xl border border-white/20 bg-white/70 p-8 shadow-xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-black/20">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.jpg"
            alt="LIS Logo"
            width={120}
            height={120}
            className="rounded-lg object-contain"
            priority
          />
          <h1 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
            Lot Information System
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground)]/70">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1 w-full rounded-md border border-white/30 bg-white/50 px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-white/5"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-white/30 bg-white/50 px-3 py-2 pr-10 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-white/5"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[var(--foreground)]/60 hover:bg-white/20 hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-transparent"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden />
                ) : (
                  <EyeIcon className="h-5 w-5" aria-hidden />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white/50 dark:focus:ring-offset-white/5"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
