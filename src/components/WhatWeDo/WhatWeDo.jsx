import { useEffect, useRef } from 'react';
import './WhatWeDo.css';

const Chevron = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const SeeMore = () => (
  <a className="w-more" href="#">
    See more{' '}
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  </a>
);

// color = capability colour (tokens.css), ink = icon colour that stays readable on it
// (navy on orange / gold / cyan, white on deep blue / coral)
const CARDS = [
  {
    size: 's2', n: '01', title: 'Brand',
    color: 'var(--cap-brand)', ink: 'var(--navy)',
    text: 'Build a distinctive identity that people remember.',
    chips: ['Brand Strategy', 'Logo Design', 'Packaging'], more: '+2',
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
    size: 's2', n: '02', title: 'Create',
    color: 'var(--cap-create)', ink: 'var(--navy)',
    text: 'Turn ideas into compelling digital and physical experiences.',
    chips: ['Graphic Design', '3D Modelling', '3D Printing'], more: '+2',
    icon: (
      <>
        <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3z" strokeDasharray="2.4 3" />
        <circle cx="12" cy="12" r="1.2" />
        <circle cx="12" cy="3" r="0.4" />
        <circle cx="12" cy="21" r="0.4" />
        <circle cx="4.2" cy="7.5" r="0.4" />
        <circle cx="19.8" cy="7.5" r="0.4" />
        <circle cx="4.2" cy="16.5" r="0.4" />
        <circle cx="19.8" cy="16.5" r="0.4" />
      </>
    ),
  },
  {
    size: 's2', n: '03', title: 'Build',
    color: 'var(--cap-build)', ink: 'var(--white)',
    text: 'Build the digital tools your business needs to operate.',
    chips: ['Websites', 'Mobile Apps', 'CRM'], more: '+6',
    icon: (
      <>
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </>
    ),
  },
  {
    size: 's3', n: '04', title: 'Grow',
    color: 'var(--cap-grow)', ink: 'var(--white)',
    text: 'Turn visibility into engagement, leads and sales.',
    chips: ['Social Media', 'SEO', 'Google Ads', 'Lead Generation'], more: '+3',
    icon: (
      <>
        <path d="M16 7h6v6" />
        <path d="m22 7-8.5 8.5-5-5L2 17" />
      </>
    ),
  },
  {
    size: 's3', n: '05', title: 'Connect',
    color: 'var(--cap-connect)', ink: 'var(--navy)',
    text: 'Build the technology infrastructure that keeps your business connected.',
    chips: ['Networks', 'Servers', 'Office IT', 'Cloud'], more: '+3',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  },
];

const FLOW = ['Idea', 'Brand', 'Design', 'Technology', 'Marketing', 'Sales', 'Growth'];

export default function WhatWeDo() {
  const gridRef = useRef(null);

  // Staggered reveal on scroll + cursor spotlight / slight 3D tilt
  useEffect(() => {
    const cards = [...gridRef.current.querySelectorAll('.w-card')];
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups = [];

    cards.forEach((c, i) => {
      c.style.setProperty('--i', i);
      c.classList.add('w-pre');
    });

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.remove('w-pre');
          e.target.classList.add('w-in');
          io.unobserve(e.target);
        }),
      { threshold: 0.15 }
    );
    cards.forEach((c) => io.observe(c));
    cleanups.push(() => {
      io.disconnect();
      cards.forEach((c) => c.classList.remove('w-pre'));
    });

    if (canHover) {
      cards.forEach((c) => {
        const onMove = (e) => {
          const r = c.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          c.style.setProperty('--mx', x + 'px');
          c.style.setProperty('--my', y + 'px');
          if (!calm) {
            c.style.setProperty('--ry', ((x / r.width - 0.5) * 6).toFixed(2) + 'deg');
            c.style.setProperty('--rx', ((0.5 - y / r.height) * 6).toFixed(2) + 'deg');
          }
        };
        const onLeave = () => {
          c.style.setProperty('--rx', '0deg');
          c.style.setProperty('--ry', '0deg');
        };
        c.addEventListener('pointermove', onMove);
        c.addEventListener('pointerleave', onLeave);
        cleanups.push(() => {
          c.removeEventListener('pointermove', onMove);
          c.removeEventListener('pointerleave', onLeave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section className="what" id="what-we-do">
      <div className="sec-head">
        <span className="pill">What we do</span>
        <h2>One Partner. <em>Multiple Capabilities.</em></h2>
        <p>Businesses don't operate in separate departments, so why should their technology, branding and marketing?</p>
      </div>

      <div className="w-grid" ref={gridRef}>
        {CARDS.map((c) => {
          const icon = (
            <span className="w-ic">
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">{c.icon}</svg>
            </span>
          );
          const chips = (
            <ul className="chips">
              {c.chips.map((t) => <li key={t}>{t}</li>)}
              <li className="more">{c.more}</li>
            </ul>
          );

          return (
            <article
              className={`w-card ${c.size}`}
              key={c.n}
              style={{ '--cap': c.color, '--cap-ink': c.ink }}
            >
              {c.size === 's2' ? (
                <>
                  <div className="w-head">
                    {icon}
                    <span className="w-n">{c.n}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  {chips}
                </>
              ) : (
                <>
                  <div className="w-top">
                    {icon}
                    <div>
                      <h3>{c.title}</h3>
                      <p>{c.text}</p>
                    </div>
                    <span className="w-n">{c.n}</span>
                  </div>
                  {chips}
                </>
              )}
              <SeeMore />
            </article>
          );
        })}
      </div>

      <div className="flow">
        <small>From idea to growth</small>
        <div className="flow-row">
          {FLOW.map((label, i) => (
            <span key={label} style={{ display: 'contents' }}>
              <span className={`f-chip${i === FLOW.length - 1 ? ' last' : ''}`}>{label}</span>
              {i < FLOW.length - 1 && <Chevron />}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
