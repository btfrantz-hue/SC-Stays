import { clearSession, getRequestProtocol, getSession, updateSession } from "@tanstack/react-start/server";

type AdminSessionData = { authenticated?: boolean };

function sessionConfig() {
  const password = process.env.ADMIN_SESSION_SECRET;
  if (!password) throw new Error("ADMIN_SESSION_SECRET não configurado.");

  return {
    password,
    name: "sc_admin_session",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: getRequestProtocol() === "https",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export function getAdminSession() {
  return getSession<AdminSessionData>(sessionConfig());
}

export function setAdminAuthenticated() {
  return updateSession<AdminSessionData>(sessionConfig(), { authenticated: true });
}

export function clearAdminSession() {
  return clearSession(sessionConfig());
}
