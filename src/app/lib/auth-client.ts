import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL:
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
    plugins: [
        jwtClient()
    ]
});

<<<<<<< HEAD
export const { signIn, signUp, signOut, useSession } = authClient;
=======


>>>>>>> b88572d96ea733a1804a78636619141f053b7d0e
