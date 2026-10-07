import './CaseStudies.css'

/* ------------------------------------------------------------------
   Replace the placeholder content with real projects.
   - Keep `sample: true` while the text is placeholder; remove it once real.
   - `href` should point to that project's full case study page, which is
     where the 4 parts live (Challenge, Approach, What we delivered, Outcome).
   - The section shows at most 5 cards (4 is the sweet spot).
------------------------------------------------------------------- */
const CASE_DATA = [
  {
    id: 'cs-1',
    category: 'Branding',
    title: 'Case study title one',
    sample: true,
    challenge: "Placeholder text. Describe the client's problem and what was at stake.",
    outcome: 'Placeholder text. Describe the measurable result for the client.',
    metric: { value: '00%', label: 'Result metric' },
    href: '#',
  },
  {
    id: 'cs-2',
    category: 'Websites & E-commerce',
    title: 'Case study title two',
    sample: true,
    challenge: "Placeholder text. Describe the client's problem and what was at stake.",
    outcome: 'Placeholder text. Describe the measurable result for the client.',
    metric: { value: '00x', label: 'Result metric' },
    href: '#',
  },
  {
    id: 'cs-3',
    category: 'Software & IT',
    title: 'Case study title three',
    sample: true,
    challenge: "Placeholder text. Describe the client's problem and what was at stake.",
    outcome: 'Placeholder text. Describe the measurable result for the client.',
    metric: { value: '00d', label: 'Result metric' },
    href: '#',
  },
  {
    id: 'cs-4',
    category: 'Digital Marketing',
    title: 'Case study title four',
    sample: true,
    challenge: "Placeholder text. Describe the client's problem and what was at stake.",
    outcome: 'Placeholder text. Describe the measurable result for the client.',
    metric: { value: '00+', label: 'Result metric' },
    href: '#',
  },
]

/* never more than 5 cards */
const CASES = CASE_DATA.slice(0, 5)

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 7h10v10M7 17 17 7" />
  </svg>
)

export default function CaseStudies() {
  return (
    <section className="cs" id="case-studies" aria-labelledby="cs-title">
      <div className="cs__inner">
        {/* ---------- Header: centred; "Explore" sits bottom-right on desktop ---------- */}
        <header className="cs__head">
          <span className="cs__pill">Case Studies</span>
          <h2 className="cs__title" id="cs-title">
            The Challenge. The Solution. <span className="cs__accent">The Outcome.</span>
          </h2>
          <p className="cs__sub">
            We believe the best way to demonstrate our capabilities is through the work we&apos;ve done.
          </p>
          <a className="cs__all" href="#">
            Explore Case Studies
            <ArrowUpRight />
          </a>
        </header>

        {/* ---------- One compact row of small cards ---------- */}
        <ul className="cs__grid">
          {CASES.map((c, i) => (
            <li className="cs__item" key={c.id}>
              <article className={`cs-card cs-card--t${(i % 5) + 1}`}>
                <div className="cs-card__cover">
                  <span className="cs-card__tag">{c.category}</span>
                  {c.sample && <span className="cs-card__sample">Sample</span>}
                  <div className="cs-card__metric">
                    <b>{c.metric.value}</b>
                    <small>{c.metric.label}</small>
                  </div>
                  <span className="cs-card__go" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </div>

                <div className="cs-card__body">
                  <h3 className="cs-card__title">
                    <a className="cs-card__link" href={c.href} title={c.title}>
                      {c.title}
                    </a>
                  </h3>
                  <dl className="cs-card__facts">
                    <div>
                      <dt>Challenge</dt>
                      <dd>{c.challenge}</dd>
                    </div>
                    <div>
                      <dt>Outcome</dt>
                      <dd>{c.outcome}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
