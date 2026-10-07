import { Fragment } from 'react';
import './Services.css';

/* ---- shared little icons (same markup as before) ---- */
const Chevron = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const Arrow = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Check = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/* ---- data ---- */
// Order matters: it is the tab order. Icons are the inner SVG shapes only.
const SERVICES = [
  {
    label: 'Branding and Creative',
    icon: (
      <>
        <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
        <circle cx="13.5" cy="6.5" r="0.5" />
        <circle cx="17.5" cy="10.5" r="0.5" />
        <circle cx="6.5" cy="12.5" r="0.5" />
        <circle cx="8.5" cy="7.5" r="0.5" />
      </>
    ),
  },
  {
    label: '3D Design and Printing',
    icon: (
      <>
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
      </>
    ),
  },
  {
    label: 'Software Development',
    icon: (
      <>
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </>
    ),
  },
  {
    label: 'Web and Mobile',
    icon: (
      <>
        <rect width="14" height="20" x="5" y="2" rx="2" />
        <path d="M12 18h.01" />
      </>
    ),
  },
  {
    label: 'Digital Marketing',
    icon: (
      <>
        <path d="m3 11 18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </>
    ),
  },
  {
    label: 'E-commerce',
    icon: (
      <>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </>
    ),
  },
  {
    label: 'IT Infrastructure',
    icon: (
      <>
        <rect width="20" height="8" x="2" y="2" rx="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" />
        <path d="M6 6h.01" />
        <path d="M6 18h.01" />
      </>
    ),
  },
];

// Pure refactor: the panel content below is still the Software Development one.
// (Later: move this into SERVICES[i].panel and drive ACTIVE from useState.)
const ACTIVE = 2;

const PANEL_ITEMS = [
  { name: 'CRM', desc: 'customers, enquiries and sales follow-ups' },
  { name: 'ERP', desc: 'operations and key information in one place' },
  { name: 'HRMS', desc: 'employees, attendance and HR processes' },
  { name: 'LMS', desc: 'structured learning and training' },
  { name: 'Hospital ERP', desc: 'built around healthcare operations' },
];

const BUILD_STEPS = [
  'Requirement Analysis',
  'Architecture',
  'UI/UX',
  'Development',
  'Testing',
  'Deployment',
  'Support',
];

const pad = (n) => String(n).padStart(2, '0');

export default function Services() {
  return (
    <section className="svc">
      <div className="sec-head">
        <span className="pill">Our services</span>
        <h2>Every capability, <em>in depth.</em></h2>
        <p>Pick a service to see what we build and how we work.</p>
      </div>
      <div className="sv-wrap">
        <div className="sv-list">
          {SERVICES.map((s, i) => (
            <button
              key={s.label}
              className={i === ACTIVE ? 'sv-tab on' : 'sv-tab'}
              type="button"
            >
              <span className="sv-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  {s.icon}
                </svg>
              </span>
              {s.label}
              {i === ACTIVE && <i className="sv-prog" />}
            </button>
          ))}
        </div>
        <div className="sv-panel">
          <div className="sv-top">
            <span className="sv-tag">{SERVICES[ACTIVE].label}</span>
            <span>{pad(ACTIVE + 1)} / {pad(SERVICES.length)}</span>
          </div>
          <h3>Don't Change Your Business to Fit Software.</h3>
          <p>Every business operates differently. When off-the-shelf software doesn't fit your processes, we build around the way you actually work.</p>
          <ul className="sv-list-i">
            {PANEL_ITEMS.map((it) => (
              <li key={it.name}>
                <Check />
                <span><b>{it.name}</b> · {it.desc}</span>
              </li>
            ))}
          </ul>
          <div className="build-box">
            <small>How we build it</small>
            <div className="p-row">
              {BUILD_STEPS.map((step, i) => (
                <Fragment key={step}>
                  {i > 0 && <Chevron />}
                  <span className={i === BUILD_STEPS.length - 1 ? 'p-chip last' : 'p-chip'}>{step}</span>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="sv-btns">
            <a className="btn primary" href="#">Start a Project <Arrow /></a>
            <a className="lnk" href="#">Explore software <Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
