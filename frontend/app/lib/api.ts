import { mockApiHandle } from "./mockData";

const DEFAULT_API_URL = "http://localhost:8000";

export function isMockMode(): boolean {
  return typeof process !== "undefined" && process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
}

export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return DEFAULT_API_URL;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const method = (options?.method ?? "GET").toUpperCase();
  const body = options?.body != null ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : undefined;

  if (isMockMode()) {
    try {
      const result = mockApiHandle(method, normalizedPath, body);
      return Promise.resolve(result as T);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  try {
    const base = getApiBaseUrl().replace(/\/$/, "");
    const url = `${base}/api/v1${path.startsWith("/") ? path : `/${path}`}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      let detail: string;
      try {
        const parsed = JSON.parse(text);
        detail = parsed.detail ?? text;
      } catch {
        detail = text || res.statusText;
      }
      throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
    if (res.status === 204) {
      return undefined as T;
    }
    return res.json() as Promise<T>;
  } catch (err) {
    // Fallback to mock when fetch fails (e.g. server unreachable)
    try {
      const result = mockApiHandle(method, normalizedPath, body);
      return Promise.resolve(result as T);
    } catch {
      throw err;
    }
  }
}
