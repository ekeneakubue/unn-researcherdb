"use client";

import { useEffect, useId, useRef } from "react";

type ConfirmDeleteModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  pendingLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
  pending?: boolean;
};

export function ConfirmDeleteModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  pendingLabel = "Deleting…",
  onClose,
  onConfirm,
  pending = false,
}: ConfirmDeleteModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget && !pending) onClose();
  }

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    // Escape key closes the dialog natively; block it mid-delete.
    if (pending) event.preventDefault();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancel}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border-0 bg-white p-0 text-unn-ink shadow-xl backdrop:bg-unn-ink/40"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <WarningIcon />
          </span>
          <div>
            <h2 id={titleId} className="font-serif text-2xl text-unn-green">
              {title}
            </h2>
            <p id={descriptionId} className="mt-1 text-sm text-unn-muted">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="h-11 rounded-full px-5 text-sm font-semibold text-unn-green hover:bg-unn-cream disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            disabled={pending}
            className="h-11 rounded-full bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M12 9v4m0 3h.01M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.4h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
