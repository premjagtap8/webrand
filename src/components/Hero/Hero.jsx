import { useEffect, useRef } from 'react';
import './Hero.css';

const NODES = [
  { dx: '-91px', dy: '-171px', title: 'Brand', sub: 'Identity · Logo' },
  { dx: '120px', dy: '-129px', title: 'Create', sub: 'Design · 3D' },
  { dx: '129px', dy: '8px', title: 'Build', sub: 'Web · Software' },
  { dx: '-112px', dy: '72px', title: 'Connect', sub: 'Network · IT' },
  { dx: '68px', dy: '163px', title: 'Grow', sub: 'SEO · Ads' },
];

const ArrowIcon = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

export default function Hero() {
  const heroRef = useRef(null);
  const orbitRef = useRef(null);

  // Pointer parallax on the orbit (skipped for reduced motion)
  useEffect(() => {
    const hero = heroRef.current;
    const orbit = orbitRef.current;
    if (!hero || !orbit) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const onMove = (e) => {
      const r = orbit.getBoundingClientRect();
      orbit.style.setProperty('--px', clamp(((e.clientX - r.left) / r.width - 0.5) * 2));
      orbit.style.setProperty('--py', clamp(((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    const onLeave = () => {
      orbit.style.setProperty('--px', 0);
      orbit.style.setProperty('--py', 0);
    };

    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    return () => {
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <header className="hero" ref={heroRef}>
      <div>
        <span className="h-tag">
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
          </svg>{' '}
          Webrandustry Digital Solutions
        </span>
        <h1>
          <span>Building Brands.</span>
          <span>Creating Technology.</span>
          <em>Driving Growth.</em>
        </h1>
        <p>We bring branding, design, technology, marketing and IT infrastructure together to help businesses launch, operate and grow.</p>
        <div className="btns">
          <a className="btn primary" href="#contact-us">Start a Project <ArrowIcon /></a>
          <a className="btn ghost-btn" href="#lets-talk">Talk to Our Experts</a>
        </div>
        <div className="h-sub">Branding · Software · Marketing · IT · 3D</div>
      </div>

      <div className="orbit" ref={orbitRef}>
        <div className="o-origin">
          <div className="o-ring" />
          <svg>
            <g>
              <line x1="0" y1="0" x2="-91" y2="-171" />
              <line x1="0" y1="0" x2="120" y2="-129" />
              <line x1="0" y1="0" x2="129" y2="8" />
              <line x1="0" y1="0" x2="-112" y2="72" />
              <line x1="0" y1="0" x2="68" y2="163" />
            </g>
          </svg>
          <svg className="o-rays" aria-hidden="true">
            <line x1="50%" y1="50%" x2="22%" y2="10%" />
            <line x1="50%" y1="50%" x2="80%" y2="20%" />
            <line x1="50%" y1="50%" x2="85%" y2="52%" />
            <line x1="50%" y1="50%" x2="14%" y2="68%" />
            <line x1="50%" y1="50%" x2="66%" y2="90%" />
          </svg>
          <div className="o-core">W</div>
          {NODES.map((n) => (
            <div className="o-node" key={n.title} style={{ '--dx': n.dx, '--dy': n.dy }}>
              <b>{n.title}</b>
              <small>{n.sub}</small>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}