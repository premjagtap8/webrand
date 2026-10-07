import "./OurServices.css";

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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ICONS = {
  branding: (
    <Icon>
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z" />
    </Icon>
  ),
  print3d: (
    <Icon>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </Icon>
  ),
  software: (
    <Icon>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </Icon>
  ),
  mobile: (
    <Icon>
      <rect width="14" height="20" x="5" y="2" rx="2" />
      <path d="M12 18h.01" />
    </Icon>
  ),
  marketing: (
    <Icon>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </Icon>
  ),
  ecommerce: (
    <Icon>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </Icon>
  ),
  infra: (
    <Icon>
      <rect width="20" height="8" x="2" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 6h.01M6 18h.01" />
    </Icon>
  ),
};

/* Content is taken from the Webrandustry website copy (docx). Edit freely. */
const SERVICES = [
  {
    id: "branding",
    icon: "branding",
    title: "Branding & Creative",
    desc: "Strategy, logos, packaging and print that make your brand easy to recognise.",
    tags: ["Brand Strategy", "Logo Design", "Packaging", "Graphic Design", "Print & Physical Branding"],
    href: "/services/branding-creative",
  },
  {
    id: "3d",
    icon: "print3d",
    title: "3D Design & Printing",
    desc: "Turn concepts into models, prototypes and custom objects you can hold.",
    tags: ["3D Modelling", "Visualisation", "Rapid Prototyping", "Small-Batch Printing"],
    href: "/services/3d-design-printing",
  },
  {
    id: "software",
    icon: "software",
    title: "Software Development",
    desc: "Software built around the way your business actually works.",
    tags: ["CRM", "ERP", "HRMS", "LMS", "Hospital ERP"],
    href: "/services/software-development",
  },
  {
    id: "web-mobile",
    icon: "mobile",
    title: "Web & Mobile",
    desc: "Websites, web apps and Android / iOS apps your customers enjoy using.",
    tags: ["Websites", "Web Apps", "Android", "iOS"],
    href: "/services/web-mobile",
  },
  {
    id: "marketing",
    icon: "marketing",
    title: "Digital Marketing",
    desc: "Social, search and paid campaigns built around leads and sales.",
    tags: ["Social Media", "SEO", "Google Ads", "Performance Marketing"],
    href: "/services/digital-marketing",
  },
  {
    id: "ecommerce",
    icon: "ecommerce",
    title: "E-commerce",
    desc: "Online stores designed as sales channels, not just product catalogues.",
    tags: ["Product Catalogue", "Payments", "Order Management", "Analytics"],
    href: "/services/e-commerce",
  },
  {
    id: "infra",
    icon: "infra",
    title: "IT Infrastructure",
    desc: "Networks, hardware and servers that keep your business running.",
    tags: ["Networks", "Servers", "Hardware", "Office IT", "Multi-Branch IT", "Cloud", "IT Support"],
    href: "/services/it-infrastructure",
  },
];

const MAX_TAGS = 3;

/* Soft light that follows the cursor inside a card (mouse only) */
const trackPointer = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

const OurServices = ({ viewAllHref = "/services", contactHref = "/contact" }) => {
  return (
    <section className="os" id="services" aria-labelledby="os-heading">
      <div className="os__inner">
        <header className="os__head">
          <div>
            <span className="os__pill">Our Services</span>
            <h2 id="os-heading" className="os__title">
              Every capability, <span className="os__accent">in depth.</span>
            </h2>
            <p className="os__sub">Pick a service to see what we build and how we work.</p>
          </div>

          <a className="os__all" href={viewAllHref}>
            View All Services
            <Arrow />
          </a>
        </header>

        <ul className="os__grid">
          {SERVICES.map((s) => {
            const shown = s.tags.slice(0, MAX_TAGS);
            const extra = s.tags.length - shown.length;
            return (
              <li key={s.id} className="os__item">
                <a className="os-card" href={s.href} onMouseMove={trackPointer}>
                  <span className="os-card__icon">{ICONS[s.icon]}</span>
                  <h3 className="os-card__title">{s.title}</h3>
                  <p className="os-card__desc">{s.desc}</p>

                  <span className="os-card__tags">
                    {shown.map((t) => (
                      <span className="os-card__tag" key={t}>
                        {t}
                      </span>
                    ))}
                    {extra > 0 && <span className="os-card__tag os-card__tag--more">+{extra}</span>}
                  </span>

                  <span className="os-card__link">
                    Explore {s.title.toLowerCase()}
                    <Arrow />
                  </span>
                </a>
              </li>
            );
          })}

          {/* 8th slot: keeps the 4 x 2 grid complete and gives visitors a next step */}
          <li className="os__item">
            <div className="os-cta">
              <h3 className="os-cta__title">Not sure what you need?</h3>
              <p className="os-cta__desc">
                Tell us about your business and we&rsquo;ll point you to the right mix of services.
              </p>
              <a className="os-cta__btn" href={contactHref}>
                Talk to Our Experts
                <Arrow />
              </a>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default OurServices;
