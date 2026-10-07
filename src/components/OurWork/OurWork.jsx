import { useCallback, useEffect, useRef, useState } from "react";
import "./OurWork.css";

/* Categories come straight from the website copy (docx). */
const CATEGORIES = [
  "All",
  "Branding",
  "Graphic Design",
  "Packaging",
  "Websites",
  "E-commerce",
  "Software",
  "Mobile Apps",
  "Digital Marketing",
  "IT Infrastructure",
  "3D Design & Printing",
];

/*
  PLACEHOLDER DATA - replace titles, summaries and `image` with real projects.
  - `featured: true` -> shown under "All" (keep this to 6 or fewer)
  - `image`: path/URL of a cover image. Leave null to show the blue gradient cover.
  - `href`: link to the case study / project page.
*/
const PROJECTS = [
  { id: 1, title: "Project title goes here", summary: "One line about the result.", category: "Branding", featured: true, image: null, href: "/our-work" },
  { id: 2, title: "Project title goes here", summary: "One line about the result.", category: "Websites", featured: true, image: null, href: "/our-work" },
  { id: 3, title: "Project title goes here", summary: "One line about the result.", category: "Software", featured: true, image: null, href: "/our-work" },
  { id: 4, title: "Project title goes here", summary: "One line about the result.", category: "E-commerce", featured: true, image: null, href: "/our-work" },
  { id: 5, title: "Project title goes here", summary: "One line about the result.", category: "Mobile Apps", featured: true, image: null, href: "/our-work" },
  { id: 6, title: "Project title goes here", summary: "One line about the result.", category: "Packaging", featured: true, image: null, href: "/our-work" },
  { id: 7, title: "Project title goes here", summary: "One line about the result.", category: "Graphic Design", featured: false, image: null, href: "/our-work" },
  { id: 8, title: "Project title goes here", summary: "One line about the result.", category: "Digital Marketing", featured: false, image: null, href: "/our-work" },
  { id: 9, title: "Project title goes here", summary: "One line about the result.", category: "IT Infrastructure", featured: false, image: null, href: "/our-work" },
  { id: 10, title: "Project title goes here", summary: "One line about the result.", category: "3D Design & Printing", featured: false, image: null, href: "/our-work" },
  { id: 11, title: "Project title goes here", summary: "One line about the result.", category: "Branding", featured: false, image: null, href: "/our-work" },
  { id: 12, title: "Project title goes here", summary: "One line about the result.", category: "Websites", featured: false, image: null, href: "/our-work" },
];

const MAX_CARDS = 6;

const Arrow = ({ direction = "right" }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={direction === "left" ? { transform: "rotate(180deg)" } : undefined}
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const OurWork = ({ viewAllHref = "/our-work" }) => {
  const [active, setActive] = useState("All");
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const trackRef = useRef(null);

  const visible = (
    active === "All"
      ? PROJECTS.filter((p) => p.featured)
      : PROJECTS.filter((p) => p.category === active)
  ).slice(0, MAX_CARDS);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  // Reset to the start whenever the filter changes
  useEffect(() => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: 0 });
    updateScrollState();
  }, [active, updateScrollState]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".ow-card");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const hasOverflow = canPrev || canNext;

  return (
    <section className="ow" id="our-work" aria-labelledby="ow-heading">
      <div className="ow__inner">
        {/* Header + arrows */}
        <header className="ow__head">
          <div className="ow__titleWrap">
            <span className="ow__pill">Our Work</span>
            <h2 id="ow-heading" className="ow__title">
              Ideas We&rsquo;ve Turned
              <br />
              <span className="ow__accent">Into Reality.</span>
            </h2>
            <p className="ow__sub">Explore selected projects across our capabilities.</p>
          </div>

          <div className="ow__arrows" aria-label="Scroll projects">
            <button
              type="button"
              className="ow__arrow"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous projects"
            >
              <Arrow direction="left" />
            </button>
            <button
              type="button"
              className="ow__arrow"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next projects"
            >
              <Arrow />
            </button>
          </div>
        </header>

        {/* Filters: one scrollable row, so they never add height */}
        <div className="ow__filters" role="group" aria-label="Filter projects by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`ow__chip ${active === cat ? "is-active" : ""}`}
              aria-pressed={active === cat}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div
          className="ow__track"
          ref={trackRef}
          onScroll={updateScrollState}
          key={active}
          tabIndex={0}
          aria-label={`${active} projects`}
        >
          {visible.map((p, i) => (
            <article className={`ow-card ow-card--t${(i % 4) + 1}`} key={p.id}>
              <a className="ow-card__link" href={p.href} aria-label={`${p.title} - ${p.category}`}>
                <div className="ow-card__media">
                  {p.image && <img src={p.image} alt="" loading="lazy" />}
                  <span className="ow-card__tag">{p.category}</span>
                  <span className="ow-card__go" aria-hidden="true">
                    <Arrow />
                  </span>
                </div>
                <div className="ow-card__body">
                  <h3 className="ow-card__title">{p.title}</h3>
                  <p className="ow-card__summary">{p.summary}</p>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Footer: progress + CTA */}
        <footer className="ow__foot">
          <div className={`ow__progress ${hasOverflow ? "" : "is-hidden"}`} aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(progress, 0.12)})` }} />
          </div>
          <a className="ow__cta" href={viewAllHref}>
            View Our Work
            <Arrow />
          </a>
        </footer>
      </div>
    </section>
  );
};

export default OurWork;
