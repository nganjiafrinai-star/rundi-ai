import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://192.168.1.223:800"

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile"
                }
            }
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (!account || !profile) return false

                // Call backend ensure-user endpoint
                const ensureUserPayload = {
                    provider: account.provider,
                    provider_id: profile.sub || account.providerAccountId,
                    email: profile.email || user.email,
                    name: profile.name || user.name,
                    avatar: (profile as any).picture || user.image
                }

                console.log('[NextAuth] Calling ensure-user with:', ensureUserPayload)

                const response = await fetch(`${BACKEND_API_URL}/auth/ensure-user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Optionally add Authorization header with id_token
                        ...(account.id_token && { 'Authorization': `Bearer ${account.id_token}` })
                    },
                    body: JSON.stringify(ensureUserPayload)
                })

                if (!response.ok) {
                    console.error('[NextAuth] Ensure-user failed:', response.status, await response.text())
                    return false
                }

                const backendUser = await response.json()
                console.log('[NextAuth] Backend user:', backendUser)

                    // Store backendId on user object for jwt callback
                    ; (user as any).backendId = backendUser.id

                return true
            } catch (error) {
                console.error('[NextAuth] SignIn callback error:', error)
                return false
            }
        },

        async jwt({ token, user, account }) {
            // On initial sign in, user object is available
            if (user) {
                token.backendId = (user as any).backendId
            }
            return token
        },

        async session({ session, token }) {
            // Add backendId to session
            if (session.user) {
                session.user.backendId = token.backendId as string
            }
            return session
        }
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
