import { education } from '../../data/education';
import { Icon } from '../Icon';

export function EducationTile() {
  return (
    <section id="about" className="education-tile" aria-labelledby="education-heading">
      <p className="section-kicker">Background</p>
      <h2 id="education-heading" className="section-title section-title--compact">Education</h2>

      <div className="education-list">
        {education.map((item, index) => (
          <article key={item.school} className="education-item">
            <span className="education-index" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <h3>{item.school}</h3>
              <p>{item.degree}</p>
              {item.details?.map((detail) => (
                <span className="education-detail" key={detail}>
                  {detail}
                </span>
              ))}
            </div>
            <span className="education-date">
              <Icon name="calendar" size={13} />
              {item.start} – {item.end}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
