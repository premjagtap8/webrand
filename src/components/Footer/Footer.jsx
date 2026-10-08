import './Footer.css';

const chips = [
  'Branding',
  'Creative',
  'Technology',
  'Marketing',
  'IT Infrastructure',
  '3D Design & Printing',
];

const quickLinks = [
  { label: 'Home', href: '#top' },
  { label: 'What We Do', href: '#what-we-do' },
  { label: 'Industries', href: '#industries' },
  { label: 'Our Work', href: '#our-work' },
  { label: 'About Us', href: '#why' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact-us' },
];

const social = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <>
        <path d="M6.5 9.5v8M6.5 6.2v.1M11 17.5v-8M11 12.8c0-2 1.3-3.3 3-3.3s2.8 1.1 2.8 3.2v4.8" />
        <rect x="3" y="3" width="18" height="18" rx="4" />
      </>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.4l.6-3.5H14V8.8c0-.2.1-.3.3-.3z" />
    ),
  },
];

const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export default function Footer() {
  return (
    <footer className="ft" aria-label="Site footer">
      <div className="ft-grid">

        {/* Brand */}
        <div className="ft-brand">
          <a
            className="ft-logo"
            href="#top"
            aria-label="Webrandustry Digital Solutions"
          >
            <i>W</i>

            <span>
              <b>Webrandustry</b>
              <small>Digital Solutions</small>
            </span>
          </a>

          <p className="ft-tag">
            Building Brands. Creating Technology. Driving Growth.
          </p>

          <ul className="ft-chips">
            {chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <nav className="ft-col ft-links" aria-label="Quick links">
          <h4>Quick Links</h4>

          <ul>
            {quickLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="ft-col">
          <h4>Let's Connect</h4>

          <ul className="ft-contact">

            {/* WhatsApp */}
            <li>
              <span className="ft-ico">
                <Icon>
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                </Icon>
              </span>

              <a href="https://wa.me/919619272938">
                +91 96192 72938
              </a>
            </li>

            {/* Email */}
            <li>
              <span className="ft-ico">
                <Icon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </Icon>
              </span>

              <a href="mailto:hello@yourdomain.com">
                hello@yourdomain.com
              </a>
            </li>

            {/* Address */}
            <li>
              <span className="ft-ico">
                <Icon>
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.6" />
                </Icon>
              </span>

              <span>Your address, City, State</span>
            </li>

          </ul>
        </div>

        {/* Social */}
        <div className="ft-col">
          <h4>Follow Us</h4>

          <ul className="ft-social">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label}>
                  <span className="ft-ico">
                    <Icon>{s.icon}</Icon>
                  </span>

                  <span>{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ft-bar">
        <p>
          © Webrandustry Digital Solutions. All Rights Reserved.
        </p>

        <a
          className="ft-top"
          href="#top"
          aria-label="Back to top"
        >
          Back to top

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </a>
      </div>
    </footer>
  );
}