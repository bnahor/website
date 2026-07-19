import { m } from 'framer-motion';
import { Icon } from '../Icon';
import { profile } from '../../data/profile';

const capabilities = [
  'Robotics capture systems',
  'Reliable data platforms',
  'Operator-facing tools',
] as const;

export function HeroTile() {
  return (
    <section id="top" className="hero-tile glass-tile" aria-labelledby="hero-heading">
      <m.div
        className="hero-copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero-status">
          <span className="status-dot" aria-hidden="true" />
          <span>
            {profile.role} · {profile.company}
          </span>
          <span className="hero-location">{profile.location}</span>
        </div>

        <p className="hero-overline">Software that behaves under pressure.</p>
        <h1 id="hero-heading">
          Architecture is only finished when the <em>operator trusts it.</em>
        </h1>
        <p className="hero-intro">{profile.valueProp}</p>

        <div className="hero-actions">
          <a className="primary-action" href={`mailto:${profile.email}`}>
            Start a conversation
            <Icon name="arrowRight" size={16} />
          </a>
          <a
            className="secondary-action"
            href={profile.links.resume}
            target="_blank"
            rel="noreferrer"
          >
            View résumé
            <Icon name="arrowRight" size={15} />
          </a>
        </div>
      </m.div>

      <m.aside
        className="hero-console"
        aria-label="Current engineering focus"
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="console-topline">
          <span>Current focus</span>
          <span className="console-id">RB / 2026</span>
        </div>
        <p>
          Turning ambiguous physical-world workflows into dependable software, clear
          ownership, and recoverable operations.
        </p>
        <ol className="capability-list">
          {capabilities.map((capability, index) => (
            <li key={capability}>
              <span aria-hidden="true">0{index + 1}</span>
              {capability}
            </li>
          ))}
        </ol>
        <div className="console-footer">
          <span>BUILD</span>
          <span className="console-line" aria-hidden="true" />
          <span>OBSERVE</span>
          <span className="console-line" aria-hidden="true" />
          <span>RECOVER</span>
        </div>
      </m.aside>
    </section>
  );
}
