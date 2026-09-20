import { NextRequest } from "next/server";
import { auth } from "./auth";

export interface AuthenticatedUser {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
}

/**
 * Extracts and verifies the user from JWT Bearer token or Better-Auth session cookies.
 */
export async function getSessionOrJwtUser(req: NextRequest): Promise<AuthenticatedUser | null> {
    try {
        // 1. Check Authorization Bearer header
        const authHeader = req.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            if (token) {
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
                    // Token verification through Better-Auth API fallback
                }
            }
        }

        // 2. Check Better-Auth session
        const session = await auth.api.getSession({
            headers: req.headers
        });

        if (session && session.user) {
            return {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: ((session.user as any).role || "student").toLowerCase().trim()
            };
        }

        // 3. Fallback header parsing
        const headerRole = req.headers.get("x-user-role");
        const headerEmail = req.headers.get("x-user-email");
        if (headerRole) {
            return {
                role: headerRole.toLowerCase().trim(),
                email: headerEmail || undefined
            };
        }
    } catch (err) {
        console.warn("serverAuth error:", err);
    }
    return null;
}
