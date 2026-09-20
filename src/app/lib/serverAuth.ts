import { NextRequest } from "next/server";
import { auth } from "./auth";
import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AuthenticatedUser {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
}

let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS(baseUrl: string) {
    if (!jwksCache) {
        jwksCache = createRemoteJWKSet(new URL("/api/auth/jwks", baseUrl));
    }
    return jwksCache;
}

/**
 * Extracts and cryptographically verifies the user from Better-Auth session cookies or JWT Bearer tokens.
 * Strictly returns null if unauthenticated. Never trusts user-supplied headers or query parameters.
 */
export async function getSessionOrJwtUser(req: NextRequest): Promise<AuthenticatedUser | null> {
    try {
        // 1. Check Better-Auth session cookies / session headers
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (session?.user) {
            return {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: ((session.user as any).role || "student").toLowerCase().trim()
            };
        }

        // 2. Check Authorization Bearer header with cryptographic JWKS verification
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1]?.trim();
            if (token) {
                const baseUrl =
                    process.env.BETTER_AUTH_URL ||
                    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
                    (typeof window !== "undefined" ? (window as any).location?.origin : "") ||
                    "http://localhost:3000";

                try {
                    const JWKS = getJWKS(baseUrl);
                    const { payload } = await jwtVerify(token, JWKS);
                    if (payload) {
                        return {
                            id: (payload.sub || payload.id) as string,
                            email: payload.email as string,
                            name: payload.name as string,
                            role: ((payload.role as string) || "student").toLowerCase().trim()
                        };
                    }
                } catch {
                    // Fallback to internal Better-Auth verifyJWT if JWKS remote fetch fails
                    try {
                        const verified = await (auth.api as any).verifyJWT?.({
                            body: { token }
                        });
                        if (verified?.payload) {
                            return {
                                id: verified.payload.sub || verified.payload.id,
                                email: verified.payload.email,
                                name: verified.payload.name,
                                role: (verified.payload.role || "student").toLowerCase().trim()
                            };
                        }
                    } catch {
                        // Invalid token
                    }
                }
            }
        }
    } catch (err) {
        console.warn("serverAuth verification error:", err);
    }
    return null;
}
