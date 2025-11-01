import {getToken} from "next-auth/jwt";
import {NextRequest, Nextresponse} from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({req, secret:process:env.NEXTAUTH_SECRET});
    const {pathname} = req.nextUrl;

    if (pathname.startsWith("/chat") && !token) {
        return Nextresponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/auth/setup-profile") && !token) {
        return Nextresponse.redirect(new URL("/", req.url));
    }

    if (token && (pathname === "/" || pathname === "/auth/signup")) {
        return Nextresponse.redirect(new URL("/chat", req.url));
    }

    return Nextresponse.next();
}

export const config = {
    matcher: ["/chat", "/auth/setup-profile", "/", "auth/signup"],
}