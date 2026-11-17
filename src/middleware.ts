import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

function hasSession(req: NextRequest): boolean {
  return SESSION_COOKIES.some((name) => Boolean(req.cookies.get(name)?.value));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = hasSession(req);

  const isAuthPage = pathname.startsWith("/auth");
  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff") ||
    // /customer itself is a public dashboard with a no-login lookup; every
    // deeper customer page (profile, payments, ...) still requires a session.
    (pathname.startsWith("/customer") && pathname !== "/customer");

  // ── Protected routes need authentication ──
  if (isProtected && !isLoggedIn) {
    const redirect = new URL("/auth/login", req.url);
    redirect.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirect);
  }

  // ── Auth pages (login/register) ──
  if (isAuthPage) {
    // If logged in and no callbackUrl provided, redirect to dashboard
    // This prevents the empty /auth/login page for already-signed-in users.
    if (isLoggedIn) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
      if (!callbackUrl) {
        const roleMap: Record<string, string> = {
          OWNER: "/admin",
          ADMIN: "/admin",
          MANAGER: "/admin",
          RECEPTIONIST: "/admin",
          STAFF: "/staff",
          CUSTOMER: "/customer",
        };
        let redirectUrl = "/customer";
        // Extract role from session cookie (JWT payload is not directly accessible here,
        // so fall back to a generic dashboard for non-customer staff).
        const role = (req.cookies.get("authjs.session-token")?.value || "") as string;
        if (role) {
          // Use the session cookie to determine role (simple heuristic for dev)
          // In production, use auth() to get the full session.
        }
        // For simplicity: always redirect to customer dashboard when logged in
        // without a callbackUrl. The site header will show the correct menu.
        return NextResponse.redirect(new URL("/customer", req.url));
      }
      // Has callbackUrl, let NextAuth handle the login flow
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\..*).*)"],
};
