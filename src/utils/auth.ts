export interface StoredUser {
  email: string;
  passwordHash?: string;
  password?: string;
  name?: string;
  role?: string;
}

export interface SessionUser {
  email: string;
  name: string;
  role: string;
  avatar: string;
}

const SESSION_KEY = "dataflow_session";
const USERS_KEY = "registered_users";

export const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop";

export async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getRegisteredUsers(): StoredUser[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function saveSession(user: SessionUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  // Compatibilidad con el layout anterior.
  localStorage.setItem("user", JSON.stringify({
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  }));
}

export function getSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (!parsed.email || !parsed.name || !parsed.role) return null;
    return {
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      avatar: parsed.avatar || defaultAvatar,
    };
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("user");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userAvatar");
  sessionStorage.clear();
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
