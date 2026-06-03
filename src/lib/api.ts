// Thin fetch wrapper around the backend REST API (replaces the Supabase client).
// In dev, requests go to a relative `/api/...` path which Vite proxies to the
// Node server. Set VITE_API_URL to point at the server directly in production.
const BASE = import.meta.env.VITE_API_URL ?? '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response had no JSON body
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// Build a query string from defined params only.
export function qs(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== '');
  if (!entries.length) return '';
  return '?' + new URLSearchParams(entries as [string, string][]).toString();
}
