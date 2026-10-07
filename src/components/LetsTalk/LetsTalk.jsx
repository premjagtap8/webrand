import "./LetsTalk.css";

/* ---------- Icons (inline SVG, no extra library needed) ---------- */
const Icon = ({ children }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Arrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ICONS = {
  launch: (
    <Icon>
      <path d="M5 15c-1.5 1.3-2 4-2 4s2.7-.5 4-2" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-4 12 12 0 0 1 9-5c0 3-1.5 7-5 9a22 22 0 0 1-3 3z" />
      <circle cx="15" cy="9" r="1.2" />
    </Icon>
  ),
  marketing: (
    <Icon>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
    </Icon>
  ),
  software: (
    <Icon>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
    </Icon>
  ),
  office: (
    <Icon>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" />
    </Icon>
  ),
  online: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
  ),
  physical: (
    <Icon>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </Icon>
  ),
};

/* Content taken from the existing Home.jsx section. Edit freely. */
const OPTIONS = [
  {
    id: "launch",
    question: "Are you launching a new business?",
    answer: "Let's build your brand and digital foundation.",
  },
  {
    id: "marketing",
    question: "Looking for more customers?",
    answer: "Let's build a marketing and lead-generation strategy.",
  },
  {
    id: "software",
    question: "Building custom software?",
    answer: "Let's understand your processes and create the right solution.",
  },
  {
    id: "office",
    question: "Setting up a new office?",
    answer: "Let's design your technology infrastructure.",
  },
  {
    id: "online",
    question: "Taking your business online?",
    answer: "Let's build your digital presence.",
  },
  {
    id: "physical",
    question: "Creating something physical?",
    answer: "Let's explore branding, design and 3D possibilities.",
  },
];

/* contactHref should point at your contact form (the #contact-us section on the page) */
const LetsTalk = ({ contactHref = "#contact-us" }) => {
  return (
    <section className="lt" id="lets-talk" aria-labelledby="lt-title">
      <div className="lt__inner">
        <header className="lt__head">
          <h2 id="lt-title" className="lt__title">
            Let&rsquo;s Talk About Your Business
          </h2>
          <p className="lt__q">Have an Idea? A Problem? A Business to Grow?</p>
          <p className="lt__intro">
            You don&rsquo;t need to know exactly what service you need.
            <br />
            Tell us what you&rsquo;re trying to achieve.
            <br />
            We&rsquo;ll help you identify the right approach.
          </p>
        </header>

        <ul className="lt__grid" role="list">
          {OPTIONS.map((o) => (
            <li className="lt__item" key={o.id}>
              <a className="lt-opt" href={contactHref}>
                <span className="lt-opt__icon">{ICONS[o.id]}</span>
                <span className="lt-opt__text">
                  <small>{o.question}</small>
                  <b>{o.answer}</b>
                </span>
                <span className="lt-opt__go" aria-hidden="true">
                  <Arrow />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="lt__cta">
          <span className="lt__start">Start with a conversation.</span>
          <a className="lt__btn lt__btn--white" href={contactHref}>
            Tell Us About Your Project
            <Arrow />
          </a>
          <a className="lt__btn lt__btn--ghost" href={contactHref}>
            Request a Consultation
          </a>
        </div>
      </div>
    </section>
  );
};

export default LetsTalk;
