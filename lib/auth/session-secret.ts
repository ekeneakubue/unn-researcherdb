import "server-only";

export class SessionConfigError extends Error {
  constructor(message = "SESSION_SECRET is not configured.") {
    super(message);
    this.name = "SessionConfigError";
  }
}

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new SessionConfigError();
  }

  return "dev-session-secret-change-me";
}

export function isSecureCookie() {
  return process.env.NODE_ENV === "production";
}
