import "./Insights.css";

/*
  PLACEHOLDER ARTICLES - replace with real posts (or fetch them and pass as the `articles` prop).
  - `image`: cover image URL. Leave null to show the gradient cover.
  - `date`:  ISO string (YYYY-MM-DD), formatted for display below.
  The section always shows exactly four cards.

  Placeholder photos come from picsum.photos. Each seed always returns the same photo,
  so the cards look stable. Swap in your own files (e.g. "/images/insights/brand.jpg") later.
*/
const img = (seed) => `https://picsum.photos/seed/${seed}/800/534`;

const DEFAULT_ARTICLES = [
  {
    id: 1,
    category: "Branding",
    title: "What a brand strategy actually changes for a growing business",
    date: "2026-10-07",
    readTime: "5 min read",
    image: img("webrand-insight-brand"),
    href: "/insights",
  },
  {
    id: 2,
    category: "Digital Marketing",
    title: "Visibility vs growth: how to tell what your marketing really delivers",
    date: "2026-09-29",
    readTime: "6 min read",
    image: img("webrand-insight-marketing"),
    href: "/insights",
  },
  {
    id: 3,
    category: "Software",
    title: "CRM, ERP or custom software: how to choose without overspending",
    date: "2026-09-18",
    readTime: "7 min read",
    image: img("webrand-insight-software"),
    href: "/insights",
  },
  {
    id: 4,
    category: "IT Infrastructure",
    title: "Setting up a new office? The IT checklist to get right the first time",
    date: "2026-09-05",
    readTime: "5 min read",
    image: img("webrand-insight-it"),
    href: "/insights",
  },
];

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

/* timeZone: "UTC" keeps a date-only ISO string from shifting a day in other time zones */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const Insights = ({ articles = DEFAULT_ARTICLES, viewAllHref = "/insights" }) => {
  const list = articles.slice(0, 4); // design is built for exactly 4 cards

  return (
    <section className="ins" id="insights" aria-labelledby="ins-heading">
      <div className="ins__inner">
        <header className="ins__head">
          <span className="ins__pill">Insights</span>
          <h2 id="ins-heading" className="ins__title">
            Ideas, Information
            <br />
            <span className="ins__accent">&amp; Digital Thinking.</span>
          </h2>
          <p className="ins__sub">
            Practical perspectives on branding, marketing, software and IT, because technology and
            marketing never stop changing.
          </p>

          <a className="ins__all" href={viewAllHref}>
            View All Insights
            <Arrow />
          </a>
        </header>

        <ul className="ins__grid" role="list">
          {list.map((a, i) => (
            <li className="ins__item" key={a.id}>
              <article
                className={`ins-card ins-card--t${(i % 4) + 1}${a.image ? "" : " ins-card--ph"}`}
              >
                <a className="ins-card__link" href={a.href} aria-labelledby={`ins-title-${a.id}`}>
                  {a.image && (
                    <img
                      className="ins-card__img"
                      src={a.image}
                      alt=""
                      loading="lazy"
                      /* if the photo can't load, hide it and the gradient cover shows instead */
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  <span className="ins-card__tag">{a.category}</span>
                  <span className="ins-card__go" aria-hidden="true">
                    <Arrow />
                  </span>

                  <div className="ins-card__body">
                    <p className="ins-card__meta">
                      <time dateTime={a.date}>{formatDate(a.date)}</time>
                      <span aria-hidden="true" className="ins-card__dot" />
                      <span>{a.readTime}</span>
                    </p>
                    <h3 id={`ins-title-${a.id}`} className="ins-card__title">
                      {a.title}
                    </h3>
                  </div>
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Insights;
