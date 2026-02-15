"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hasSession } from "@/app/lib/session";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (hasSession()) {
      setAllowed(true);
      return;
    }
    router.replace("/login");
    setAllowed(false);
  }, [router]);

  if (allowed === null || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-sm text-[var(--foreground)]/70">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
