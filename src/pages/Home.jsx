import { useEffect } from 'react';
import './Home.css';

export default function Home() {
  // All the interactions (nav menu + scroll-spy, How-we-work stepper, service tabs,
  // work / insights filters, case-study switcher, reveal-on-scroll) are wired here
  // against the rendered DOM, and fully removed again on unmount.
  useEffect(() => {
    const cleanups = [];
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };
    (() => {
      (() => {
        const root = document.querySelector('[data-how]');
        const scroller = root.querySelector('[data-scroller]');
        const nodes = [...root.querySelectorAll('.how-node')];
        const steps = [...root.querySelectorAll('.how-step')];
        const track = root.querySelector('.how-track');
        const pinMQ = window.matchMedia('(min-width:900px) and (prefers-reduced-motion:no-preference)');
        const ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
        let active = -1;

        // "Next" buttons: advance, and on the last step loop back to Discover
        steps.forEach((s, i) => {
          const b = s.querySelector('.next');
          b.innerHTML = (i === steps.length - 1 ? 'Back to ' : 'Next: ') + s.dataset.next + ' ' + ARROW;
          on(b, 'click', () => goTo((i + 1) % steps.length));
        });

        function setActive(i) {
          if (i === active) return;
          active = i;
          steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
          nodes.forEach((n, k) => {
            n.classList.toggle('is-active', k === i);
            n.classList.toggle('is-done', k < i);
            n.toggleAttribute('aria-current', k === i);
            if (k === i) n.setAttribute('aria-current', 'step');
          });
          track.style.setProperty('--fill', i / (steps.length - 1));
        }

        function bounds() {
          const top = scroller.getBoundingClientRect().top + window.scrollY;
          return { top, total: scroller.offsetHeight - window.innerHeight };
        }

        function goTo(i) {
          if (pinMQ.matches) {
            const { top, total } = bounds();
            window.scrollTo({ top: top + total * ((i + .5) / steps.length), behavior: 'smooth' });
          }
          setActive(i);
        }

        function onScroll() {
          if (!pinMQ.matches) return;
          const { top, total } = bounds();
          const p = Math.min(1, Math.max(0, (window.scrollY - top) / total));
          setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
        }

        nodes.forEach((n, i) => {
          on(n, 'click', () => goTo(i));
          on(n, 'keydown', e => {
            const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
            if (!d) return;
            e.preventDefault();
            const j = (i + d + nodes.length) % nodes.length;
            nodes[j].focus(); goTo(j);
          });
        });

        on(window, 'scroll', onScroll, { passive: true });
        on(window, 'resize', onScroll);
        on(pinMQ, 'change', onScroll);
        setActive(0);
        onScroll();
      })();

      /* Why Webrandustry reveal.
         Once the entrance transition has finished, the element also gets a "settled" class,
         so hover effects (cards) react instantly instead of inheriting the reveal's delay. */
      (function () {
        const calmMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const io = new IntersectionObserver(es => es.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add('in');
          if (calmMotion) {
            el.classList.add('settled');
          } else {
            const done = (ev) => {
              if (ev.target !== el || ev.propertyName !== 'opacity') return;
              el.classList.add('settled');
              el.removeEventListener('transitionend', done);
            };
            el.addEventListener('transitionend', done);
          }
          io.unobserve(el);
        }), { threshold: .12 });
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
        cleanups.push(() => io.disconnect());
      })();

      /* Our Work filter */
      (function () {
        var grid = document.getElementById('wkGrid'); if (!grid) return;
        var chips = document.querySelectorAll('.wk-chip'), cards = grid.querySelectorAll('.wk-card');
        chips.forEach(function (c) {
          on(c, 'click', function () {
            var f = c.dataset.f;
            chips.forEach(function (x) { var on = x === c; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on) });
            grid.classList.toggle('filtered', f !== 'all');
            cards.forEach(function (card, i) {
              var show = f === 'all' || card.dataset.cat === f;
              card.hidden = !show;
              if (show) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; card.style.animationDelay = (i % 6) * .05 + 's' }
            });
          })
        });
      })();


      /* Case studies switcher */
      (function () {
        var picks = document.querySelectorAll('.cs-pick'); if (!picks.length) return;
        var cat = document.getElementById('csCat'), ttl = document.getElementById('csTitle'), steps = document.getElementById('csSteps');
        picks.forEach(function (b, i) {
          on(b, 'click', function () {
            picks.forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on) });
            cat.textContent = b.dataset.cat; ttl.textContent = b.dataset.title;
            steps.querySelectorAll('.cs-step').forEach(function (el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '' });
          });
          on(b, 'keydown', function (e) {
            var d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0; if (!d) return;
            e.preventDefault(); var n = picks[(i + d + picks.length) % picks.length]; n.focus(); n.click();
          });
        });
      })();


      /* Insights filter */
      (function () {
        var grid = document.getElementById('insGrid'); if (!grid) return;
        var chips = document.querySelectorAll('.ins-chip'), cards = grid.querySelectorAll('.ins-card');
        chips.forEach(function (c) {
          on(c, 'click', function () {
            var f = c.dataset.f;
            chips.forEach(function (x) { var on = x === c; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on) });
            grid.classList.toggle('filtered', f !== 'all');
            var n = 0;
            cards.forEach(function (card) {
              var show = f === 'all' || card.dataset.cat === f; card.hidden = !show;
              if (show) { card.style.animation = 'none'; void card.offsetWidth; card.style.animation = ''; card.style.animationDelay = (n++ % 6) * .05 + 's' }
            });
          })
        });
      })();


      (function () {
        var b = document.querySelector('.nav-toggle'), m = document.getElementById('navMenu'); if (!b || !m) return;
        function set(o) { m.classList.toggle('open', o); b.setAttribute('aria-expanded', o); b.setAttribute('aria-label', o ? 'Close menu' : 'Open menu') }
        on(b, 'click', function () { set(!m.classList.contains('open')) });
        on(m, 'click', function (e) { if (e.target.closest('a')) set(false) });
        on(document, 'keydown', function (e) { if (e.key === 'Escape') set(false) });
        var ls = [].slice.call(m.querySelectorAll('li:not(.nav-cta-m)'));
        var secs = ls.map(function (li) { return document.querySelector(li.firstChild.getAttribute('href')) });
        function spy() {
          var y = window.scrollY + 140, cur = 0, best = -1;
          secs.forEach(function (s, i) {
            if (s && s.offsetTop <= y && s.offsetTop > best) { best = s.offsetTop; cur = i }
          });
          ls.forEach(function (li, i) { li.classList.toggle('on', i === cur) });
        }
        on(window, 'scroll', spy, { passive: true }); spy()
      })();
    })();
    // Hero: pointer parallax on the orbit; navbar gets a shadow once the page scrolls
    const orbit = document.querySelector('.orbit');
    const hero = document.querySelector('header.hero');
    const nav = document.querySelector('.nav');
    if (orbit && hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      on(hero, 'pointermove', (e) => {
        const r = orbit.getBoundingClientRect();
        orbit.style.setProperty('--px', clamp(((e.clientX - r.left) / r.width - 0.5) * 2));
        orbit.style.setProperty('--py', clamp(((e.clientY - r.top) / r.height - 0.5) * 2));
      });
      on(hero, 'pointerleave', () => {
        orbit.style.setProperty('--px', 0);
        orbit.style.setProperty('--py', 0);
      });
    }
    if (nav) {
      const sync = () => nav.classList.toggle('is-stuck', window.scrollY > 12);
      on(window, 'scroll', sync, { passive: true });
      sync();
    }

    // What We Do cards: staggered reveal, cursor spotlight and a slight 3D tilt
    const wCards = [...document.querySelectorAll('.w-card')];
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (wCards.length) {
      wCards.forEach((c, i) => { c.style.setProperty('--i', i); c.classList.add('w-pre'); });
      const wio = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.remove('w-pre');
        e.target.classList.add('w-in');
        wio.unobserve(e.target);
      }), { threshold: 0.15 });
      wCards.forEach((c) => wio.observe(c));
      cleanups.push(() => { wio.disconnect(); wCards.forEach((c) => c.classList.remove('w-pre')); });
      if (canHover) {
        wCards.forEach((c) => {
          on(c, 'pointermove', (e) => {
            const r = c.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            c.style.setProperty('--mx', x + 'px');
            c.style.setProperty('--my', y + 'px');
            if (!calm) {
              c.style.setProperty('--ry', ((x / r.width - 0.5) * 6).toFixed(2) + 'deg');
              c.style.setProperty('--rx', ((0.5 - y / r.height) * 6).toFixed(2) + 'deg');
            }
          });
          on(c, 'pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
        });
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div className="home-root">
      <div className="page" id="top">
        <nav className="nav">
          <a className="logo" href="#top"><i>W</i>Webrandustry</a>
          <ul id="navMenu">
            <li className="on">
              <a href="#top">Home</a>
            </li>
            <li>
              <a href="#what-we-do">What We Do</a>
            </li>
            <li>
              <a href="#industries">Industries</a>
            </li>
            <li>
              <a href="#our-work">Our Work</a>
            </li>
            <li>
              <a href="#why">About Us</a>
            </li>
            <li>
              <a href="#insights">Insights</a>
            </li>
            <li>
              <a href="#contact-us">Contact</a>
            </li>
            <li className="nav-cta-m">
              <a className="btn primary" href="#contact-us">Start a Project</a>
            </li>
          </ul>
          <a className="btn primary nav-cta" href="#contact-us">Start a Project <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg></a>
          <button className="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navMenu">
            <span />
            <span />
            <span />
          </button>
        </nav>
        <header className="hero">
          <div>
            <span className="h-tag"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
              <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
              <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
            </svg> Webrandustry Digital Solutions</span>
            <h1>
              <span>Building Brands.</span>
              <span>Creating Technology.</span>
              <em>Driving Growth.</em>
            </h1>
            <p>We bring branding, design, technology, marketing and IT infrastructure together to help businesses launch, operate and grow.</p>
            <div className="btns">
              <a className="btn primary" href="#contact-us">Start a Project <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg></a>
              <a className="btn ghost-btn" href="#lets-talk">Talk to Our Experts</a>
            </div>
            <div className="h-sub">Branding · Software · Marketing · IT · 3D</div>
          </div>
          <div className="orbit">
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
              <svg className="o-rays" aria-hidden="true"><line x1="50%" y1="50%" x2="22%" y2="10%" /><line x1="50%" y1="50%" x2="80%" y2="20%" /><line x1="50%" y1="50%" x2="85%" y2="52%" /><line x1="50%" y1="50%" x2="14%" y2="68%" /><line x1="50%" y1="50%" x2="66%" y2="90%" /></svg>
              <div className="o-core">W</div>
              <div className="o-node" style={{ "--dx": "-91px", "--dy": "-171px" }}>
                <b>Brand</b>
                <small>Identity · Logo</small>
              </div>
              <div className="o-node" style={{ "--dx": "120px", "--dy": "-129px" }}>
                <b>Create</b>
                <small>Design · 3D</small>
              </div>
              <div className="o-node" style={{ "--dx": "129px", "--dy": "8px" }}>
                <b>Build</b>
                <small>Web · Software</small>
              </div>
              <div className="o-node" style={{ "--dx": "-112px", "--dy": "72px" }}>
                <b>Connect</b>
                <small>Network · IT</small>
              </div>
              <div className="o-node" style={{ "--dx": "68px", "--dy": "163px" }}>
                <b>Grow</b>
                <small>SEO · Ads</small>
              </div>
            </div>
          </div>
        </header>
        <hr className="divider" />
        <section className="what" id="what-we-do">
          <div className="sec-head">
            <span className="pill">What we do</span>
            <h2>One Partner. <em>Multiple Capabilities.</em></h2>
            <p>Businesses don't operate in separate departments, so why should their technology, branding and marketing?</p>
          </div>
          <div className="w-grid">
            <article className="w-card s2">
              <div className="w-head">
                <span className="w-ic">
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
                    <circle cx="13.5" cy="6.5" r="0.5" />
                    <circle cx="17.5" cy="10.5" r="0.5" />
                    <circle cx="6.5" cy="12.5" r="0.5" />
                    <circle cx="8.5" cy="7.5" r="0.5" />
                  </svg>
                </span>
                <span className="w-n">01</span>
              </div>
              <h3>Brand</h3>
              <p>Build a distinctive identity that people remember.</p>
              <ul className="chips">
                <li>Brand Strategy</li>
                <li>Logo Design</li>
                <li>Packaging</li>
                <li className="more">+2</li>
              </ul>
              <a className="w-more" href="#">See more <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg></a>
            </article>
            <article className="w-card s2">
              <div className="w-head">
                <span className="w-ic">
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3z" strokeDasharray="2.4 3" />
                    <circle cx="12" cy="12" r="1.2" />
                    <circle cx="12" cy="3" r="0.4" />
                    <circle cx="12" cy="21" r="0.4" />
                    <circle cx="4.2" cy="7.5" r="0.4" />
                    <circle cx="19.8" cy="7.5" r="0.4" />
                    <circle cx="4.2" cy="16.5" r="0.4" />
                    <circle cx="19.8" cy="16.5" r="0.4" />
                  </svg>
                </span>
                <span className="w-n">02</span>
              </div>
              <h3>Create</h3>
              <p>Turn ideas into compelling digital and physical experiences.</p>
              <ul className="chips">
                <li>Graphic Design</li>
                <li>3D Modelling</li>
                <li>3D Printing</li>
                <li className="more">+2</li>
              </ul>
              <a className="w-more" href="#">See more <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg></a>
            </article>
            <article className="w-card s2">
              <div className="w-head">
                <span className="w-ic">
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m18 16 4-4-4-4" />
                    <path d="m6 8-4 4 4 4" />
                    <path d="m14.5 4-5 16" />
                  </svg>
                </span>
                <span className="w-n">03</span>
              </div>
              <h3>Build</h3>
              <p>Build the digital tools your business needs to operate.</p>
              <ul className="chips">
                <li>Websites</li>
                <li>Mobile Apps</li>
                <li>CRM</li>
                <li className="more">+6</li>
              </ul>
              <a className="w-more" href="#">See more <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg></a>
            </article>
            <article className="w-card s3">
              <div className="w-top">
                <span className="w-ic">
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M16 7h6v6" />
                    <path d="m22 7-8.5 8.5-5-5L2 17" />
                  </svg>
                </span>
                <div>
                  <h3>Grow</h3>
                  <p>Turn visibility into engagement, leads and sales.</p>
                </div>
                <span className="w-n">04</span>
              </div>
              <ul className="chips">
                <li>Social Media</li>
                <li>SEO</li>
                <li>Google Ads</li>
                <li>Lead Generation</li>
                <li className="more">+3</li>
              </ul>
              <a className="w-more" href="#">See more <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg></a>
            </article>
            <article className="w-card s3">
              <div className="w-top">
                <span className="w-ic">
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </span>
                <div>
                  <h3>Connect</h3>
                  <p>Build the technology infrastructure that keeps your business connected.</p>
                </div>
                <span className="w-n">05</span>
              </div>
              <ul className="chips">
                <li>Networks</li>
                <li>Servers</li>
                <li>Office IT</li>
                <li>Cloud</li>
                <li className="more">+3</li>
              </ul>
              <a className="w-more" href="#">See more <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg></a>
            </article>
          </div>
          <div className="flow">
            <small>From idea to growth</small>
            <div className="flow-row">
              <span className="f-chip">Idea</span>
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="f-chip">Brand</span>
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="f-chip">Design</span>
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="f-chip">Technology</span>
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="f-chip">Marketing</span>
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="f-chip">Sales</span>
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="f-chip last">Growth</span>
            </div>
          </div>
        </section>
        <hr className="divider" />
        <section className="svc">
          <div className="sec-head">
            <span className="pill">Our services</span>
            <h2>Every capability, <em>in depth.</em></h2>
            <p>Pick a service to see what we build and how we work.</p>
          </div>
          <div className="sv-wrap">
            <div className="sv-list">
              <button className="sv-tab" type="button"><span className="sv-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
                  <circle cx="13.5" cy="6.5" r="0.5" />
                  <circle cx="17.5" cy="10.5" r="0.5" />
                  <circle cx="6.5" cy="12.5" r="0.5" />
                  <circle cx="8.5" cy="7.5" r="0.5" />
                </svg>
              </span>Branding and Creative</button>
              <button className="sv-tab" type="button"><span className="sv-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
                  <path d="M3 8l9 5 9-5" />
                  <path d="M12 13v8" />
                </svg>
              </span>3D Design and Printing</button>
              <button className="sv-tab on" type="button"><span className="sv-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m18 16 4-4-4-4" />
                  <path d="m6 8-4 4 4 4" />
                  <path d="m14.5 4-5 16" />
                </svg>
              </span>Software Development<i className="sv-prog" /></button>
              <button className="sv-tab" type="button"><span className="sv-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="14" height="20" x="5" y="2" rx="2" />
                  <path d="M12 18h.01" />
                </svg>
              </span>Web and Mobile</button>
              <button className="sv-tab" type="button"><span className="sv-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m3 11 18-5v12L3 14v-3z" />
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                </svg>
              </span>Digital Marketing</button>
              <button className="sv-tab" type="button"><span className="sv-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </span>E-commerce</button>
              <button className="sv-tab" type="button"><span className="sv-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="8" x="2" y="2" rx="2" />
                  <rect width="20" height="8" x="2" y="14" rx="2" />
                  <path d="M6 6h.01" />
                  <path d="M6 18h.01" />
                </svg>
              </span>IT Infrastructure</button>
            </div>
            <div className="sv-panel">
              <div className="sv-top">
                <span className="sv-tag">Software Development</span>
                <span>03 / 07</span>
              </div>
              <h3>Don't Change Your Business to Fit Software.</h3>
              <p>Every business operates differently. When off-the-shelf software doesn't fit your processes, we build around the way you actually work.</p>
              <ul className="sv-list-i">
                <li>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span><b>CRM</b> · customers, enquiries and sales follow-ups</span>
                </li>
                <li>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span><b>ERP</b> · operations and key information in one place</span>
                </li>
                <li>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span><b>HRMS</b> · employees, attendance and HR processes</span>
                </li>
                <li>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span><b>LMS</b> · structured learning and training</span>
                </li>
                <li>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <span><b>Hospital ERP</b> · built around healthcare operations</span>
                </li>
              </ul>
              <div className="build-box">
                <small>How we build it</small>
                <div className="p-row">
                  <span className="p-chip">Requirement Analysis</span>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  <span className="p-chip">Architecture</span>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  <span className="p-chip">UI/UX</span>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  <span className="p-chip">Development</span>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  <span className="p-chip">Testing</span>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  <span className="p-chip">Deployment</span>
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  <span className="p-chip last">Support</span>
                </div>
              </div>
              <div className="sv-btns">
                <a className="btn primary" href="#">Start a Project <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg></a>
                <a className="lnk" href="#">Explore software <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg></a>
              </div>
            </div>
          </div>
        </section>
        <section className="ind" id="industries">
          <div className="sec-head">
            <span className="pill">Industries we serve</span>
            <h2><span className="nw">Different Businesses. Different Challenges.</span>{" "}<em>One Flexible Approach.</em></h2>
            <p>Find your industry and see what we build for it.</p>
          </div>
          <div className="i-grid">
            <article className="i-card">
              <span className="i-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                  <path d="M12 22V12" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="m7.5 4.27 9 5.15" />
                </svg>
              </span>
              <span className="i-go">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </span>
              <h3>FMCG</h3>
              <ul className="chips">
                <li>Branding</li>
                <li>Packaging</li>
                <li className="more">+3</li>
              </ul>
            </article>
            <article className="i-card">
              <span className="i-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                </svg>
              </span>
              <span className="i-go">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </span>
              <h3>Healthcare</h3>
              <ul className="chips">
                <li>Hospital ERP</li>
                <li>Websites</li>
                <li className="more">+3</li>
              </ul>
            </article>
            <article className="i-card">
              <span className="i-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                  <path d="m8.5 8.5 7 7" />
                </svg>
              </span>
              <span className="i-go">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </span>
              <h3>Pharmaceuticals</h3>
              <ul className="chips">
                <li>Websites</li>
                <li>Software</li>
                <li className="more">+2</li>
              </ul>
            </article>
            <article className="i-card">
              <span className="i-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </span>
              <span className="i-go">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </span>
              <h3>Retail</h3>
              <ul className="chips">
                <li>Branding</li>
                <li>E-commerce</li>
                <li className="more">+2</li>
              </ul>
            </article>
            <article className="i-card">
              <span className="i-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M17 18h1" />
                  <path d="M12 18h1" />
                  <path d="M7 18h1" />
                </svg>
              </span>
              <span className="i-go">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </span>
              <h3>Manufacturing</h3>
              <ul className="chips">
                <li>ERP</li>
                <li>Networking</li>
                <li className="more">+2</li>
              </ul>
            </article>
            <article className="i-card">
              <span className="i-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                  <path d="M22 10v6" />
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                </svg>
              </span>
              <span className="i-go">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </span>
              <h3>Education</h3>
              <ul className="chips">
                <li>LMS</li>
                <li>Websites</li>
                <li className="more">+2</li>
              </ul>
            </article>
            <article className="i-card">
              <span className="i-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
              </span>
              <span className="i-go">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </span>
              <h3>Startups</h3>
              <ul className="chips">
                <li>Brand Identity</li>
                <li>Website</li>
                <li className="more">+3</li>
              </ul>
            </article>
            <article className="i-card">
              <span className="i-ic">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  <rect width="20" height="14" x="2" y="6" rx="2" />
                </svg>
              </span>
              <span className="i-go">
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </span>
              <h3>Professional Services</h3>
              <ul className="chips">
                <li>Branding</li>
                <li>Websites</li>
                <li className="more">+3</li>
              </ul>
            </article>
          </div>
          <div className="i-cta">
            <a href="#">Don't see your industry? Talk to us <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg></a>
          </div>
        </section>
        <section className="how" id="how-we-work" data-how="" aria-labelledby="how-title">
          <header className="how-head">
            <span className="pill">How we work</span>
            <h2 id="how-title">From Understanding <em>to Execution.</em></h2>
            <p>Six steps, one connected team. Scroll or pick a step to see how an idea becomes a launched, growing business.</p>
          </header>
          <div className="how-scroller" data-scroller="">
            <div className="how-pin">
              <div className="stage">
                <ol className="how-track" aria-label="Our process">
                  <li>
                    <button className="how-node" data-i="0" aria-controls="step-1">
                      <span className="dot">1</span>
                      <span className="lbl">Discover</span>
                    </button>
                  </li>
                  <li>
                    <button className="how-node" data-i="1" aria-controls="step-2">
                      <span className="dot">2</span>
                      <span className="lbl">Strategise</span>
                    </button>
                  </li>
                  <li>
                    <button className="how-node" data-i="2" aria-controls="step-3">
                      <span className="dot">3</span>
                      <span className="lbl">Design</span>
                    </button>
                  </li>
                  <li>
                    <button className="how-node" data-i="3" aria-controls="step-4">
                      <span className="dot">4</span>
                      <span className="lbl">Build</span>
                    </button>
                  </li>
                  <li>
                    <button className="how-node" data-i="4" aria-controls="step-5">
                      <span className="dot">5</span>
                      <span className="lbl">Launch</span>
                    </button>
                  </li>
                  <li>
                    <button className="how-node" data-i="5" aria-controls="step-6">
                      <span className="dot">6</span>
                      <span className="lbl">Grow</span>
                    </button>
                  </li>
                </ol>
                <div className="how-steps">
                  <article className="how-step" id="step-1" data-n="1" data-next="Strategise" aria-labelledby="t1">
                    <div className="step-copy">
                      <div className="ghost" aria-hidden="true">01</div>
                      <h3 id="t1">Discover</h3>
                      <p className="lead">We start by understanding your business, challenges, customers and objectives.</p>
                      <ul className="chips">
                        <li>Business goals</li>
                        <li>Customer research</li>
                        <li>Requirement analysis</li>
                      </ul>
                      <button className="next" type="button" />
                    </div>
                    <div className="vis" aria-hidden="true">
                      <div className="vis-title">Questions we start with</div>
                      <div className="row rise" style={{ "--d": ".05s" }}><span className="tick">
                        <svg viewBox="0 0 16 16">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </span>What is the business trying to achieve?</div>
                      <div className="row rise" style={{ "--d": ".2s" }}><span className="tick">
                        <svg viewBox="0 0 16 16">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </span>Who are the customers, and how do they find you?</div>
                      <div className="row rise" style={{ "--d": ".35s" }}><span className="tick">
                        <svg viewBox="0 0 16 16">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </span>What is slowing things down today?</div>
                    </div>
                  </article>
                  <article className="how-step" id="step-2" data-n="2" data-next="Design" aria-labelledby="t2">
                    <div className="step-copy">
                      <div className="ghost" aria-hidden="true">02</div>
                      <h3 id="t2">Strategise</h3>
                      <p className="lead">We determine what needs to be built, designed, marketed or improved — and why.</p>
                      <ul className="chips">
                        <li>Scope &amp; priorities</li>
                        <li>Roadmap</li>
                        <li>Right-fit services</li>
                      </ul>
                      <button className="next" type="button" />
                    </div>
                    <div className="vis" aria-hidden="true">
                      <div className="vis-title">Your roadmap</div>
                      <div className="map">
                        <div className="col">Now</div>
                        <div className="col">Next</div>
                        <div className="col">Later</div>
                        <div className="bar" style={{ gridColumn: "1/3", "--d": ".05s" }}>Brand identity</div>
                        <div className="bar b2" style={{ gridColumn: "2/4", "--d": ".2s" }}>Custom software</div>
                        <div className="bar b3" style={{ gridColumn: "3/4", "--d": ".35s" }}>Lead generation</div>
                      </div>
                      <div className="map-note">Every item has a reason tied to your business goal.</div>
                    </div>
                  </article>
                  <article className="how-step" id="step-3" data-n="3" data-next="Build" aria-labelledby="t3">
                    <div className="step-copy">
                      <div className="ghost" aria-hidden="true">03</div>
                      <h3 id="t3">Design</h3>
                      <p className="lead">We create the visual, digital and functional experience around your requirements.</p>
                      <ul className="chips">
                        <li>Brand &amp; UI/UX</li>
                        <li>3D concepts</li>
                        <li>Prototypes</li>
                      </ul>
                      <button className="next" type="button" />
                    </div>
                    <div className="vis" aria-hidden="true">
                      <div className="vis-title">Look, feel and flow</div>
                      <div className="dz">
                        <div className="wire rise" style={{ "--d": ".05s" }}>
                          <i className="hero" />
                          <i className="l1" />
                          <i className="l2" />
                          <i className="btn" />
                        </div>
                        <div className="kit">
                          <div className="sw rise" style={{ "--d": ".2s" }}>
                            <span style={{ background: "#4F46E5" }} />
                            <span style={{ background: "#1B1838" }} />
                            <span style={{ background: "#C9C5F7" }} />
                            <span style={{ background: "#F6F5F2" }} />
                          </div>
                          <div className="type rise" style={{ "--d": ".3s" }}>
                            <b>Aa</b>
                            <small>Type that fits the brand</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                  <article className="how-step" id="step-4" data-n="4" data-next="Launch" aria-labelledby="t4">
                    <div className="step-copy">
                      <div className="ghost" aria-hidden="true">04</div>
                      <h3 id="t4">Build</h3>
                      <p className="lead">Our team develops the technology, creative assets and infrastructure required.</p>
                      <ul className="chips">
                        <li>Software</li>
                        <li>Websites &amp; apps</li>
                        <li>IT setup</li>
                      </ul>
                      <button className="next" type="button" />
                    </div>
                    <div className="vis" aria-hidden="true">
                      <div className="vis-title">In progress</div>
                      <div className="job rise" style={{ "--d": ".05s" }}>
                        <div>Website <small>Front end</small></div>
                        <div className="track-bar">
                          <i style={{ "--t": "1.5s", "--d": ".2s" }} />
                        </div>
                      </div>
                      <div className="job rise" style={{ "--d": ".2s" }}>
                        <div>CRM <small>Back end</small></div>
                        <div className="track-bar">
                          <i style={{ "--t": "2.1s", "--d": ".3s" }} />
                        </div>
                      </div>
                      <div className="job rise" style={{ "--d": ".35s" }}>
                        <div>Office network <small>Infrastructure</small></div>
                        <div className="track-bar">
                          <i style={{ "--t": "1.8s", "--d": ".4s" }} />
                        </div>
                      </div>
                    </div>
                  </article>
                  <article className="how-step" id="step-5" data-n="5" data-next="Grow" aria-labelledby="t5">
                    <div className="step-copy">
                      <div className="ghost" aria-hidden="true">05</div>
                      <h3 id="t5">Launch</h3>
                      <p className="lead">We take your solution, product or campaign into the market.</p>
                      <ul className="chips">
                        <li>Go-live</li>
                        <li>Team handover</li>
                        <li>Campaign launch</li>
                      </ul>
                      <button className="next" type="button" />
                    </div>
                    <div className="vis" aria-hidden="true">
                      <div className="vis-title">Go-live checklist</div>
                      <div className="row rise" style={{ "--d": ".05s" }}><span className="tick">
                        <svg viewBox="0 0 16 16">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </span>Tested on every device</div>
                      <div className="row rise" style={{ "--d": ".2s" }}><span className="tick">
                        <svg viewBox="0 0 16 16">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </span>Deployed and secured</div>
                      <div className="row rise" style={{ "--d": ".35s" }}><span className="tick">
                        <svg viewBox="0 0 16 16">
                          <path d="M3 8.5l3.2 3L13 4.5" />
                        </svg>
                      </span>Your team trained</div>
                      <div className="live rise" style={{ "--d": ".6s" }}><i />You're live</div>
                    </div>
                  </article>
                  <article className="how-step" id="step-6" data-n="6" data-next="Discover" aria-labelledby="t6">
                    <div className="step-copy">
                      <div className="ghost" aria-hidden="true">06</div>
                      <h3 id="t6">Grow</h3>
                      <p className="lead">We measure performance, identify opportunities and continuously improve.</p>
                      <ul className="chips">
                        <li>SEO &amp; ads</li>
                        <li>Analytics</li>
                        <li>Ongoing support</li>
                      </ul>
                      <button className="next" type="button" />
                    </div>
                    <div className="vis" aria-hidden="true">
                      <div className="vis-title">Measure, learn, improve</div>
                      <div className="chart">
                        <i style={{ height: "22%", "--d": ".05s" }} />
                        <i style={{ height: "34%", "--d": ".12s" }} />
                        <i style={{ height: "46%", "--d": ".19s" }} />
                        <i style={{ height: "58%", "--d": ".26s" }} />
                        <i style={{ height: "72%", "--d": ".33s" }} />
                        <i style={{ height: "84%", "--d": ".4s" }} />
                        <i style={{ height: "100%", "--d": ".47s" }} />
                      </div>
                      <div className="loop rise" style={{ "--d": ".6s" }}>
                        <span>Measure</span>
                        <span>Improve</span>
                        <span>Repeat</span>
                      </div>
                    </div>
                  </article>
                </div>
                <div className="stage-foot">
                  <p><b>Not sure where to begin?</b> You don't need to know exactly what service you need. Tell us what you're trying to achieve.</p>
                  <div className="btns">
                    <a className="btn primary" href="#contact">Start a Project <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg></a>
                    <a className="btn ghost-btn" href="#contact">Talk to Our Experts</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="why" id="why">
          <div>
            <span className="pill reveal">Why Webrandustry</span>
            <h2 className="reveal" style={{ "--d": ".06s" }}>More Than a Vendor.<em>A Business Partner.</em></h2>
            <p className="lead reveal" style={{ "--d": ".12s" }}>We begin with your business objective, then bring creative thinking and technical capability together under one roof.</p>
            <div className="grid">
              <article className="f reveal" style={{ "--d": ".1s" }}>
                <span className="n">01</span>
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4.5" />
                    <circle cx="12" cy="12" r=".8" fill="currentColor" />
                  </svg>
                </div>
                <h3>Business First</h3>
                <p>We begin with your business objective, not a predetermined technology or service.</p>
              </article>
              <article className="f reveal" style={{ "--d": ".16s" }}>
                <span className="n">02</span>
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4z" />
                    <path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" />
                  </svg>
                </div>
                <h3>Creative + Technical</h3>
                <p>We combine creative thinking with technical capability.</p>
              </article>
              <article className="f reveal" style={{ "--d": ".22s" }}>
                <span className="n">03</span>
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="7" height="7" rx="2" />
                    <rect x="14" y="4" width="7" height="7" rx="2" />
                    <rect x="8.5" y="14" width="7" height="7" rx="2" />
                    <path d="M6.5 11v1.5h11V11M12 12.5V14" />
                  </svg>
                </div>
                <h3>End-to-End Capability</h3>
                <p>Branding, design, technology, marketing and IT infrastructure — connected under one roof.</p>
              </article>
              <article className="f reveal" style={{ "--d": ".28s" }}>
                <span className="n">04</span>
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
                    <circle cx="16" cy="7" r="2" />
                    <circle cx="8" cy="17" r="2" />
                  </svg>
                </div>
                <h3>Custom Approach</h3>
                <p>Your business is different. Your solution should be too.</p>
              </article>
              <article className="f reveal" style={{ "--d": ".34s" }}>
                <span className="n">05</span>
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <circle cx="9" cy="8" r="3.2" />
                    <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
                    <circle cx="17.5" cy="9" r="2.4" />
                    <path d="M17 14.6c2.4.2 4 1.9 4 4.4" />
                  </svg>
                </div>
                <h3>One Connected Team</h3>
                <p>Fewer disconnected vendors. Better coordination between the different parts of your business.</p>
              </article>
              <article className="f reveal" style={{ "--d": ".4s" }}>
                <span className="n">06</span>
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 17l5-5 4 4 7-8" />
                    <path d="M15 8h5v5" />
                  </svg>
                </div>
                <h3>Built to Grow</h3>
                <p>We design solutions with your next stage of growth in mind.</p>
              </article>
            </div>
            <div className="btns reveal" style={{ "--d": ".2s" }}>
              <a className="btn primary" href="#contact">Tell Us About Your Project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg></a>
              <a className="btn line" href="#contact">Request a Consultation</a>
            </div>
          </div>
          <aside className="card reveal" style={{ "--d": ".15s" }} id="contact" aria-labelledby="fh">
            <span className="tag"><i />Start with a conversation</span>
            <h3 id="fh">Let's Build Something Together.</h3>
            <p className="sub">Tell us about your business, project or challenge.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row2">
                <div className="fld">
                  <label htmlFor="n">Name *</label>
                  <input id="n" placeholder="Your name" />
                </div>
                <div className="fld">
                  <label htmlFor="c">Company <small>(optional)</small></label>
                  <input id="c" placeholder="Company name" />
                </div>
              </div>
              <div className="fld">
                <label htmlFor="e">Email *</label>
                <input id="e" type="email" placeholder="you@company.com" />
              </div>
              <div className="fld">
                <label htmlFor="p">Phone *</label>
                <input id="p" type="tel" placeholder="+91 99999 99999" />
              </div>
              <div className="fld">
                <label htmlFor="h">What can we help you with?</label>
                <select id="h">
                  <option>Select a service</option>
                  <option>Branding &amp; Design</option>
                  <option>Websites &amp; E-commerce</option>
                  <option>Software &amp; Mobile Apps</option>
                  <option>Digital Marketing</option>
                  <option>IT Infrastructure</option>
                </select>
              </div>
              <div className="fld">
                <label htmlFor="r">Tell us about your requirement</label>
                <textarea id="r" placeholder="A few lines about your project…" />
              </div>
              <button className="btn primary" type="submit">Send Enquiry <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
              </svg></button>
            </form>
            <p className="safe">Your details are safe. No spam — only a tailored response from our team.</p>
          </aside>
        </section>
        <section className="work" id="our-work" aria-labelledby="wk-title">
          <header className="wk-head">
            <span className="pill">Our Work</span>
            <h2 id="wk-title">Ideas We've Turned <em>Into Reality.</em></h2>
            <p>Explore selected projects across our capabilities.</p>
          </header>
          <div className="wk-chips" role="group" aria-label="Filter projects by capability">
            <button className="wk-chip on" data-f="all" aria-pressed="true">All</button>
            <button className="wk-chip" data-f="branding" aria-pressed="false">Branding</button>
            <button className="wk-chip" data-f="graphic" aria-pressed="false">Graphic Design</button>
            <button className="wk-chip" data-f="packaging" aria-pressed="false">Packaging</button>
            <button className="wk-chip" data-f="websites" aria-pressed="false">Websites</button>
            <button className="wk-chip" data-f="ecommerce" aria-pressed="false">E-commerce</button>
            <button className="wk-chip" data-f="software" aria-pressed="false">Software</button>
            <button className="wk-chip" data-f="apps" aria-pressed="false">Mobile Apps</button>
            <button className="wk-chip" data-f="marketing" aria-pressed="false">Digital Marketing</button>
            <button className="wk-chip" data-f="it" aria-pressed="false">IT Infrastructure</button>
            <button className="wk-chip" data-f="3d" aria-pressed="false">3D Design &amp; Printing</button>
          </div>
          <div className="wk-grid" id="wkGrid">
            <a className="wk-card w2 h2" href="#" data-cat="branding" style={{ "--a": "#4F46E5", "--b": "#8E87F0" }} aria-label="Branding project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">Branding</span>
              <span className="wk-meta">
                <span>
                  <small>Project 01</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card " href="#" data-cat="graphic" style={{ "--a": "#1B1838", "--b": "#4F46E5" }} aria-label="Graphic Design project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">Graphic Design</span>
              <span className="wk-meta">
                <span>
                  <small>Project 02</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card " href="#" data-cat="packaging" style={{ "--a": "#9A94F3", "--b": "#DEDBF8" }} aria-label="Packaging project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">Packaging</span>
              <span className="wk-meta">
                <span>
                  <small>Project 03</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card " href="#" data-cat="websites" style={{ "--a": "#4338CA", "--b": "#6D65EE" }} aria-label="Websites project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">Websites</span>
              <span className="wk-meta">
                <span>
                  <small>Project 04</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card " href="#" data-cat="ecommerce" style={{ "--a": "#6D65EE", "--b": "#C9C5F7" }} aria-label="E-commerce project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">E-commerce</span>
              <span className="wk-meta">
                <span>
                  <small>Project 05</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card w2" href="#" data-cat="software" style={{ "--a": "#1B1838", "--b": "#4338CA" }} aria-label="Software project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">Software</span>
              <span className="wk-meta">
                <span>
                  <small>Project 06</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card " href="#" data-cat="apps" style={{ "--a": "#8E87F0", "--b": "#4F46E5" }} aria-label="Mobile Apps project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">Mobile Apps</span>
              <span className="wk-meta">
                <span>
                  <small>Project 07</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card " href="#" data-cat="marketing" style={{ "--a": "#C9C5F7", "--b": "#6D65EE" }} aria-label="Digital Marketing project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">Digital Marketing</span>
              <span className="wk-meta">
                <span>
                  <small>Project 08</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card " href="#" data-cat="it" style={{ "--a": "#26224D", "--b": "#6D65EE" }} aria-label="IT Infrastructure project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">IT Infrastructure</span>
              <span className="wk-meta">
                <span>
                  <small>Project 09</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
            <a className="wk-card w3" href="#" data-cat="3d" style={{ "--a": "#4F46E5", "--b": "#1B1838" }} aria-label="3D Design &amp; Printing project placeholder">
              <span className="wk-art" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="wk-ph">Image placeholder</span>
              <span className="wk-tag">3D Design &amp; Printing</span>
              <span className="wk-meta">
                <span>
                  <small>Project 10</small>
                  <b>Project title goes here</b>
                </span>
                <span className="wk-go">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </span>
              </span>
            </a>
          </div>
          <div className="wk-foot">
            <a className="btn primary" href="#">View Our Work <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg></a>
          </div>
        </section>
        <section className="cs" id="case-studies" aria-labelledby="cs-title">
          <header className="cs-head">
            <span className="pill">Case Studies</span>
            <h2 id="cs-title">The Challenge. The Solution. <em>The Outcome.</em></h2>
            <p>We believe the best way to demonstrate our capabilities is through the work we've done.</p>
          </header>
          <div className="cs-body">
            <div className="cs-list" role="tablist" aria-label="Case studies">
              <button className="cs-pick on" role="tab" aria-selected="true" data-i="0" data-cat="Branding" data-title="Case study title one">
                <span className="cs-n">01</span>
                <span>
                  <small>Branding</small>
                  <b>Case study title one</b>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <button className="cs-pick" role="tab" aria-selected="false" data-i="1" data-cat="Websites &amp; E-commerce" data-title="Case study title two">
                <span className="cs-n">02</span>
                <span>
                  <small>Websites &amp; E-commerce</small>
                  <b>Case study title two</b>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              <button className="cs-pick" role="tab" aria-selected="false" data-i="2" data-cat="Software &amp; IT" data-title="Case study title three">
                <span className="cs-n">03</span>
                <span>
                  <small>Software &amp; IT</small>
                  <b>Case study title three</b>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <div className="cs-panel" role="tabpanel">
              <div className="cs-top">
                <span className="cs-badge">Sample content</span>
                <span className="cs-cat" id="csCat">Branding</span>
              </div>
              <h3 id="csTitle">Case study title one</h3>
              <div className="cs-steps" id="csSteps">
                <div className="cs-step" style={{ "--d": "0.08s" }}>
                  <span className="cs-sn">01</span>
                  <h4>The Business Challenge</h4>
                  <p>Placeholder text. Describe the client's business, the problem they faced and what was at stake.</p>
                </div>
                <div className="cs-step" style={{ "--d": "0.16s" }}>
                  <span className="cs-sn">02</span>
                  <h4>Our Approach</h4>
                  <p>Placeholder text. Explain how the team understood the problem and the strategy chosen.</p>
                </div>
                <div className="cs-step" style={{ "--d": "0.24s" }}>
                  <span className="cs-sn">03</span>
                  <h4>What We Delivered</h4>
                  <p>Placeholder text. List the work delivered, such as branding, website, software or marketing.</p>
                </div>
                <div className="cs-step out" style={{ "--d": ".32s" }}>
                  <span className="cs-sn">04</span>
                  <h4>The Outcome</h4>
                  <p>Placeholder text. Describe the measurable result for the client.</p>
                  <div className="cs-m">
                    <div>
                      <b>00%</b>
                      <small>Result metric</small>
                    </div>
                    <div>
                      <b>00x</b>
                      <small>Result metric</small>
                    </div>
                    <div>
                      <b>00d</b>
                      <small>Result metric</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cs-foot">
            <a className="btn cs-btn" href="#">Explore Case Studies <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg></a>
          </div>
        </section>
        <section className="ins" id="insights" aria-labelledby="ins-title">
          <header className="ins-head">
            <span className="pill">Insights</span>
            <h2 id="ins-title">Ideas, Information <em>&amp; Digital Thinking.</em></h2>
            <p>Technology and marketing are constantly changing. Our Insights section shares practical perspectives on:</p>
          </header>
          <div className="ins-chips" role="group" aria-label="Filter insights by topic">
            <button className="ins-chip on" data-f="all" aria-pressed="true">All</button>
            <button className="ins-chip" data-f="branding" aria-pressed="false">Branding</button>
            <button className="ins-chip" data-f="graphic" aria-pressed="false">Graphic Design</button>
            <button className="ins-chip" data-f="marketing" aria-pressed="false">Digital Marketing</button>
            <button className="ins-chip" data-f="ecommerce" aria-pressed="false">E-commerce</button>
            <button className="ins-chip" data-f="software" aria-pressed="false">Software</button>
            <button className="ins-chip" data-f="web" aria-pressed="false">Web Development</button>
            <button className="ins-chip" data-f="it" aria-pressed="false">IT Infrastructure</button>
            <button className="ins-chip" data-f="bt" aria-pressed="false">Business Technology</button>
          </div>
          <div className="ins-grid" id="insGrid">
            <a className="ins-card feat" href="#" data-cat="branding" style={{ "--a": "#4F46E5", "--b": "#8E87F0" }}>
              <span className="ins-art" aria-hidden="true">
                <i />
                <i />
              </span>
              <span className="ins-ph">Image placeholder</span>
              <span className="ins-tag">Branding</span>
              <span className="ins-fb">
                <small>Featured · Date · 00 min read</small>
                <b>Featured article title goes here</b>
                <em>Placeholder text. A short summary of the article appears here so readers know what to expect.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
            <a className="ins-card" href="#" data-cat="graphic" style={{ "--a": "#1B1838", "--b": "#4F46E5" }}>
              <span className="ins-img">
                <span className="ins-art" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="ins-ph">Image placeholder</span>
                <span className="ins-tag">Graphic Design</span>
              </span>
              <span className="ins-body">
                <small>Date · 00 min read</small>
                <b>Article title goes here</b>
                <em>Placeholder text. A one or two line summary of the article.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
            <a className="ins-card" href="#" data-cat="marketing" style={{ "--a": "#9A94F3", "--b": "#DEDBF8" }}>
              <span className="ins-img">
                <span className="ins-art" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="ins-ph">Image placeholder</span>
                <span className="ins-tag">Digital Marketing</span>
              </span>
              <span className="ins-body">
                <small>Date · 00 min read</small>
                <b>Article title goes here</b>
                <em>Placeholder text. A one or two line summary of the article.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
            <a className="ins-card" href="#" data-cat="ecommerce" style={{ "--a": "#4338CA", "--b": "#6D65EE" }}>
              <span className="ins-img">
                <span className="ins-art" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="ins-ph">Image placeholder</span>
                <span className="ins-tag">E-commerce</span>
              </span>
              <span className="ins-body">
                <small>Date · 00 min read</small>
                <b>Article title goes here</b>
                <em>Placeholder text. A one or two line summary of the article.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
            <a className="ins-card" href="#" data-cat="software" style={{ "--a": "#6D65EE", "--b": "#C9C5F7" }}>
              <span className="ins-img">
                <span className="ins-art" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="ins-ph">Image placeholder</span>
                <span className="ins-tag">Software</span>
              </span>
              <span className="ins-body">
                <small>Date · 00 min read</small>
                <b>Article title goes here</b>
                <em>Placeholder text. A one or two line summary of the article.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
            <a className="ins-card" href="#" data-cat="web" style={{ "--a": "#26224D", "--b": "#6D65EE" }}>
              <span className="ins-img">
                <span className="ins-art" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="ins-ph">Image placeholder</span>
                <span className="ins-tag">Web Development</span>
              </span>
              <span className="ins-body">
                <small>Date · 00 min read</small>
                <b>Article title goes here</b>
                <em>Placeholder text. A one or two line summary of the article.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
            <a className="ins-card" href="#" data-cat="it" style={{ "--a": "#8E87F0", "--b": "#4F46E5" }}>
              <span className="ins-img">
                <span className="ins-art" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="ins-ph">Image placeholder</span>
                <span className="ins-tag">IT Infrastructure</span>
              </span>
              <span className="ins-body">
                <small>Date · 00 min read</small>
                <b>Article title goes here</b>
                <em>Placeholder text. A one or two line summary of the article.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
            <a className="ins-card" href="#" data-cat="bt" style={{ "--a": "#C9C5F7", "--b": "#6D65EE" }}>
              <span className="ins-img">
                <span className="ins-art" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="ins-ph">Image placeholder</span>
                <span className="ins-tag">Business Technology</span>
              </span>
              <span className="ins-body">
                <small>Date · 00 min read</small>
                <b>Article title goes here</b>
                <em>Placeholder text. A one or two line summary of the article.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
            <a className="ins-card" href="#" data-cat="branding" style={{ "--a": "#1B1838", "--b": "#4338CA" }}>
              <span className="ins-img">
                <span className="ins-art" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span className="ins-ph">Image placeholder</span>
                <span className="ins-tag">Branding</span>
              </span>
              <span className="ins-body">
                <small>Date · 00 min read</small>
                <b>Article title goes here</b>
                <em>Placeholder text. A one or two line summary of the article.</em>
                <span className="ins-read">Read article <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg></span>
              </span>
            </a>
          </div>
          <div className="ins-foot">
            <a className="btn primary" href="#">View All Insights <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg></a>
          </div>
        </section>
        <section className="talk" id="lets-talk" aria-labelledby="talk-title">
          <div className="talk-left">
            <h2 id="talk-title">Let's Talk About Your Business</h2>
            <p className="talk-q">Have an Idea? A Problem? A Business to Grow?</p>
            <p className="talk-intro">You don't need to know exactly what service you need.<br />Tell us what you're trying to achieve.<br />We'll help you identify the right approach.</p>
          </div>
          <div className="talk-card">
            <h3>Request a Consultation</h3>
            <p className="talk-sub">Tell us about your business, project or challenge.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="talk-f">
                <label htmlFor="talk-name">Name *</label>
                <input id="talk-name" placeholder="Your name" />
              </div>
              <div className="talk-f">
                <label htmlFor="talk-email">Email *</label>
                <input id="talk-email" type="email" placeholder="you@company.com" />
              </div>
              <div className="talk-f">
                <label htmlFor="talk-phone">Phone *</label>
                <input id="talk-phone" type="tel" placeholder="+91 99999 99999" />
              </div>
              <div className="talk-f">
                <label htmlFor="talk-co">Company <small>(optional)</small></label>
                <input id="talk-co" placeholder="Company name" />
              </div>
              <button className="talk-submit" type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
              </svg>Send Enquiry</button>
            </form>
            <p className="talk-safe">Your details are safe. No spam — only a tailored response from our team.</p>
          </div>
          <div className="talk-cards">
            <a className="talk-opt" href="#talk-name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 15c-1.5 1.3-2 4-2 4s2.7-.5 4-2" />
                <path d="M12 15l-3-3a22 22 0 0 1 2-4 12 12 0 0 1 9-5c0 3-1.5 7-5 9a22 22 0 0 1-3 3z" />
                <circle cx="15" cy="9" r="1.2" />
              </svg>
              <span>
                <small>Are you launching a new business?</small>
                <b>Let's build your brand and digital foundation.</b>
              </span>
            </a>
            <a className="talk-opt" href="#talk-name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
                <path d="M15 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
              </svg>
              <span>
                <small>Looking for more customers?</small>
                <b>Let's build a marketing and lead-generation strategy.</b>
              </span>
            </a>
            <a className="talk-opt" href="#talk-name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
              </svg>
              <span>
                <small>Building custom software?</small>
                <b>Let's understand your processes and create the right solution.</b>
              </span>
            </a>
            <a className="talk-opt" href="#talk-name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M9 7h2M13 7h2M9 11h2M13 11h2M10 21v-4h4v4" />
              </svg>
              <span>
                <small>Setting up a new office?</small>
                <b>Let's design your technology infrastructure.</b>
              </span>
            </a>
            <a className="talk-opt" href="#talk-name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              <span>
                <small>Taking your business online?</small>
                <b>Let's build your digital presence.</b>
              </span>
            </a>
            <a className="talk-opt" href="#talk-name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
                <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
              </svg>
              <span>
                <small>Creating something physical?</small>
                <b>Let's explore branding, design and 3D possibilities.</b>
              </span>
            </a>
          </div>
          <div className="talk-btns">
            <span className="talk-start">Start with a conversation.</span>
            <a className="btn talk-white" href="#talk-name">Tell Us About Your Project</a>
            <a className="btn talk-ghost" href="#talk-name">Request a Consultation</a>
          </div>
        </section>
        <section className="contact" id="contact-us" aria-labelledby="ct-title">
          <div className="ct-left">
            <span className="pill">Contact</span>
            <h2 id="ct-title">Let's Build <em>Something Together.</em></h2>
            <p>Tell us about your business, project or challenge.</p>
            <div className="ct-btns">
              <a className="ct-chip" href="tel:+910000000000"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
              </svg>+91 00000 00000</a>
              <a className="ct-chip" href="mailto:hello@yourdomain.com"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>hello@yourdomain.com</a>
            </div>
          </div>
          <div className="ct-form">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="ct-row">
                <div className="ct-f">
                  <label htmlFor="ct-name">Name *</label>
                  <input id="ct-name" placeholder="Your name" />
                </div>
                <div className="ct-f">
                  <label htmlFor="ct-co">Company <small>(optional)</small></label>
                  <input id="ct-co" placeholder="Company name" />
                </div>
              </div>
              <div className="ct-row">
                <div className="ct-f">
                  <label htmlFor="ct-email">Email *</label>
                  <input id="ct-email" type="email" placeholder="you@company.com" />
                </div>
                <div className="ct-f">
                  <label htmlFor="ct-phone">Phone *</label>
                  <input id="ct-phone" type="tel" placeholder="+91 99999 99999" />
                </div>
              </div>
              <div className="ct-f">
                <label htmlFor="ct-help">What can we help you with?</label>
                <select id="ct-help">
                  <option>Select a service</option>
                  <option>Branding &amp; Design</option>
                  <option>Websites &amp; E-commerce</option>
                  <option>Software &amp; Mobile Apps</option>
                  <option>Digital Marketing</option>
                  <option>IT Infrastructure</option>
                </select>
              </div>
              <div className="ct-f">
                <label htmlFor="ct-req">Tell us about your requirement</label>
                <textarea id="ct-req" placeholder="Tell us about your project…" />
              </div>
              <button className="ct-submit" type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
              </svg>Send Enquiry</button>
            </form>
            <p className="ct-safe">Your details are safe. No spam — only a tailored response from our team.</p>
          </div>
        </section>
        <footer className="ft" aria-label="Site footer">
          <div className="ft-grid">
            <div className="ft-brand">
              <a className="ft-logo" href="#top" aria-label="Webrandustry Digital Solutions">
                <i>W</i>
                <span>
                  <b>Webrandustry</b>
                  <small>Digital Solutions</small>
                </span>
              </a>
              <p className="ft-tag">Building Brands. Creating Technology. Driving Growth.</p>
              <ul className="ft-chips">
                <li>Branding</li>
                <li>Creative</li>
                <li>Technology</li>
                <li>Marketing</li>
                <li>IT Infrastructure</li>
                <li>3D Design &amp; Printing</li>
              </ul>
            </div>
            <nav className="ft-col" aria-label="Quick links">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#top">Home</a>
                </li>
                <li>
                  <a href="#what-we-do">What We Do</a>
                </li>
                <li>
                  <a href="#industries">Industries</a>
                </li>
                <li>
                  <a href="#our-work">Our Work</a>
                </li>
                <li>
                  <a href="#why">About Us</a>
                </li>
                <li>
                  <a href="#insights">Insights</a>
                </li>
                <li>
                  <a href="#contact-us">Contact</a>
                </li>
              </ul>
            </nav>
            <div className="ft-col">
              <h4>Let's Connect</h4>
              <ul className="ft-contact">
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                  </svg>
                  <a href="tel:+910000000000">+91 00000 00000</a>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <a href="mailto:hello@yourdomain.com">hello@yourdomain.com</a>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.6" />
                  </svg>
                  <span>Your address, City, State</span>
                </li>
              </ul>
            </div>
            <div className="ft-col">
              <h4>Follow Us</h4>
              <ul className="ft-social">
                <li>
                  <a href="#" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6.5 9.5v8M6.5 6.2v.1M11 17.5v-8M11 12.8c0-2 1.3-3.3 3-3.3s2.8 1.1 2.8 3.2v4.8" />
                      <rect x="3" y="3" width="18" height="18" rx="4" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="#" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.4l.6-3.5H14V8.8c0-.2.1-.3.3-.3z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="ft-bar">
            <p>© Webrandustry Digital Solutions. All Rights Reserved.</p>
            <a className="ft-top" href="#top" aria-label="Back to top">Back to top <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg></a>
          </div>
        </footer>
      </div>
    </div>
  );
}
