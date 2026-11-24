import { NextResponse } from "next/server";
import { clean, istNow, relayEnquiry } from "@/lib/send-enquiry";

const KINDS: Record<string, string> = {
  partner: "School partnership request",
  proposal: "School proposal request",
  message: "Website message",
};

/** Website enquiries (School Innovation Lab and Soil Partners forms) → email. */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const kind = KINDS[clean(body.kind, 20)] ? clean(body.kind, 20) : "message";
  const audience = clean(body.audience, 20);
  const type =
    audience === "soil-partner"
      ? kind === "partner" ? "Soil Partner pack request" : "Soil Partner message"
      : audience === "general"
        ? kind === "partner" ? "Product enquiry / quote request" : "Website message"
        : KINDS[kind];
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  if (!name || (!phone && !email)) {
    return NextResponse.json({ ok: false, error: "Please add your name and a phone number or email" }, { status: 400 });
  }

  const fields: Record<string, string> = {
    Type: type,
    Name: name,
    Role: clean(body.role, 80) || "—",
    Organisation: clean(body.organisation, 160) || "—",
    "Organisation type": clean(body.orgType, 80) || "—",
    Phone: phone || "—",
    Email: email || "—",
    "City / District": clean(body.city, 120) || "—",
    "Number of students": clean(body.students, 20) || "—",
    "Preferred start": clean(body.start, 40) || "—",
    Message: clean(body.message, 2000) || "—",
    "Sent on": istNow(),
    Page: clean(body.page, 200) || "—",
  };
  if (email) fields._replyto = email;

  const r = await relayEnquiry(req, `${type}: ${name}${fields.Organisation !== "—" ? ` (${fields.Organisation})` : ""}`, fields);
  if (!r.ok) return NextResponse.json(r, { status: 502 });
  return NextResponse.json(r);
}
