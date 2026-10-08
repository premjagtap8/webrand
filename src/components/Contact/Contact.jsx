import { useEffect, useRef, useState } from "react";
import "./Contact.css";

/* ---------- Icons (inline SVG, no extra library needed) ---------- */
const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
  </svg>
);

const AlertIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16.5h.01" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

const SERVICES = [
  "Branding & Design",
  "Websites & E-commerce",
  "Software & Mobile Apps",
  "Digital Marketing",
  "IT Infrastructure",
];

/* Validation for the required fields. Returns "" when the value is fine. */
const VALIDATORS = {
  name: (v) => (v.trim() ? "" : "Enter your name."),
  email: (v) => {
    if (!v.trim()) return "Enter your email address.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? ""
      : "Enter a valid email address, for example you@company.com.";
  },
  phone: (v) => {
    if (!v.trim()) return "Enter your phone number.";
    const digits = v.replace(/\D/g, "");
    return /^[+()\d\s-]+$/.test(v.trim()) && digits.length >= 7 && digits.length <= 15
      ? ""
      : "Enter a valid phone number, for example +91 99999 99999.";
  },
};

/*
  Props (all optional):
  - phone / phoneHref : the number shown and its tel: link
  - email             : address shown, also used for the mailto: link
  - onSubmit(values)  : called with { name, company, email, phone, service, message }
                        once the form is valid. Wire your API call (the Nodemailer
                        "Send Enquiry" request) here. Return or await a promise:
                        if it rejects or resolves to false, the form shows the
                        "could not send" message; otherwise it shows the success panel.
*/
const Contact = ({
  phone = "+91 00000 00000",
  phoneHref = "tel:+910000000000",
  email = "hello@yourdomain.com",
  onSubmit,
}) => {
  const [errors, setErrors] = useState({}); // field -> message
  const [ok, setOk] = useState({}); // field -> true once it has been checked and is valid
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [formKey, setFormKey] = useState(0); // bumping this clears the form
  const successRef = useRef(null);

  /* move focus to the success panel so screen-reader users hear it */
  useEffect(() => {
    if (status === "success" && successRef.current) successRef.current.focus();
  }, [status]);

  const check = (name, value) => {
    const msg = VALIDATORS[name](value);
    setErrors((p) => ({ ...p, [name]: msg }));
    setOk((p) => ({ ...p, [name]: !msg }));
    return msg;
  };

  /* props shared by the three validated inputs */
  const ctl = (name) => ({
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `cnt-${name}-err` : undefined,
    onBlur: (e) => check(name, e.target.value),
    onChange: (e) => {
      if (errors[name] || ok[name]) check(name, e.target.value);
    },
  });

  const fieldClass = (name) =>
    `cnt__field${errors[name] ? " is-error" : ok[name] ? " is-valid" : ""}`;

  const errorMsg = (name) =>
    errors[name] ? (
      <p className="cnt__error" id={`cnt-${name}-err`}>
        <AlertIcon size={15} />
        {errors[name]}
      </p>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));

    const nextErrors = {};
    const nextOk = {};
    let firstBad = null;
    Object.keys(VALIDATORS).forEach((n) => {
      const msg = VALIDATORS[n](values[n] || "");
      nextErrors[n] = msg;
      nextOk[n] = !msg;
      if (msg && !firstBad) firstBad = n;
    });
    setErrors(nextErrors);
    setOk(nextOk);

    if (firstBad) {
      setStatus("idle");
      form.elements.namedItem(firstBad)?.focus();
      return;
    }

    setStatus("sending");
    try {
      if (onSubmit) {
        const result = await onSubmit(values);
        if (result === false) throw new Error("Send failed");
      } else {
        console.warn("Contact: no onSubmit prop was passed, so nothing was sent.");
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setErrors({});
    setOk({});
    setStatus("idle");
    setFormKey((k) => k + 1);
  };

  const sending = status === "sending";

  return (
    <section className="cnt" id="contact-us" aria-labelledby="cnt-title">
      <div className="cnt__inner">
        <div className="cnt__copy">
          <span className="cnt__pill">Contact</span>
          <h2 id="cnt-title" className="cnt__title">
            Let&rsquo;s Build <span className="cnt__accent">Something Together.</span>
          </h2>
          <p className="cnt__sub">Tell us about your business, project or challenge.</p>

          <div className="cnt__chips">
            <a className="cnt__chip" href={phoneHref}>
              <PhoneIcon />
              {phone}
            </a>
            <a className="cnt__chip" href={`mailto:${email}`}>
              <MailIcon />
              {email}
            </a>
          </div>
        </div>

        <div className="cnt__card">
          {status === "success" ? (
            <div className="cnt__success" role="status" tabIndex={-1} ref={successRef}>
              <span className="cnt__success-icon">
                <CheckIcon />
              </span>
              <h3 className="cnt__success-title">Enquiry sent</h3>
              <p className="cnt__success-text">
                Thanks for getting in touch. Our team will reply to the email address you gave us.
              </p>
              <button type="button" className="cnt__again" onClick={reset}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <>
              <form className="cnt__form" key={formKey} onSubmit={handleSubmit} noValidate>
                <fieldset className="cnt__fieldset" disabled={sending}>
                  <div className="cnt__row">
                    <div className={fieldClass("name")}>
                      <label htmlFor="cnt-name">
                        Name <span className="cnt__req" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="cnt-name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        autoComplete="name"
                        required
                        {...ctl("name")}
                      />
                      {errorMsg("name")}
                    </div>
                    <div className="cnt__field">
                      <label htmlFor="cnt-company">
                        Company <small>(optional)</small>
                      </label>
                      <input
                        id="cnt-company"
                        name="company"
                        type="text"
                        placeholder="Company name"
                        autoComplete="organization"
                      />
                    </div>
                  </div>

                  <div className="cnt__row">
                    <div className={fieldClass("email")}>
                      <label htmlFor="cnt-email">
                        Email <span className="cnt__req" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="cnt-email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        autoComplete="email"
                        required
                        {...ctl("email")}
                      />
                      {errorMsg("email")}
                    </div>
                    <div className={fieldClass("phone")}>
                      <label htmlFor="cnt-phone">
                        Phone <span className="cnt__req" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="cnt-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="+91 99999 99999"
                        autoComplete="tel"
                        required
                        {...ctl("phone")}
                      />
                      {errorMsg("phone")}
                    </div>
                  </div>

                  <div className="cnt__field">
                    <label htmlFor="cnt-service">What can we help you with?</label>
                    <select id="cnt-service" name="service" defaultValue="">
                      <option value="">Select a service</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cnt__field">
                    <label htmlFor="cnt-message">Tell us about your requirement</label>
                    <textarea
                      id="cnt-message"
                      name="message"
                      rows={4}
                      placeholder="Tell us about your project…"
                    />
                  </div>

                  {status === "error" && (
                    <p className="cnt__banner" role="alert">
                      <AlertIcon size={18} />
                      <span>
                        We couldn&rsquo;t send your enquiry. Please try again, or call or email us
                        using the details on this page.
                      </span>
                    </p>
                  )}

                  <button className="cnt__submit" type="submit" aria-busy={sending}>
                    <SendIcon />
                    {sending ? "Sending…" : "Send Enquiry"}
                  </button>
                </fieldset>
              </form>

              <p className="cnt__safe">
                Your details are safe. No spam &mdash; only a tailored response from our team.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
