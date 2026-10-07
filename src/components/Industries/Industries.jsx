import './Industries.css';

const Arrow = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const ArrowUpRight = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

// icon = inner SVG shapes only; chips = visible chips, more = the "+N" chip
const INDUSTRIES = [
  {
    name: 'FMCG',
    chips: ['Branding', 'Packaging'],
    more: '+3',
    icon: (
      <>
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
        <path d="M12 22V12" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="m7.5 4.27 9 5.15" />
      </>
    ),
  },
  {
    name: 'Healthcare',
    chips: ['Hospital ERP', 'Websites'],
    more: '+3',
    icon: (
      <>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
      </>
    ),
  },
  {
    name: 'Pharmaceuticals',
    chips: ['Websites', 'Software'],
    more: '+2',
    icon: (
      <>
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
        <path d="m8.5 8.5 7 7" />
      </>
    ),
  },
  {
    name: 'Retail',
    chips: ['Branding', 'E-commerce'],
    more: '+2',
    icon: (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
  },
  {
    name: 'Manufacturing',
    chips: ['ERP', 'Networking'],
    more: '+2',
    icon: (
      <>
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M17 18h1" />
        <path d="M12 18h1" />
        <path d="M7 18h1" />
      </>
    ),
  },
  {
    name: 'Education',
    chips: ['LMS', 'Websites'],
    more: '+2',
    icon: (
      <>
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </>
    ),
  },
  {
    name: 'Startups',
    chips: ['Brand Identity', 'Website'],
    more: '+3',
    icon: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </>
    ),
  },
  {
    name: 'Professional Services',
    chips: ['Branding', 'Websites'],
    more: '+3',
    icon: (
      <>
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      </>
    ),
  },
];

export default function Industries() {
  return (
    <section className="ind" id="industries">
      <div className="sec-head">
        <span className="pill">Industries we serve</span>
        <h2><span className="nw">Different Businesses. Different Challenges.</span>{" "}<em>One Flexible Approach.</em></h2>
        <p>Find your industry and see what we build for it.</p>
      </div>
      <div className="i-grid">
        {INDUSTRIES.map((ind) => (
          <article className="i-card" key={ind.name}>
            <span className="i-ic">
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                {ind.icon}
              </svg>
            </span>
            <span className="i-go">
              <ArrowUpRight />
            </span>
            <h3>{ind.name}</h3>
            <ul className="chips">
              {ind.chips.map((c) => (
                <li key={c}>{c}</li>
              ))}
              <li className="more">{ind.more}</li>
            </ul>
          </article>
        ))}
      </div>
      <div className="i-cta">
        <a href="#">Don't see your industry? Talk to us <Arrow /></a>
      </div>
    </section>
  );
}
