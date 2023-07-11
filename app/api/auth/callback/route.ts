import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { DatabaseType } from "@/utils/types";

export async function GET(request: NextRequest) {
    const supabase = createRouteHandlerClient<DatabaseType>({ cookies });
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const searchParams = useSearchParams();
    const authCode = searchParams.get("code");

    if (code || authCode) {
        await supabase.auth.exchangeCodeForSession(String(code));
    }

    // URL to redirect to after sign in process completes
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);

    // return NextResponse.redirect(requestUrl.origin);
}
