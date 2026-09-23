"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";
import { site } from "@/lib/site";

const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

type Status = "idle" | "submitting" | "success" | "error";

const pillIcons = {
  Branding: (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 1.5 14 8 8 14.5 2 8 8 1.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  SEO: (
    <svg viewBox="0 0 16 16" aria-hidden>
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 10.2 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  "Social Media": (
    <svg viewBox="0 0 16 16" aria-hidden>
      <circle cx="5.5" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11" cy="6.2" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M1.8 13.2c.5-2 2-3 3.7-3s3.2 1 3.7 3M9.2 10.4c1.3-.3 2.4.1 3.2 1.1.6.8 1 1.6 1.2 1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  Performance: (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        d="M2 12.5 6 8l2.4 2.2L14 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.5 4.5H14V8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
} as const;

function FieldIcon({ name }: { name: "user" | "mail" | "phone" | "tag" | "doc" | "flag" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      {name === "user" ? (
        <>
          <circle cx="8" cy="5.2" r="2.2" {...common} />
          <path d="M3.2 13.2c.7-2.3 2.4-3.4 4.8-3.4s4.1 1.1 4.8 3.4" {...common} />
        </>
      ) : null}
      {name === "mail" ? (
        <>
          <rect x="2" y="3.5" width="12" height="9" rx="1.4" {...common} />
          <path d="M2.5 4.5 8 8.5l5.5-4" {...common} />
        </>
      ) : null}
      {name === "phone" ? (
        <path
          d="M4.2 2.8h2.1l1 2.4-1.3 1a8.4 8.4 0 0 0 3.8 3.8l1-1.3 2.4 1v2.1c0 .5-.4.9-.9.9A10.2 10.2 0 0 1 3.3 3.7c0-.5.4-.9.9-.9Z"
          {...common}
        />
      ) : null}
      {name === "tag" ? (
        <path d="M2.5 8.2 8 2.7h4.2V7L7.2 13.7 2.5 8.2Z" {...common} />
      ) : null}
      {name === "doc" ? (
        <>
          <path d="M4 2.5h5.2L12.5 6v7.2H4V2.5Z" {...common} />
          <path d="M9 2.7V6h3.2M6 8.5h4M6 11h3" {...common} />
        </>
      ) : null}
      {name === "flag" ? (
        <path d="M4 13.5V2.8h7.2L9.6 5.4l1.6 2.5H4" {...common} />
      ) : null}
    </svg>
  );
}

export function StartProject() {
  const data = site.startProject;
  const captchaRef = useRef<HCaptcha>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const accentAt = data.title.indexOf("Free");
  const titleBefore = accentAt >= 0 ? data.title.slice(0, accentAt) : data.title;
  const titleAfter = accentAt >= 0 ? data.title.slice(accentAt + "Free".length) : "";

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
      <div className="audit-top" aria-hidden />

      <div className="audit-inner">
        <div className="audit-left">
          <div className="audit-copy">
            <p className="audit-kicker">{data.kicker}</p>
            <h2 className="audit-title">
              {titleBefore}
              {accentAt >= 0 ? <span className="audit-title-accent">Free</span> : null}
              {titleAfter}
            </h2>
            <ul className="audit-pills">
              {data.pills.map((pill) => (
                <li key={pill}>
                  <span className="audit-pill">
                    {pillIcons[pill as keyof typeof pillIcons]}
                    {pill}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="audit-truck">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.highways.truck} alt="" />
            <p className="audit-billboard">
              <strong>Free SEO Audit</strong>
              <span>Ritz Media World</span>
            </p>
          </div>
        </div>

        <form className="audit-card" onSubmit={onSubmit} noValidate>
          <div className="audit-notch" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path
                d="M12 3.2c.4 1.8 1.2 2.8 2.6 3.4-1.4.5-2.2 1.6-2.6 3.4-.4-1.8-1.2-2.9-2.6-3.4 1.4-.6 2.2-1.6 2.6-3.4Z"
                fill="currentColor"
              />
              <path
                d="M12 7.2c.2.9.6 1.4 1.3 1.7-.7.3-1.1.8-1.3 1.7-.2-.9-.6-1.4-1.3-1.7.7-.3 1.1-.8 1.3-1.7Z"
                fill="#0f193d"
              />
            </svg>
          </div>

          <h3 className="audit-card-title">{data.formTitle}</h3>

          <div className="audit-fields">
            <label className="audit-field">
              <span className="audit-label">
                <FieldIcon name="user" />
                Your Name<span aria-hidden>*</span>
              </span>
              <input name="name" type="text" placeholder="Your name" autoComplete="name" required />
            </label>

            <label className="audit-field">
              <span className="audit-label">
                <FieldIcon name="mail" />
                Your Email<span aria-hidden>*</span>
              </span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="audit-field">
              <span className="audit-label">
                <FieldIcon name="phone" />
                Your Phone<span aria-hidden>*</span>
              </span>
              <input name="phone" type="tel" placeholder="+91 ..." autoComplete="tel" required />
            </label>

            <label className="audit-field">
              <span className="audit-label">
                <FieldIcon name="tag" />
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
              <span className="audit-label">
                <FieldIcon name="doc" />
                Subject<span aria-hidden>*</span>
              </span>
              <input name="subject" type="text" placeholder="How can we help?" required />
            </label>

            <label className="audit-field">
              <span className="audit-label">
                <FieldIcon name="flag" />
                Your Message
              </span>
              <input name="message" type="text" placeholder="Tell us about your brand..." />
            </label>
          </div>

          {message ? (
            <p className={status === "success" ? "audit-note is-success" : "audit-note is-error"} role="status">
              {message}
            </p>
          ) : null}

          <div className="audit-actions">
            <div className="audit-captcha">
              {sitekey ? (
                <HCaptcha
                  ref={captchaRef}
                  sitekey={sitekey}
                  size="compact"
                  onVerify={setToken}
                  onExpire={() => setToken("")}
                  onError={() => setToken("")}
                  theme="dark"
                />
              ) : (
                <p className="audit-human">
                  <span className="audit-human-box" aria-hidden />
                  I am human · hCaptcha
                </p>
              )}
            </div>

            <button className="audit-submit" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : data.cta}
              <svg viewBox="0 0 20 14" aria-hidden>
                <path
                  d="M1 9.5h8.2v2.2H1V9.5Zm8.6-1.2 2.2-2.6h5.4l1.6 2.6H9.6Zm1.2 1.2h2.4v1.6h-2.4V9.5Zm6.2 0H18v1.6h-1v-1.6Z"
                  fill="currentColor"
                />
                <circle cx="5.2" cy="12.2" r="1.3" fill="currentColor" />
                <circle cx="15.2" cy="12.2" r="1.3" fill="currentColor" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* <div className="audit-road" aria-hidden /> */}
    </section>
  );
}
