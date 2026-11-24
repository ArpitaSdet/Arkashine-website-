import { NextResponse } from "next/server";
import { clean, istNow, relayEnquiry } from "@/lib/send-enquiry";

/** Demo bookings → email to the ArkaShine team (see src/lib/send-enquiry.ts). */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  if (!name || !phone) return NextResponse.json({ ok: false, error: "Name and phone are required" }, { status: 400 });
  const date = clean(body.date, 20);

  const r = await relayEnquiry(req, `Demo booked: ${name}${date ? ` on ${date}` : ""}`, {
    Summary: `${name} has booked a SoiLenz demo${date ? ` for ${date}` : ""}.`,
    Name: name,
    Phone: phone,
    Email: clean(body.email, 160) || "—",
    Organisation: clean(body.orgType, 80) || "—",
    Location: clean(body.location, 160) || "—",
    "Preferred demo date": date || "—",
    "Booked on": istNow(),
  });
  if (!r.ok) return NextResponse.json(r, { status: 502 });
  return NextResponse.json(r);
}
