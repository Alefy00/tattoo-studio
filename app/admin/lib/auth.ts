export const AUTH_KEY = "tattoo_admin_auth";

export function signIn(name?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ name: name ?? "Admin", ts: Date.now() })
  );
  document.cookie = `${AUTH_KEY}=1; path=/; SameSite=Lax`;
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  document.cookie = `${AUTH_KEY}=; Max-Age=0; path=/; SameSite=Lax`;
}

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(AUTH_KEY);
}

export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(AUTH_KEY);
    if (!v) return null;
    return JSON.parse(v).name ?? null;
  } catch {
    return null;
  }
}
