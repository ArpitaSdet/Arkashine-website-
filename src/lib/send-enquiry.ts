/**
 * Server-side email relay for website forms (demo bookings, school enquiries…).
 * Uses FormSubmit (https://formsubmit.co) — no account or key needed.
 * FormSubmit only accepts posts that say which web page they came from, so we
 * forward the visitor's Origin/Referer. The very first message triggers a one-time
 * "Activate form" email to the inbox; after it is clicked, messages arrive normally.
 */

export const ENQUIRY_TO = process.env.ENQUIRY_EMAIL || "karbari.rsudha@gmail.com";

export type RelayResult = { ok: true; activation?: boolean } | { ok: false; error: string };

export async function relayEnquiry(req: Request, subject: string, fields: Record<string, string>): Promise<RelayResult> {
  const origin = req.headers.get("origin") || new URL(req.url).origin;
  const referer = req.headers.get("referer") || `${origin}/`;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(ENQUIRY_TO)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: referer,
      },
      body: JSON.stringify({ _subject: subject, _template: "table", _captcha: "false", ...fields }),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
    const msg = String(data.message || "");
    if (/activat/i.test(msg)) return { ok: true, activation: true }; // first-time activation email sent
    if (!res.ok || data.success === "false" || data.success === false) {
      console.error("[enquiry] relay error", res.status, data);
      return { ok: false, error: "Could not send right now" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[enquiry] relay failed", err);
    return { ok: false, error: "Could not send right now" };
  }
}

export function clean(v: unknown, max = 200) {
  return String(v ?? "").trim().slice(0, max);
}

export function istNow() {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " (IST)";
}
