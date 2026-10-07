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
  DUMMY DATA - replace titles, summaries and `image` with real projects before launch.
  - `featured: true` -> shown under "All" (keep this to 6 or fewer)
  - `image`: path/URL of a cover image. Leave null to show the gradient cover.
  - `href`: link to the case study / project page.

  Placeholder photos come from picsum.photos. Each seed always returns the same photo,
  so the cards look stable. Swap in your own files (e.g. "/images/work/lumora.jpg") later.
*/
const img = (seed) => `https://picsum.photos/seed/${seed}/800/500`;

const PROJECTS = [
  { id: 1, title: "Lumora Skincare Rebrand", summary: "A fresh identity that made the range stand out on every shelf.", category: "Branding", featured: true, image: img("webrand-lumora"), href: "/our-work" },
  { id: 2, title: "Northwind Logistics Website", summary: "A fast, clear site that doubled monthly quote requests.", category: "Websites", featured: true, image: img("webrand-northwind"), href: "/our-work" },
  { id: 3, title: "ClinicFlow Patient Portal", summary: "Appointments and records in one secure platform for 12 clinics.", category: "Software", featured: true, image: img("webrand-clinicflow"), href: "/our-work" },
  { id: 4, title: "Kaveri Handlooms Store", summary: "A mobile-first storefront with one-tap checkout.", category: "E-commerce", featured: true, image: img("webrand-kaveri"), href: "/our-work" },
  { id: 5, title: "FitTrail Fitness App", summary: "A habit-tracking app that reached 50k installs in three months.", category: "Mobile Apps", featured: true, image: img("webrand-fittrail"), href: "/our-work" },
  { id: 6, title: "Brewline Coffee Packaging", summary: "Shelf-ready pouch design that wins attention in a crowded aisle.", category: "Packaging", featured: true, image: img("webrand-brewline"), href: "/our-work" },
  { id: 7, title: "Pulse Music Festival Campaign", summary: "Posters, social and stage visuals with one bold look.", category: "Graphic Design", featured: false, image: img("webrand-pulse"), href: "/our-work" },
  { id: 8, title: "UrbanNest Lead Generation", summary: "Targeted ads and landing pages that cut cost per lead by 38%.", category: "Digital Marketing", featured: false, image: img("webrand-urbannest"), href: "/our-work" },
  { id: 9, title: "Meridian Offices Network Rollout", summary: "Secure Wi-Fi and cabling across three floors with zero downtime.", category: "IT Infrastructure", featured: false, image: img("webrand-meridian"), href: "/our-work" },
  { id: 10, title: "Aero Gadgets Prototypes", summary: "3D-printed product models ready for testing in days, not weeks.", category: "3D Design & Printing", featured: false, image: img("webrand-aero"), href: "/our-work" },
  { id: 11, title: "Fernhill Organic Identity", summary: "A warm, natural brand system from logo to labels.", category: "Branding", featured: false, image: img("webrand-fernhill"), href: "/our-work" },
  { id: 12, title: "Orbit Academy Learning Site", summary: "An easy-to-use course website with built-in enrolment.", category: "Websites", featured: false, image: img("webrand-orbit"), href: "/our-work" },
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
                  {p.image && (
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      /* if the photo can't load, hide it and the gradient cover shows instead */
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
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
