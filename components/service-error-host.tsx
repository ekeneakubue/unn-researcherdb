"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ServiceErrorModal } from "@/components/service-error-modal";
import type { ServiceErrorPayload } from "@/lib/service-error";

export function ServiceErrorHost({ errors }: { errors: ServiceErrorPayload[] }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && errors.length > 0) {
      setOpen(true);
    }
  }, [mounted, errors]);

  if (!mounted || errors.length === 0) return null;

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
