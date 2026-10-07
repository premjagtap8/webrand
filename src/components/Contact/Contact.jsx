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

const SERVICES = [
  "Branding & Design",
  "Websites & E-commerce",
  "Software & Mobile Apps",
  "Digital Marketing",
  "IT Infrastructure",
];

/*
  Props (all optional):
  - phone / phoneHref : the number shown and its tel: link
  - email             : address shown, also used for the mailto: link
  - onSubmit(values)  : called with { name, company, email, phone, service, message }
                        when the form is valid. Wire your API call here.
*/
const Contact = ({
  phone = "+91 00000 00000",
  phoneHref = "tel:+910000000000",
  email = "hello@yourdomain.com",
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(Object.fromEntries(new FormData(e.currentTarget)));
  };

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
          <form className="cnt__form" onSubmit={handleSubmit}>
            <div className="cnt__row">
              <div className="cnt__field">
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
                />
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
              <div className="cnt__field">
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
                />
              </div>
              <div className="cnt__field">
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
                />
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

            <button className="cnt__submit" type="submit">
              <SendIcon />
              Send Enquiry
            </button>
          </form>

          <p className="cnt__safe">
            Your details are safe. No spam &mdash; only a tailored response from our team.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
