import { useEffect } from "react";
import "./NotFound.css";

export default function NotFound() {
  // Tab title for the 404 page
  useEffect(() => {
    const previous = document.title;
    document.title = "Page not found";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <section className="nf" aria-labelledby="nf-heading">
      {/* big faint 404 behind the text (decorative) */}
      <span className="nf__bg" aria-hidden="true">
        404
      </span>

      <div className="nf__content">
        <h1 id="nf-heading" className="nf__title">
          Not Found
        </h1>

        <p className="nf__text">
          Unfortunately the page you are looking for has been moved or deleted
        </p>

        <a className="nf__btn" href="/">
          Go to Homepage
        </a>
      </div>
    </section>
  );
}
