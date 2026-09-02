import "server-only";

import { toServiceError, type ServiceErrorPayload } from "@/lib/service-error";

export type SafeActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: ServiceErrorPayload[] };

export async function runSafeAction<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<SafeActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    console.error(`[action:${label}]`, error);
    return { ok: false, errors: [toServiceError(error, label)] };
  }
}
