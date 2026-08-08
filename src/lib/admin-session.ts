const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function base64UrlEncode(bytes: Uint8Array): string {
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256(value: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return base64UrlEncode(new Uint8Array(hash));
}

async function getSigningKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function signPayload(payload: string): Promise<string | null> {
  const key = await getSigningKey();
  if (!key) return null;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

/**
 * 세션 쿠키는 비밀번호가 아니라 만료시각을 담은 서명 토큰이다.
 * 쿠키가 유출되어도 비밀번호는 노출되지 않고, 토큰은 스스로 만료된다.
 */
export async function createAdminSession(): Promise<string | null> {
  const payload = base64UrlEncode(
    encoder.encode(JSON.stringify({ exp: Date.now() + ADMIN_SESSION_MAX_AGE * 1000 }))
  );
  const signature = await signPayload(payload);
  return signature && `${payload}.${signature}`;
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await signPayload(payload);
  if (!expected || !timingSafeEqual(signature, expected)) return false;

  try {
    const decoded: unknown = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    const exp = (decoded as { exp?: unknown }).exp;
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export async function verifyAdminPassword(input: unknown): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string" || !input) return false;
  return timingSafeEqual(await sha256(input), await sha256(expected));
}
