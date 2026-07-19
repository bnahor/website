import { m } from 'framer-motion';
import { projects } from '../../data/projects';
import { Icon } from '../Icon';

export function ProjectsTile() {
  return (
    <section id="projects" className="projects-section" aria-labelledby="projects-heading">
      <div className="section-heading section-heading--projects">
        <div>
          <p className="section-kicker">Selected projects</p>
          <h2 id="projects-heading" className="section-title">
            Systems with a point of view.
          </h2>
        </div>
        <p className="section-description">
          Hackathon work spanning applied ML, generative worlds, and creator tooling.
        </p>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => (
          <m.article
            key={project.title}
            className={`project-card glass-tile ${
              index === 0 ? 'project-card--lead' : ''
            }`}
            whileHover={{ y: -4 }}
          >
            <div className="project-topline">
              <span>0{index + 1}</span>
              <span>{project.date}</span>
            </div>

            <div className="project-heading">
              <p>{project.event}</p>
              <h3>{project.title}</h3>
              <span>{project.role}</span>
            </div>

            <p className="project-description">{project.description}</p>
            <p className="project-impact">{project.impact}</p>

            <div className="project-footer">
              <div className="tech-list">
                {project.tech.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>

              {(project.href || project.demoHref) && (
                <div className="project-links">
                  {project.href && (
                    <a href={project.href} target="_blank" rel="noreferrer">
                      Source <Icon name="arrowRight" size={14} />
                    </a>
                  )}
                  {project.demoHref && (
                    <a href={project.demoHref} target="_blank" rel="noreferrer">
                      Live <Icon name="arrowRight" size={14} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </m.article>
        ))}
      </div>
    </section>
  );
}
