import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { Icon } from '../Icon';
import { profile } from '../../data/profile';

function singaporeTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Singapore',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function TimebaseDisplay() {
  const [time, setTime] = useState(() => singaporeTime(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => setTime(singaporeTime(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside className="timebase" aria-label="Live Singapore timebase">
      <div className="timebase-header">
        <span>SG capture timebase</span>
        <span className="timebase-live"><i aria-hidden="true" />live</span>
      </div>
      <time className="timebase-clock" dateTime={new Date().toISOString()}>
        {time}<small> SGT</small>
      </time>
      <div className="scope" aria-hidden="true">
        <svg viewBox="0 0 600 104" preserveAspectRatio="none">
          <path className="scope-grid" d="M0 26H600M0 52H600M0 78H600M75 0V104M150 0V104M225 0V104M300 0V104M375 0V104M450 0V104M525 0V104" />
          <path className="scope-trace" d="M0 65 C18 64 25 63 39 62 L51 61 57 27 64 83 72 50 81 61 C107 63 118 64 137 62 C165 61 173 60 190 58 L202 57 208 29 216 81 224 48 233 59 C263 62 274 63 293 60 C321 57 330 56 346 54 L358 53 364 25 372 80 380 46 389 56 C419 60 430 61 449 58 C477 55 486 54 502 52 L514 51 520 23 528 78 536 44 545 54 C568 57 581 59 600 57" />
        </svg>
        <span className="scope-playhead" />
      </div>
      <div className="channel-row">
        <span><i />CAM A <b>SYNC</b></span>
        <span><i />CAM B <b>SYNC</b></span>
        <span><i />IMU <b>LOCKED</b></span>
      </div>
    </aside>
  );
}

export function HeroTile() {
  return (
    <section id="top" className="hero-tile" aria-labelledby="hero-heading">
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

        <p className="hero-overline">Capture systems · operator tools</p>
        <h1 id="hero-heading">
          Keeping cameras, trackers, and operators <em>on the same clock.</em>
        </h1>
        <p className="hero-intro">{profile.valueProp}</p>

        <div className="hero-actions">
          <a className="primary-action" href={`mailto:${profile.email}`}>
            Email me
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

      <m.div
        className="hero-instrument"
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <TimebaseDisplay />
        <p className="instrument-note">
          I care about the seam between software and the physical world: clocks,
          dropped connections, operators in a hurry, and the recovery path when any
          of them fail.
        </p>
      </m.div>
    </section>
  );
}
