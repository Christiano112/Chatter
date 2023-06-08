import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { randomUUID, randomBytes } from "crypto";

const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        // ...add more providers here
    ],
    debug: true,
    theme: {
        colorScheme: "auto", // "auto | dark | light"
        brandColor: "", // hex value
        logo: "", // path to logo img
        buttonText: "", // hex value
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        //  strategy: "database", // where session is stored
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 12 * 60 * 60, // 12 hours
        generateSessionToken: () => {
            return randomUUID?.() || randomBytes(32).toString("hex");
        },
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // if (account?.provider === "google") {
            //     return profile?.email_verified && profile?.email?.endsWith("@example.com")
            // }
            const isAllowedToSignIn = true;
            return isAllowedToSignIn ? true : false;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;

            // Allow signin pages to be restricted to users with access
            if (url.startsWith(baseUrl + "/auth/signin")) return baseUrl + "/auth/signin";
            if (url.startsWith(baseUrl + "/auth/error")) return baseUrl + "/auth/error";
            if (url.startsWith(baseUrl + "/auth/verify-request"))
                return baseUrl + "/auth/verify-request";
            if (url.startsWith(baseUrl + "/auth/new-user")) return baseUrl + "/auth/new-user";

            return baseUrl;
        },
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token to the token right after signin
            console.log("jwt", { token, account, profile });
            if (account?.accessToken) {
                token.accessToken = account.accessToken;
                token.id = account.id;
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            token.accessToken = token.accessToken;
            // user.id = token.id
            return session;
        },
    },
    // pages: {
    //     signIn: '/api/auth/[...nextauth]/page',
    //     signOut: '/auth/[...nextauth]/page',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // },
};