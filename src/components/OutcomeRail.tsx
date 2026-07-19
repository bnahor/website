import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { outcomes, type Outcome } from '../data/highlights';
import { SignalTrace } from './SignalTrace';

function AnimatedValue({ outcome }: { outcome: Outcome }) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? outcome.value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(outcome.value);
      return;
    }

    const start = performance.now();
    const duration = 900;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(outcome.value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [outcome.value, reduceMotion]);

  return (
    <>
      {outcome.prefix}
      {value.toFixed(outcome.decimals ?? 0)}
      {outcome.suffix}
    </>
  );
}

export function OutcomeRail() {
  return (
    <section className="outcome-rail" aria-labelledby="signal-heading">
      <div className="outcome-rail-intro">
        <span className="eyebrow">FIELD READOUT / 04 CH</span>
        <h2 id="signal-heading">What changed</h2>
        <p>Four recent results from capture, planning, and reliability work.</p>
      </div>

      <div className="outcome-list">
        {outcomes.map((outcome, index) => (
          <article
            key={outcome.label}
            className="outcome"
          >
            <div className="outcome-topline">
              <span>CH {String(index + 1).padStart(2, '0')}</span>
              <span>STABLE</span>
            </div>
            <strong><AnimatedValue outcome={outcome} /></strong>
            <span>{outcome.label}</span>
            <SignalTrace values={outcome.trace} />
          </article>
        ))}
      </div>
    </section>
  );
}
