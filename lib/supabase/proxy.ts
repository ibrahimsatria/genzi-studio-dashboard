import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session and read the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;
  const isAuthRoute = path.startsWith("/sign-in") || path.startsWith("/sign-up");
  const isProtected = path.startsWith("/dashboard");

  // GENZI_BYPASS_AUTH is a dev-only escape hatch used to QA the dashboard
  // before email confirmation is configured. Ignored in production builds
  // even if the env var is accidentally set.
  const bypass =
    process.env.GENZI_BYPASS_AUTH === "1" &&
    process.env.NODE_ENV !== "production";

  if (!user && isProtected && !bypass) {
    url.pathname = "/sign-in";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    url.pathname = "/dashboard";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
