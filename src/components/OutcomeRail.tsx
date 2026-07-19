import { outcomes } from '../data/highlights';

export function OutcomeRail() {
  return (
    <section className="outcome-rail glass-tile" aria-label="Selected engineering outcomes">
      <div className="outcome-rail-intro">
        <span className="eyebrow">Selected signal</span>
        <p>Recent outcomes across robotics, data operations, and reliability.</p>
      </div>

      <div className="outcome-list">
        {outcomes.map((outcome) => (
          <article
            key={outcome.label}
            className="outcome"
          >
            <strong>{outcome.value}</strong>
            <span>{outcome.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
