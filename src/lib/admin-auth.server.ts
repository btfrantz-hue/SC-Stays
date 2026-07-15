import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { clearAdminSession, getAdminSession, setAdminAuthenticated } from "./admin-session";

// Guards every admin server function individually — protects the /_serverFn RPC
// endpoint itself, not just page loads under /admin/* (those are two separate
// HTTP paths; a request-level middleware on /admin/* does not cover this).
export const requireAdminMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const session = await getAdminSession();
  if (!session.data.authenticated) {
    throw new Error("Não autenticado.");
  }
  return next();
});

export const adminLogin = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ username: z.string(), password: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    if (!expectedUser || !expectedPass || data.username !== expectedUser || data.password !== expectedPass) {
      throw new Error("Usuário ou senha inválidos.");
    }
    await setAdminAuthenticated();
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  await clearAdminSession();
  return { ok: true };
});
