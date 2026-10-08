
import { useLayoutEffect, useRef } from 'react';
import './WhyWebrandustry.css';

/* Shared SVG wrapper so every icon gets the same stroke settings */
const Svg = ({ children }) => (
  <svg
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

const POINTS = [
  {
    n: '01',
    title: 'Business First',
    text: 'We begin with your business objective, not a predetermined technology or service.',
    icon: (
      <Svg>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r=".8" fill="currentColor" />
      </Svg>
    ),
  },
  {
    n: '02',
    title: 'Creative + Technical',
    text: 'We combine creative thinking with technical capability.',
    icon: (
      <Svg>
        <path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z" />
        <path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" />
      </Svg>
    ),
  },
  {
    n: '03',
    title: 'End-to-End Capability',
    text: 'Branding, design, technology, marketing and IT infrastructure — connected under one roof.',
    icon: (
      <Svg>
        <rect x="3" y="4" width="7" height="7" rx="2" />
        <rect x="14" y="4" width="7" height="7" rx="2" />
        <rect x="8.5" y="14" width="7" height="7" rx="2" />
        <path d="M6.5 11v1.5h11V11M12 12.5V14" />
      </Svg>
    ),
  },
  {
    n: '04',
    title: 'Custom Approach',
    text: 'Your business is different. Your solution should be too.',
    icon: (
      <Svg>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </Svg>
    ),
  },
  {
    n: '05',
    title: 'One Connected Team',
    text: 'Fewer disconnected vendors. Better coordination between the different parts of your business.',
    icon: (
      <Svg>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
        <circle cx="17.5" cy="9" r="2.4" />
        <path d="M17 14.6c2.4.2 4 1.9 4 4.4" />
      </Svg>
    ),
  },
  {
    n: '06',
    title: 'Built to Grow',
    text: 'We design solutions with your next stage of growth in mind.',
    icon: (
      <Svg>
        <path d="M4 17l5-5 4 4 7-8" />
        <path d="M15 8h5v5" />
      </Svg>
    ),
  },
];

export default function WhyWebrandustry({
  // Tell Us About Your Project → WhatsApp
  primaryHref = 'https://wa.me/919619272938',

  // Request a Consultation → existing section
  secondaryHref = '#lets-talk',
}) {
  const rootRef = useRef(null);

  /* Staggered reveal on scroll. Self-contained, so Home.jsx doesn't need to know about it.
     Elements are hidden with .wy-pre only once JS is running, and cleaned up on unmount. */
  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const items = [
      ...root.querySelectorAll('[data-reveal]'),
    ];

    items.forEach((el) => {
      el.classList.add('wy-pre');
    });

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;

          e.target.classList.remove('wy-pre');
          e.target.classList.add('wy-in');

          io.unobserve(e.target);
        }),
      { threshold: 0.12 }
    );

    items.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();

      items.forEach((el) =>
        el.classList.remove('wy-pre', 'wy-in')
      );
    };
  }, []);

  return (
    <section
      className="wy"
      id="why"
      aria-labelledby="wy-title"
      ref={rootRef}
    >
      <div className="wy__inner">
        <header className="wy__head">
          <span className="wy__pill" data-reveal>
            Why Webrandustry
          </span>

          <h2
            id="wy-title"
            className="wy__title"
            data-reveal
            style={{ '--d': '.06s' }}
          >
            More Than a Vendor.{' '}
            <span className="wy__accent">
              A Business Partner.
            </span>
          </h2>

          <p
            className="wy__lead"
            data-reveal
            style={{ '--d': '.12s' }}
          >
            We begin with your business objective, then bring
            creative thinking and technical capability together
            under one roof.
          </p>
        </header>

        <ul className="wy__grid">
          {POINTS.map((p, i) => (
            <li
              className="wy-card"
              key={p.n}
              data-reveal
              style={{
                '--d': `${0.08 + i * 0.06}s`,
              }}
            >
              <span
                className="wy-card__n"
                aria-hidden="true"
              >
                {p.n}
              </span>

              <span className="wy-card__ic">
                {p.icon}
              </span>

              <h3 className="wy-card__title">
                {p.title}
              </h3>

              <p className="wy-card__text">
                {p.text}
              </p>
            </li>
          ))}
        </ul>

        <div
          className="wy__btns"
          data-reveal
          style={{ '--d': '.2s' }}
        >
          {/* Tell Us About Your Project → WhatsApp */}
          <a
            className="wy-btn wy-btn--primary"
            href={primaryHref}
          >
            Tell Us About Your Project
            <Arrow />
          </a>

          {/* Request a Consultation → existing section */}
          <a
            className="wy-btn wy-btn--line"
            href={secondaryHref}
          >
            Request a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}

