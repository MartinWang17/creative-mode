import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const FREEBIES = ["/grow-1plc1-free-resource", "/grow-1plc2-free-resource"];

// Keeps the Supabase login session fresh on every page load.
export async function middleware(request: NextRequest) {
  // The PLC freebies are shared with capitals (/grow-1PLC1-free-resource); serve them for any casing of the path.
  const path = request.nextUrl.pathname;
  const lower = path.toLowerCase();
  if (FREEBIES.includes(lower)) {
    if (path === lower) return NextResponse.next();
    const to = request.nextUrl.clone();
    to.pathname = lower;
    return NextResponse.rewrite(to);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/library/:path*", "/resources/:path*", "/api/resources/:path*", "/account/:path*", "/admin/:path*", "/api/breakdowns/:path*", "/api/portal", "/([gG][rR][oO][wW]-1[pP][lL][cC][12]-[fF][rR][eE][eE]-[rR][eE][sS][oO][uU][rR][cC][eE])"],
};
