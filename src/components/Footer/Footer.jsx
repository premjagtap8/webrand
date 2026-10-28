import './Footer.css';
import { SectionLink } from '../../utils/SectionNav.jsx';

const chips = [
  'Branding',
  'Creative',
  'Technology',
  'Marketing',
  'IT Infrastructure',
  '3D Design & Printing',
];

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'What We Do', to: '/what-we-do' },
  { label: 'Industries', to: '/industries' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Insights', to: '/insights' },
  { label: 'Contact', to: '/contact' },
];

const social = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/webrandustry/',
    icon: (
      <>
        <path d="M6.5 9.5v8M6.5 6.2v.1M11 17.5v-8M11 12.8c0-2 1.3-3.3 3-3.3s2.8 1.1 2.8 3.2v4.8" />
        <rect x="3" y="3" width="18" height="18" rx="4" />
      </>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/webrandustry_apps/',
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
    href: 'https://www.facebook.com/WeBrandustry/',
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
          <SectionLink
            className="ft-logo"
            to="/"
            aria-label="Webrandustry Digital Solutions"
          >
            <i>W</i>

            <span>
              <b>Webrandustry</b>
              <small>Digital Solutions</small>
            </span>
          </SectionLink>

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
                <SectionLink to={l.to}>{l.label}</SectionLink>
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

              <span className="ft-phones">
                <a
                  href="https://wa.me/919619272938"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 96192 72938
                </a>
                <a
                  href="https://wa.me/919892400563"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 98924 00563
                </a>
                <a
                  href="https://wa.me/919594865555"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 95948 65555
                </a>
              </span>
            </li>

            {/* Email */}
            <li>
              <span className="ft-ico">
                <Icon>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </Icon>
              </span>

              <a href="mailto:enquiry@webrandustry.com">
                enquiry@webrandustry.com
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

              <address>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=B%2F60%2C%201st%20Floor%2C%20Madhugiri%20Apartments%2C%20VN%20Purav%20Marg%2C%20Borla%2C%20Union%20Park%2C%20Chembur%2C%20Mumbai%2C%20Maharashtra%20400071"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View our address on Google Maps"
                >
                  B/60, 1st Floor, Madhugiri Apartments,
                  <br />
                  VN Purav Marg, Borla, Union Park,
                  <br />
                  Chembur, Mumbai, Maharashtra 400071
                </a>
              </address>
            </li>

          </ul>
        </div>

        {/* Social */}
        <div className="ft-col">
          <h4>Follow Us</h4>

          <ul className="ft-social">
            {social.map((s) => {
              const isExternal = s.href !== '#';

              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    {...(isExternal && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    <span className="ft-ico">
                      <Icon>{s.icon}</Icon>
                    </span>

                    <span>{s.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="ft-bar">
        <p>
          © {new Date().getFullYear()} Webrandustry Digital Solutions. All Rights Reserved.
        </p>

        <SectionLink
          className="ft-top"
          to="/"
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
        </SectionLink>
      </div>

      {/* Developer credit */}
      <p className="ft-credit">
        Designed &amp; Developed by{' '}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kloud Innovisionz
        </a>
      </p>
    </footer>
  );
}
