"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UnnCrest } from "@/components/unn-crest";

const links = [
  { href: "#research", label: "Research" },
  { href: "#equipment", label: "Equipment" },
  { href: "#join", label: "Researchers" },
  { href: "#about", label: "About" },
];

const signInLinks = [
  { href: "/researcher/login", label: "Researcher Login" },
  { href: "/login", label: "Admin Login" },
] as const;

function SignInMenu({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-unn-green transition-colors hover:bg-unn-green/8"
      >
        Sign in
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[12.5rem] overflow-hidden rounded-xl bg-white py-1 shadow-lg ring-1 ring-unn-green/10"
        >
          {signInLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-unn-ink transition-colors hover:bg-unn-cream hover:text-unn-green"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-unn-green text-unn-gold-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] tracking-[0.18em] uppercase sm:px-6 lg:px-8">
          <p>University of Nigeria, Nsukka</p>
          <p className="hidden sm:block">To Restore the Dignity of Man</p>
        </div>
      </div>
      <nav
        className="border-b border-unn-green/10 bg-unn-cream/90 backdrop-blur-md"
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <UnnCrest priority />
            <span className="min-w-0">
              <span className="block font-serif text-lg leading-tight text-unn-green">
                UNN Research
              </span>
              <span className="block truncate text-[11px] uppercase tracking-[0.16em] text-unn-muted">
                Research Management
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-unn-ink/80 transition-colors hover:text-unn-green"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <SignInMenu />
            <Link
              href="#join"
              className="rounded-full bg-unn-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-unn-green-mid"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-unn-green/20 text-unn-green lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Toggle menu</span>
            <span className="flex flex-col gap-1.5">
              <span
                className={`h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span className={`h-0.5 w-5 bg-current ${open ? "opacity-0" : ""}`} />
              <span
                className={`h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="border-t border-unn-green/10 px-4 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-unn-ink hover:bg-unn-green/8"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-unn-green/10 pt-3">
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-unn-muted">
                  Sign in
                </p>
                {signInLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-unn-ink hover:bg-unn-green/8"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link
                href="#join"
                className="mt-2 rounded-full bg-unn-green px-4 py-2 text-center text-sm font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Register as a researcher
              </Link>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
