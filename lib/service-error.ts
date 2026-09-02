export type ServiceErrorPayload = {
  label: string;
  title: string;
  message: string;
  detail?: string;
  retryable: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readErrorCode(error: unknown): string | undefined {
  if (!isRecord(error)) return undefined;
  if (typeof error.code === "string") return error.code;

  const message = readErrorMessage(error);
  const match = message.match(/\b(P\d{4})\b/);
  return match?.[1];
}

function readErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}

function isConnectionIssue(error: unknown, message: string): boolean {
  const code = readErrorCode(error);
  if (code && ["P1001", "P1002", "P1008", "P1017"].includes(code)) return true;

  const normalized = message.toLowerCase();
  return (
    normalized.includes("can't reach database") ||
    normalized.includes("connection") ||
    normalized.includes("network") ||
    normalized.includes("econnrefused") ||
    normalized.includes("enotfound") ||
    normalized.includes("etimedout") ||
    normalized.includes("fetch failed") ||
    normalized.includes("socket")
  );
}

function summarizeMessage(message: string, max = 240): string {
  const singleLine = message.replace(/\s+/g, " ").trim();
  if (singleLine.length <= max) return singleLine;
  return `${singleLine.slice(0, max).trimEnd()}…`;
}

export function toServiceError(error: unknown, label = "Request"): ServiceErrorPayload {
  const message = readErrorMessage(error);
  const connectionIssue = isConnectionIssue(error, message);
  const code = readErrorCode(error);

  return {
    label,
    title: connectionIssue ? "Connection lost" : "Something went wrong",
    message: connectionIssue
      ? "We couldn't reach the database. Check your internet connection and try again."
      : summarizeMessage(message),
    detail: connectionIssue
      ? code
        ? `Error code: ${code}`
        : "The database server did not respond."
      : code
        ? `Error code: ${code}`
        : undefined,
    retryable: connectionIssue || code === "P2024",
  };
}

/** Avoid logging Error objects during RSC — Next.js may treat them as unhandled. */
export function logServiceFailure(label: string, error: unknown) {
  const code = readErrorCode(error);
  const message = summarizeMessage(readErrorMessage(error), 180);
  console.warn(`[${label}] ${code ? `${code}: ` : ""}${message}`);
}
