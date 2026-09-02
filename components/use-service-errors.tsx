"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { ServiceErrorModal } from "@/components/service-error-modal";
import { toServiceError, type ServiceErrorPayload } from "@/lib/service-error";

export function useServiceErrors() {
  const router = useRouter();
  const [errors, setErrors] = useState<ServiceErrorPayload[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const reportError = useCallback((error: unknown, label: string) => {
    setErrors([toServiceError(error, label)]);
    setOpen(true);
  }, []);

  const reportErrors = useCallback((payloads: ServiceErrorPayload[]) => {
    if (payloads.length === 0) return;
    setErrors(payloads);
    setOpen(true);
  }, []);

  const clearErrors = useCallback(() => {
    setOpen(false);
    setErrors([]);
  }, []);

  const retry = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const errorModal =
    errors.length > 0 ? (
      <ServiceErrorModal
        open={open}
        errors={errors}
        onClose={clearErrors}
        onRetry={retry}
        retrying={isPending}
      />
    ) : null;

  return { reportError, reportErrors, clearErrors, errorModal };
}
