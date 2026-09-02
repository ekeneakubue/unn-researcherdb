"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ServiceErrorModal } from "@/components/service-error-modal";
import type { ServiceErrorPayload } from "@/lib/service-error";

export function ServiceErrorHost({ errors }: { errors: ServiceErrorPayload[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(errors.length > 0);
  const [isPending, startTransition] = useTransition();

  if (errors.length === 0) return null;

  function handleRetry() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <ServiceErrorModal
      open={open}
      errors={errors}
      onClose={() => setOpen(false)}
      onRetry={handleRetry}
      retrying={isPending}
    />
  );
}
