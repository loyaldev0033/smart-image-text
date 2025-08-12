import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const betasiteLockEnabled = process.env.NEXT_PUBLIC_BETASITE_LOCK === "true";
  if (!betasiteLockEnabled) return NextResponse.next();

  // Allow if betasite cookie is set
  const betasiteCookie = req.cookies.get("betasite_auth")?.value;
  if (betasiteCookie === "1") {
    return NextResponse.next();
  }

  // Check for Basic Auth (for betasite lock)
  const basicAuth = req.headers.get("authorization");
  const betasiteUser = process.env.NEXT_PUBLIC_BETASITE_LOCK_NAME ?? "";
  const betasitePass = process.env.NEXT_PUBLIC_BETASITE_LOCK_PASSWORD ?? "";

  if (basicAuth) {
    const auth = basicAuth.split(" ")[1];
    const [user, pwd] = Buffer.from(auth, "base64").toString().split(":");
    if (user === betasiteUser && pwd === betasitePass) {
      // Set cookie and allow
      const res = NextResponse.next();
      res.cookies.set("betasite_auth", "1", {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });
      return res;
    }
  }

  // Challenge for betasite lock
  return new Response("Betasite access required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Betasite Lock"',
    },
  });
}
