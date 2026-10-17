
import { Link, useLocation } from 'react-router-dom';

/* One place for every nav link: clean URL path -> section id on the page */
export const SECTION_ROUTES = [
  { label: 'Home', path: '/', id: 'top' },
  { label: 'What We Do', path: '/what-we-do', id: 'what-we-do' },
  { label: 'Industries', path: '/industries', id: 'industries' },
  { label: 'Our Work', path: '/our-work', id: 'our-work' },
  { label: 'About Us', path: '/about-us', id: 'why' },
  { label: 'Insights', path: '/insights', id: 'insights' },
  { label: 'Contact', path: '/contact', id: 'contact-us' },
];

export const normalizePath = (p) => p.replace(/\/+$/, '') || '/';

export const findSection = (path) =>
  SECTION_ROUTES.find((r) => r.path === normalizePath(path));

export function scrollToSection(route, behavior = 'smooth') {
  if (!route) return;
  if (route.id === 'top') {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  document.getElementById(route.id)?.scrollIntoView({ behavior, block: 'start' });
}

/* A router link that also scrolls when you click the page you are already on */
export function SectionLink({ to, onClick, children, ...rest }) {
  const { pathname } = useLocation();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (normalizePath(pathname) === normalizePath(to)) {
      e.preventDefault();
      scrollToSection(findSection(to));
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}