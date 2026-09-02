"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useAdminPortal } from "@/components/admin/admin-portal-context";
import { StaffLogoutButton } from "@/components/admin/staff-logout-button";
import { UnnCrest } from "@/components/unn-crest";
import { getAdminNav, getAdminPageTitle } from "@/lib/admin-portal-config";

const navIcons = {
  "": OverviewIcon,
  users: UsersIcon,
  research: ResearchIcon,
  equipments: EquipmentIcon,
  researchers: PeopleIcon,
  settings: SettingsIcon,
} as const;

const MenuContext = createContext<{
  open: boolean;
  setOpen: (open: boolean | ((value: boolean) => boolean)) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function AdminMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <MenuContext.Provider value={{ open, setOpen }}>{children}</MenuContext.Provider>;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { open, setOpen } = useContext(MenuContext);
  const config = useAdminPortal();
  const nav = getAdminNav(config);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-unn-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-unn-green text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "max-lg:-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <UnnCrest className="h-10 w-auto" />
          <div>
            <p className="font-serif text-lg leading-tight">UNN Research</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-unn-gold-soft">
              {config.portalLabel}
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Dashboard">
          {nav.map((item) => {
            const active =
              item.segment === ""
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = navIcons[item.segment as keyof typeof navIcons] ?? OverviewIcon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/75 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="block rounded-xl px-3 py-2 text-sm text-unn-gold-soft hover:bg-white/8"
          >
            View public site
          </Link>
          <StaffLogoutButton />
        </div>
      </aside>
    </>
  );
}

export function AdminTopbar() {
  const pathname = usePathname();
  const { open, setOpen } = useContext(MenuContext);
  const config = useAdminPortal();
  const title = getAdminPageTitle(pathname, config);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-unn-green/10 bg-unn-cream/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-unn-green/20 text-unn-green lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Open menu</span>
          <span className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </span>
        </button>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-unn-gold">
            Office of Research
          </p>
          <h1 className="font-serif text-xl text-unn-green">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="hidden text-right text-sm sm:block">
          <span className="block font-medium text-unn-ink">{config.userName}</span>
          <span className="text-xs text-unn-muted">{config.userEmail}</span>
        </p>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-unn-green font-serif text-sm text-unn-gold-soft">
          {config.userInitials}
        </span>
      </div>
    </header>
  );
}

function OverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 19.5c.8-3.4 3.5-5.5 7-5.5s6.2 2.1 7 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ResearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M7 4h8l3 3v13H7V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 11h6M10 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EquipmentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3.5" y="7" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 7V5h8v2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 19c.6-3 2.7-5 5-5s4.4 2 5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.2 14.2c1.8.4 3.2 1.8 3.8 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.5v2.2M12 18.3V20.5M4.8 6.5l1.6 1.6M17.6 15.9l1.6 1.6M3.5 12h2.2M18.3 12H20.5M4.8 17.5l1.6-1.6M17.6 8.1l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
