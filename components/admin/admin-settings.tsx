"use client";

import { useState } from "react";

export function AdminSettings() {
  const [cataloguePublic, setCataloguePublic] = useState(true);
  const [bookingRequiresApproval, setBookingRequiresApproval] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm text-unn-muted">
        Portal defaults for the Office of Research, Innovation & Development.
      </p>

      <form
        className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-unn-green/10"
        onSubmit={(event) => event.preventDefault()}
      >
        <div>
          <h2 className="font-serif text-xl text-unn-green">Institution</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Display name
              <input
                defaultValue="University of Nigeria, Nsukka"
                className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
              />
            </label>
            <label className="block text-sm">
              Research office email
              <input
                type="email"
                defaultValue="research@unn.edu.ng"
                className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              Motto
              <input
                defaultValue="To Restore the Dignity of Man"
                className="mt-1.5 h-11 w-full rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
              />
            </label>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl text-unn-green">Access</h2>
          <ul className="mt-4 space-y-3">
            <ToggleRow
              label="Public research catalogue"
              hint="Show approved projects on the homepage without sign-in."
              checked={cataloguePublic}
              onChange={setCataloguePublic}
            />
            <ToggleRow
              label="Supervisor approval for equipment"
              hint="Custodians must confirm induction before a booking goes live."
              checked={bookingRequiresApproval}
              onChange={setBookingRequiresApproval}
            />
            <ToggleRow
              label="Email alerts to ORID"
              hint="Send a digest when accounts or ethics packets are pending."
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-xl text-unn-green">Booking window</h2>
          <label className="mt-4 block text-sm">
            Hours ahead researchers may reserve instruments
            <input
              type="number"
              min={1}
              defaultValue={48}
              className="mt-1.5 h-11 w-full max-w-xs rounded-xl border border-unn-green/15 px-3 text-sm outline-none focus:border-unn-gold"
            />
          </label>
        </div>

        <button
          type="submit"
          className="h-11 rounded-full bg-unn-green px-5 text-sm font-semibold text-white hover:bg-unn-green-mid"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-xl border border-unn-green/10 p-4">
      <div>
        <p className="text-sm font-medium text-unn-ink">{label}</p>
        <p className="mt-1 text-xs text-unn-muted">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-unn-green" : "bg-unn-green/20"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </li>
  );
}
