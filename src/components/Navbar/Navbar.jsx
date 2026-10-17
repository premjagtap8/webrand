import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/images/WeBrandLogo.jpg';
import './Navbar.css';
import {
  SECTION_ROUTES,
  SectionLink,
  findSection,
} from '../../utils/SectionNav.jsx';

const ArrowIcon = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [stuck, setStuck] = useState(false);
  const navRef = useRef(null);
  const lockUntil = useRef(0);
  const lockTimer = useRef(0);

  // WhatsApp number for Start a Project
  const projectWhatsApp = 'https://wa.me/919619272938';

  // Marks a link active right away and pauses scroll-spy while the page scrolls there
  const activate = useCallback((index) => {
    setActive(index);
    lockUntil.current = Date.now() + 1100;
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(
      () => window.dispatchEvent(new Event('scroll')),
      1150
    );
  }, []);

  // The URL decides the active link (/insights -> Insights); on the 404 page none is active
  useEffect(() => {
    const route = findSection(pathname);
    if (route) activate(SECTION_ROUTES.indexOf(route));
    else setActive(-1);
  }, [pathname, activate]);

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
    let ticking = false;

    const update = () => {
      ticking = false;
      setStuck(window.scrollY > 12);

      // right after a click, trust the clicked link
      if (Date.now() < lockUntil.current) return;

      const els = SECTION_ROUTES.map((r) => document.getElementById(r.id));

      // 404 page: no sections, so no active link
      if (!els.some(Boolean)) {
        setActive(-1);
        return;
      }

      // a section counts once its top passes 45% of the screen (was a fixed 140px)
      const line = Math.max(200, window.innerHeight * 0.45);
      let cur = 0;
      let best = -Infinity;

      els.forEach((el, i) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > best) {
          best = top;
          cur = i;
        }
      });

      // At the very bottom, the last link wins
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (atBottom) cur = SECTION_ROUTES.length - 1;

      setActive(cur);
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
      clearTimeout(lockTimer.current);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`nav${stuck ? ' is-stuck' : ''}`}
      aria-label="Main"
    >
      <SectionLink
        className="logo"
        to="/"
        aria-label="Webrandustry home"
        onClick={() => activate(0)}
      >
        <img src={logo} alt="Webrandustry" width="90" height="76" />
      </SectionLink>

      <ul
        id="navMenu"
        className={open ? 'open' : ''}
        onClick={(e) => {
          if (e.target.closest('a')) setOpen(false);
        }}
      >
        {SECTION_ROUTES.map((l, i) => (
          <li key={l.path} className={i === active ? 'on' : ''}>
            <SectionLink
              to={l.path}
              aria-current={i === active ? 'location' : undefined}
              onClick={() => activate(i)}
            >
              {l.label}
            </SectionLink>
          </li>
        ))}

        {/* Mobile Start a Project */}
        <li className="nav-cta-m">
          <a className="btn primary" href={projectWhatsApp}>
            Start a Project
          </a>
        </li>
      </ul>

      {/* Desktop Start a Project */}
      <a className="btn primary nav-cta" href={projectWhatsApp}>
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