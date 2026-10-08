
import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/images/WeBrandLogo.jpg';
import './Navbar.css';

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'What We Do', href: '#what-we-do' },
  { label: 'Industries', href: '#industries' },
  { label: 'Our Work', href: '#our-work' },
  { label: 'About Us', href: '#why' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact-us' },
];

const ArrowIcon = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [stuck, setStuck] = useState(false);
  const navRef = useRef(null);

  // WhatsApp number for Start a Project
  const projectWhatsApp = 'https://wa.me/919619272938';

  // Escape or a click outside the nav closes the mobile menu
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const onDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  // Scroll-spy + shadow
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href));
    let ticking = false;

    const update = () => {
      ticking = false;

      const line = 140;
      let cur = 0;
      let best = -Infinity;

      sections.forEach((s, i) => {
        if (!s) return;

        const top = s.getBoundingClientRect().top;

        if (top <= line && top > best) {
          best = top;
          cur = i;
        }
      });

      // At the very bottom, the last link wins
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (atBottom) {
        cur = LINKS.length - 1;
      }

      setActive(cur);
      setStuck(window.scrollY > 12);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`nav${stuck ? ' is-stuck' : ''}`}
      aria-label="Main"
    >
      <a className="logo" href="#top" aria-label="Webrandustry home">
        <img
          src={logo}
          alt="Webrandustry"
          width="90"
          height="76"
        />
      </a>

      <ul
        id="navMenu"
        className={open ? 'open' : ''}
        onClick={(e) => {
          if (e.target.closest('a')) setOpen(false);
        }}
      >
        {LINKS.map((l, i) => (
          <li
            key={l.href}
            className={i === active ? 'on' : ''}
          >
            <a
              href={l.href}
              aria-current={
                i === active ? 'location' : undefined
              }
            >
              {l.label}
            </a>
          </li>
        ))}

        {/* Mobile Start a Project */}
        <li className="nav-cta-m">
          <a
            className="btn primary"
            href={projectWhatsApp}
          >
            Start a Project
          </a>
        </li>
      </ul>

      {/* Desktop Start a Project */}
      <a
        className="btn primary nav-cta"
        href={projectWhatsApp}
      >
        Start a Project <ArrowIcon />
      </a>

      <button
        className="nav-toggle"
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="navMenu"
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
