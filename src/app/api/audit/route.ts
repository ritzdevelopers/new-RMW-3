import { NextResponse } from "next/server";

const VERIFY_URL = "https://api.hcaptcha.com/siteverify";

type AuditBody = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  subject?: string;
  message?: string;
  captcha?: string;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: AuditBody;

  try {
    body = (await request.json()) as AuditBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const phone = asString(body.phone);
  const service = asString(body.service);
  const subject = asString(body.subject);
  const message = asString(body.message);
  const captcha = asString(body.captcha);

  if (!name || !email || !phone || !service || !subject) {
    return NextResponse.json({ ok: false, error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Captcha is not configured." }, { status: 500 });
  }

  if (!captcha) {
    return NextResponse.json({ ok: false, error: "Please complete the captcha." }, { status: 400 });
  }

  const params = new URLSearchParams({ secret, response: captcha });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  if (ip) params.set("remoteip", ip);
  if (sitekey) params.set("sitekey", sitekey);

  const verify = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const result = (await verify.json()) as { success?: boolean; "error-codes"?: string[] };
  if (!result.success) {
    return NextResponse.json({ ok: false, error: "Captcha verification failed. Please try again." }, { status: 400 });
  }

  console.info("[audit] new enquiry", { name, email, phone, service, subject, message: message.slice(0, 280) });

  return NextResponse.json({ ok: true });
}
