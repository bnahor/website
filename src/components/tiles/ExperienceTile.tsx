import { experience } from '../../data/experience';
import { Icon } from '../Icon';

export function ExperienceTile() {
  return (
    <section id="experience" className="experience-section" aria-labelledby="experience-heading">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Experience · 2023—Present</p>
          <h2 id="experience-heading" className="section-title">
            Engineering impact,
            <br />
            in operating terms.
          </h2>
        </div>
        <p className="section-description">
          Roles where backend decisions met real operators, physical systems, and
          production constraints.
        </p>
      </div>

      <div className="experience-list">
        {experience.map((item, index) => {
          const visibleBulletCount = item.current ? 3 : 2;
          const remainingBullets = item.bullets.slice(visibleBulletCount);

          return (
            <article
              key={`${item.company}-${item.role}`}
              className={`experience-card glass-tile ${item.current ? 'experience-card--current' : ''}`}
            >
              <div className="experience-meta">
                <div className="experience-index" aria-hidden="true">
                  /0{index + 1}
                </div>
                <div>
                  <p className="experience-company">
                    {item.company}
                    {item.current && <span className="current-pill">Current</span>}
                  </p>
                  <h3>{item.role}</h3>
                </div>
                <div className="experience-dates">
                  <span>
                    <Icon name="calendar" size={13} />
                    {item.start} — {item.end}
                  </span>
                  <span>
                    <Icon name="location" size={13} />
                    {item.location}
                  </span>
                </div>
              </div>

              <div className="experience-body">
                <p className="experience-summary">{item.summary}</p>

                <div className="metric-row" aria-label="Role highlights">
                  {item.metrics.map((metric) => (
                    <span key={metric}>{metric}</span>
                  ))}
                </div>

                <ul className="impact-list">
                  {item.bullets.slice(0, visibleBulletCount).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>

                {remainingBullets.length > 0 && (
                  <details className="experience-more">
                    <summary>
                      {remainingBullets.length} more{' '}
                      {remainingBullets.length === 1 ? 'outcome' : 'outcomes'}
                      <Icon name="arrowDown" size={14} />
                    </summary>
                    <ul className="impact-list impact-list--additional">
                      {remainingBullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </details>
                )}

                <div className="tech-list" aria-label="Technologies used">
                  {item.tech.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
