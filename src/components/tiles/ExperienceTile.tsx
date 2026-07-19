import { experience } from '../../data/experience';
import { Icon } from '../Icon';

export function ExperienceTile() {
  return (
    <section id="experience" className="experience-section" aria-labelledby="experience-heading">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Work log · 2023–Present</p>
          <h2 id="experience-heading" className="section-title">Experience</h2>
        </div>
        <p className="section-description">
          The systems I shipped, what broke, and the measurable result.
        </p>
      </div>

      <div className="experience-console">
        <div className="log-header" aria-hidden="true">
          <span>TIME AXIS</span>
          <span>ENTRY</span>
          <span>FIELD NOTES</span>
        </div>
        {experience.map((item, index) => {
          const visibleBulletCount = item.current ? 2 : index === 1 ? 2 : 1;
          const remainingBullets = item.bullets.slice(visibleBulletCount);

          return (
            <article
              key={`${item.company}-${item.role}`}
              className={`log-entry ${item.current ? 'log-entry--current' : ''}`}
            >
              <div className="log-time">
                <span className="log-node" aria-hidden="true" />
                <time>{item.start}</time>
                <span>{item.end}</span>
              </div>

              <div className="log-identity">
                <div className="log-index" aria-hidden="true">
                  LOG {String(index + 1).padStart(2, '0')}
                </div>
                <p className="experience-company">
                  {item.company}
                  {item.current && <span className="current-pill">Recording</span>}
                </p>
                <h3>{item.role}</h3>
                <div className="experience-location">
                  <Icon name="location" size={13} />
                  {item.location}
                </div>
              </div>

              <div className="log-notes">
                <p className="experience-summary">{item.summary}</p>

                {item.story && (
                  <blockquote className="incident-story">
                    <span>INCIDENT / RECOVERY</span>
                    {item.story}
                  </blockquote>
                )}

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
                      Open full log ({remainingBullets.length})
                      <Icon name="arrowDown" size={14} />
                    </summary>
                    <ul className="impact-list impact-list--additional">
                      {remainingBullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </details>
                )}

                <div className="tech-list tech-list--dark" aria-label="Technologies used">
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
