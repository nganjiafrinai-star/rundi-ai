import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            backendId?: string
        } & DefaultSession["user"]
    }

    interface User extends DefaultUser {
        backendId?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        backendId?: string
    }
}
