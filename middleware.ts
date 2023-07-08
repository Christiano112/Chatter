import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedPaths = ["/", "/login", "/signup"];
const protectedPaths = ["/profile", "/editor", "/drafts", "/feeds"];

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Check auth condition
    if (session?.user) {
        // Authentication successful, forward request to protected route.
        return res;
    }

    // Auth condition not met, redirect to login page.
    const redirectUrl = req.nextUrl.clone();
    if (!allowedPaths.includes(redirectUrl.pathname)) {
        redirectUrl.pathname = "/login";
    }

    if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
        redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    }

    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ["/drafts/:path*", "/feeds/:path*", "/editor/:path*", "/profile/:path*"],
};
