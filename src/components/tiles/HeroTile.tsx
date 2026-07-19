import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Icon } from '../Icon';
import { profile } from '../../data/profile';
import { commitCadence, contributionTotal } from '../../data/contributions';

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
  const reduceMotion = useReducedMotion();
  const [time, setTime] = useState(() => singaporeTime(new Date()));

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setTime(singaporeTime(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const width = 600;
  const height = 72;
  const commits = commitCadence.map((item) => item.commits);
  const max = Math.max(...commits);
  const points = commits
    .map((value, index) => {
      const x = (index / (commits.length - 1)) * width;
      const y = height - 7 - (value / max) * (height - 14);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <aside
      className="timebase"
      aria-label={`${reduceMotion ? 'Static' : 'Live'} Singapore capture timebase and GitHub commit cadence`}
    >
      <div className="timebase-header">
        <span>SG capture timebase</span>
        <span className="timebase-live">
          <i aria-hidden="true" />
          {reduceMotion ? 'static' : 'live'}
        </span>
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
      <div className="cadence-channel">
        <div className="cadence-copy">
          <span>CH 05 · COMMIT CADENCE</span>
          <strong>{contributionTotal.toLocaleString('en-US')}</strong>
          <small>contributions · last 12 months</small>
        </div>
        <div
          className="cadence-plot"
          role="img"
          aria-label={`Monthly GitHub commit cadence from August through July: ${commitCadence
            .map((item) => `${item.month} ${item.commits}`)
            .join(', ')}. ${contributionTotal.toLocaleString('en-US')} total contributions.`}
        >
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
            <path className="cadence-grid" d="M0 18H600M0 36H600M0 54H600" />
            <polyline className="cadence-trace" points={points} />
            {commits.map((value, index) => (
              <circle
                key={commitCadence[index]?.month}
                cx={(index / (commits.length - 1)) * width}
                cy={height - 7 - (value / max) * (height - 14)}
                r="2.5"
              />
            ))}
          </svg>
          <div className="cadence-months" aria-hidden="true">
            <span>Aug 25</span>
            <span>Jul 26</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function HeroTile() {
  return (
    <section id="top" className="hero-tile" aria-labelledby="hero-heading">
      <div className="hero-copy">
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
      </div>

      <div className="hero-instrument">
        <TimebaseDisplay />
        <p className="instrument-note">
          I care about the seam between software and the physical world: clocks,
          dropped connections, operators in a hurry, and the recovery path when any
          of them fail.
        </p>
      </div>
    </section>
  );
}
