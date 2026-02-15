const SESSION_KEY = "lis-session";

export function hasSession(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(SESSION_KEY);
}

export function setSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, "true");
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
