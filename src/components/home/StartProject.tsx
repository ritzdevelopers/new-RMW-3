"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";
import { site } from "@/lib/site";

const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

type Status = "idle" | "submitting" | "success" | "error";

export function StartProject() {
  const data = site.startProject;
  const captchaRef = useRef<HCaptcha>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    if (!token) {
      setStatus("error");
      setMessage("Please complete the captcha.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, captcha: token }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      form.reset();
      setToken("");
      captchaRef.current?.resetCaptcha();
      setStatus("success");
      setMessage("Thanks — we’ll get back to you with your audit shortly.");
    } catch (error) {
      captchaRef.current?.resetCaptcha();
      setToken("");
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <section id="start-a-project" className="audit" aria-label="Start a project">
      <div className="audit-inner">
        <div className="audit-copy">
          <p className="audit-kicker">{data.kicker}</p>
          <h2 className="audit-title">{data.title}</h2>
        </div>

        <form className="audit-card" onSubmit={onSubmit} noValidate>
          <label className="audit-field">
            <span>
              Your Name<span aria-hidden>*</span>
            </span>
            <input name="name" type="text" placeholder="Your name" autoComplete="name" required />
          </label>

          <label className="audit-field">
            <span>
              Your Email<span aria-hidden>*</span>
            </span>
            <input
              name="email"
              type="email"
              placeholder="You@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="audit-field">
            <span>
              Your Phone<span aria-hidden>*</span>
            </span>
            <input
              name="phone"
              type="tel"
              placeholder="+91 ..."
              autoComplete="tel"
              required
            />
          </label>

          <label className="audit-field">
            <span>
              Service Interested In<span aria-hidden>*</span>
            </span>
            <select name="service" defaultValue="" required>
              <option value="" disabled>
                — Select a service —
              </option>
              {data.services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>

          <label className="audit-field">
            <span>
              Subject<span aria-hidden>*</span>
            </span>
            <input name="subject" type="text" placeholder="How can we help?" required />
          </label>

          <label className="audit-field">
            <span>Your Message</span>
            <input name="message" type="text" placeholder="Tell us about your brand, budget..." />
          </label>

          <div className="audit-captcha">
            {sitekey ? (
              <HCaptcha
                ref={captchaRef}
                sitekey={sitekey}
                onVerify={setToken}
                onExpire={() => setToken("")}
                onError={() => setToken("")}
                theme="light"
              />
            ) : (
              <p className="audit-captcha-missing">
                Add NEXT_PUBLIC_HCAPTCHA_SITE_KEY to enable captcha.
              </p>
            )}
          </div>

          {message ? (
            <p className={status === "success" ? "audit-note is-success" : "audit-note is-error"}>
              {message}
            </p>
          ) : null}

          <button className="audit-submit" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : data.cta}
            <span aria-hidden>→</span>
          </button>
        </form>
      </div>

      <div className="ticker-pattern audit-pattern" aria-hidden />
    </section>
  );
}
