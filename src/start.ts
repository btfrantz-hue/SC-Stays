import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { getAdminSession } from "./lib/admin-session";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Redirects page loads under /admin/* to the login page when there's no valid
// session. This is a UX convenience only — the real security boundary is
// requireAdminMiddleware attached to each admin server function, since RPC
// calls to /_serverFn/* never go through this pathname check.
const adminPageGuardMiddleware = createMiddleware().server(async ({ next, pathname }) => {
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") return next();

  const session = await getAdminSession();
  if (!session.data.authenticated) {
    return new Response(null, { status: 303, headers: { Location: "/admin/login" } });
  }

  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, adminPageGuardMiddleware],
}));
