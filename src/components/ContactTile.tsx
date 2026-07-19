import { useState } from 'react';
import { m } from 'framer-motion';
import { Icon } from './Icon';
import { profile } from '../data/profile';

export function ContactTile() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="contact-tile" aria-labelledby="contact-heading">
      <p className="section-kicker">Say hello</p>
      <h2 id="contact-heading" className="section-title section-title--compact">Contact</h2>
      <p className="contact-copy">
        Email is best. I&apos;m happy to talk about robotics, capture systems, or a
        difficult engineering problem you&apos;re trying to untangle.
      </p>

      <div className="contact-actions">
        <a className="primary-action" href={`mailto:${profile.email}`}>
          <Icon name="email" size={17} />
          Email Rohan
        </a>
        <m.button
          className="secondary-action"
          type="button"
          onClick={copyEmail}
          whileTap={{ scale: 0.97 }}
          aria-live="polite"
        >
          <Icon name={copied ? 'check' : 'clipboard'} size={16} />
          {copied ? 'Copied' : 'Copy email'}
        </m.button>
      </div>

      <p className="contact-address">{profile.email}</p>

      <div className="contact-links">
        <a href={profile.links.github} target="_blank" rel="noreferrer">
          GitHub <Icon name="arrowRight" size={13} />
        </a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <Icon name="arrowRight" size={13} />
        </a>
        <a href={profile.links.resume} target="_blank" rel="noreferrer">
          Résumé <Icon name="arrowRight" size={13} />
        </a>
      </div>
    </section>
  );
}
