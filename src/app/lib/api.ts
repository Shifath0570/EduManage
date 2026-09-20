/**
 * API client utilities for making JWT-authenticated requests across EduManage.
 */

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Retrieves the current user's JWT from Better-Auth /api/auth/token endpoint.
 */
export async function getAuthToken(): Promise<string | null> {
    const now = Date.now();
    // Return cached token if valid for at least 30 more seconds
    if (cachedToken && tokenExpiresAt > now + 30000) {
        return cachedToken;
    }

    try {
        if (typeof window === "undefined") {
            return null;
        }

        const res = await fetch("/api/auth/token", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        });

        if (res.ok) {
            const data = await res.json();
            if (data?.token) {
                cachedToken = data.token;
                // Cache for 5 minutes by default
                tokenExpiresAt = Date.now() + 5 * 60 * 1000;
                return cachedToken;
            }
        }
    } catch (err) {
        console.warn("Failed to retrieve JWT auth token:", err);
    }

    return cachedToken || null;
}

/**
 * Clears the cached JWT token (e.g. on logout).
 */
export function clearAuthTokenCache(): void {
    cachedToken = null;
    tokenExpiresAt = 0;
}

/**
 * Builds request headers including Authorization Bearer token when available.
 */
export async function getAuthHeaders(extraHeaders: Record<string, string> = {}): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
        ...extraHeaders,
    };

    const token = await getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Unified fetch wrapper that automatically attaches the JWT token header.
 */
export async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const token = await getAuthToken();

    const headers = new Headers(init?.headers || {});

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const modifiedInit: RequestInit = {
        ...init,
        headers,
    };

    return fetch(input, modifiedInit);
}
