"use client";

import { useActionState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { subscribe, type SubscribeState } from "@/app/actions";

export function Newsletter() {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { ok: false });
  if (state.ok)
    return (
      <p className="mt-8 flex items-center gap-2 text-sm text-leaf-dark" role="status">
        <Check className="size-4" aria-hidden="true" /> Subscribed. Thank you.
      </p>
    );
  return (
    <form action={action} className="mt-8 max-w-sm" noValidate>
      <label htmlFor="newsletter" className="font-heading text-xl font-semibold tracking-[-0.03em] text-night italic">
        Join our mailing list
      </label>
      <input
        id="newsletter"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        aria-invalid={!!state.error}
        aria-describedby={state.error ? "newsletter-err" : undefined}
        className="mt-3 h-[52px] w-full rounded-xl border border-night/15 bg-white px-4 text-sm text-night placeholder:text-muted focus:border-leaf focus:shadow-[0_0_0_4px_rgb(47_158_68/0.2)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-3 flex h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-night text-[15px] font-semibold text-white transition-colors hover:bg-leaf-dark disabled:opacity-60"
      >
        Subscribe <ArrowRight className="size-4" aria-hidden="true" />
      </button>
      {state.error && (
        <p id="newsletter-err" className="mt-2 text-xs text-status-red">
          {state.error}
        </p>
      )}
    </form>
  );
}
