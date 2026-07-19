import { Icon } from './Icon';
import { profile } from '../data/profile';

const navItems = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Rohan Bahl, back to top">
        <span className="wordmark-mark" aria-hidden="true">
          <i />
        </span>
        <span className="wordmark-name">Rohan Bahl</span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} className="nav-link" href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-resume" href={profile.links.resume} target="_blank" rel="noreferrer">
        Résumé
        <Icon name="arrowRight" size={14} />
      </a>
    </header>
  );
}
