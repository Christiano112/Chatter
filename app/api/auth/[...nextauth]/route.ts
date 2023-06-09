import NextAuth from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { randomUUID, randomBytes } from "crypto";

export const authOptions: NextAuthOptions = {
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
        colorScheme: "dark", // "auto | dark | light"
        brandColor: "#543EE0", // hex value
        logo: "/chatter-logo.png", // path to logo img
        buttonText: "#543EE0", // hex value
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        //  strategy: "database", // where session is stored
        maxAge: 2 * 24 * 60 * 60, // 2 days
        updateAge: 12 * 60 * 60, // 12 hours
        generateSessionToken: () => {
            return randomUUID?.() || randomBytes(32).toString("hex");
        },
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("signIn", { user, account, profile, email, credentials });
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
            if (url.startsWith(baseUrl + "/signup")) return baseUrl + "/signup";
            if (url.startsWith(baseUrl + "/error")) return baseUrl + "/error";
            if (url.startsWith(baseUrl + "/verify-request")) return baseUrl + "/verify-request";
            if (url.startsWith(baseUrl + "/new-user")) return baseUrl + "/new-user";

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
    //     signIn: '../login',
    //     signOut: '../login',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // },
};

const handler = NextAuth({
    ...authOptions,
});

export { handler as GET, handler as POST };
