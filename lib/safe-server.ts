import "server-only";

import { logServiceFailure, toServiceError, type ServiceErrorPayload } from "@/lib/service-error";

export async function runSafe<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T,
): Promise<{ data: T; errors: ServiceErrorPayload[] }> {
  try {
    return { data: await fn(), errors: [] };
  } catch (error) {
    // Log as a plain string — passing Error objects to console.error during RSC
    // can surface as minified React #441 in the Next.js overlay even when caught.
    logServiceFailure(label, error);
    return { data: fallback, errors: [toServiceError(error, label)] };
  }
}

export async function runSafeAll<T extends readonly SafeTask[]>(
  tasks: T,
): Promise<{ results: SafeResults<T>; errors: ServiceErrorPayload[] }> {
  const errors: ServiceErrorPayload[] = [];
  const settled = await Promise.all(
    tasks.map(async (task) => {
      try {
        return await task.run();
      } catch (error) {
        logServiceFailure(task.label, error);
        errors.push(toServiceError(error, task.label));
        return task.fallback;
      }
    }),
  );

  return { results: settled as SafeResults<T>, errors };
}

type SafeTask = {
  label: string;
  run: () => Promise<unknown>;
  fallback: unknown;
};

type SafeResults<T extends readonly SafeTask[]> = {
  [K in keyof T]: T[K] extends SafeTask ? Awaited<ReturnType<T[K]["run"]>> : never;
};
