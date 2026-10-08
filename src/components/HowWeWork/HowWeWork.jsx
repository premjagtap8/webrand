
import { useEffect, useRef, useState } from "react";
import "./HowWeWork.css";

/* Copy taken from the Webrandustry website copy (docx). Six steps = a real sequence, so numbering is meaningful. */
const STEPS = [
  {
    id: "discover",
    title: "Discover",
    text: "We start by understanding your business, challenges, customers and objectives.",
  },
  {
    id: "strategise",
    title: "Strategise",
    text: "We determine what needs to be built, designed, marketed or improved, and why.",
  },
  {
    id: "design",
    title: "Design",
    text: "We create the visual, digital and functional experience around your requirements.",
  },
  {
    id: "build",
    title: "Build",
    text: "Our team develops the technology, creative assets and infrastructure required.",
  },
  {
    id: "launch",
    title: "Launch",
    text: "We take your solution, product or campaign into the market.",
  },
  {
    id: "grow",
    title: "Grow",
    text: "We measure performance, identify opportunities and continuously improve.",
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

const HowWeWork = () => {
  const listRef = useRef(null);
  const [inView, setInView] = useState(false);

  // WhatsApp number for Start a Project
  const projectWhatsApp = "https://wa.me/919619272938";

  /* One orchestrated moment: the connector lines draw in sequence the first time the steps scroll into view */
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <section className="hw" id="how-we-work" aria-labelledby="hw-heading">
      <div className="hw__inner">
        <header className="hw__head">
          <div>
            <span className="hw__pill">How We Work</span>

            <h2 id="hw-heading" className="hw__title">
              From Understanding
              <br />
              <span className="hw__accent">to Execution.</span>
            </h2>

            <p className="hw__sub">
              Six clear steps, one connected team, from the first conversation
              to measurable growth.
            </p>
          </div>

          {/* Start a Project → WhatsApp */}
          <a className="hw__cta" href={projectWhatsApp}>
            Start a Project
            <Arrow />
          </a>
        </header>

        <ol
          className={`hw__list ${inView ? "is-in" : ""}`}
          ref={listRef}
        >
          {STEPS.map((s, i) => (
            <li
              key={s.id}
              className={`hw-step ${
                i === STEPS.length - 1 ? "hw-step--final" : ""
              }`}
              style={{ "--i": i }}
            >
              <div className="hw-step__top">
                <span className="hw-step__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className="hw-step__rail"
                  aria-hidden="true"
                />
              </div>

              <h3 className="hw-step__title">
                <span className="hw-sr">
                  Step {i + 1}:{" "}
                </span>
                {s.title}
              </h3>

              <p className="hw-step__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowWeWork;

