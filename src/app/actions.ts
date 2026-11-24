"use server";

export type SubscribeState = { ok: boolean; error?: string };

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Please enter a valid email." };
  // TODO: send to ArkaShine's newsletter tool once chosen.
  console.info("[newsletter]", email);
  return { ok: true };
}
