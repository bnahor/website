import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../data/projects';
import { MOTION } from '../../utils/motion';
import { Icon } from '../Icon';
import { useIsFirstRender } from '../../hooks/useIsFirstRender';

type ProjectsTab = 'featured' | 'all';

export function ProjectsTile() {
  const [activeTab, setActiveTab] = useState<ProjectsTab>('featured');
  const isInitialRender = useIsFirstRender();
  const tabs = useMemo(
    () => [
      {
        id: 'featured',
        label: 'Highlights',
        description: 'Selected standout builds'
      },
      {
        id: 'all',
        label: 'All Projects',
        description: `${projects.length} shipped initiatives`
      }
    ],
    [projects.length]
  );

  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured).slice(0, 3),
    [projects]
  );
  const isAll = activeTab === 'all';
  const displayProjects = useMemo(
    () => (isAll ? projects : featuredProjects),
    [featuredProjects, isAll, projects]
  );

  return (
    <div className="flex flex-col min-h-[480px] p-4 md:p-6">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
          Projects
        </h2>
        <p className="text-text-muted text-sm">
          A mix of highlighted work and the full archive
        </p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs md:text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-brand/60 bg-brand/10 text-brand shadow-[0_1px_6px_rgba(118,208,255,0.25)]'
                : 'border-white/10 text-text-muted hover:border-white/20 hover:text-text-primary'
            }`}
            whileHover={MOTION.mobileHover}
            whileTap={MOTION.tap}
            aria-pressed={activeTab === tab.id}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.span
                className="hidden text-[11px] text-brand/80 md:inline"
                initial={isInitialRender ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
              >
                {tab.description}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Project grid */}
      <div className="flex-1 overflow-visible">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={isInitialRender ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className={isAll ? 'h-full overflow-y-auto overflow-x-visible' : 'space-y-4 py-2'}
          >
            {isAll ? (
              <div className="grid grid-cols-1 gap-4 pb-4 px-1">
                {displayProjects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    custom={index}
                    initial={false}
                    animate="show"
                    variants={MOTION.listItem}
                    exit={{ opacity: 0, y: -12 }}
                    className="group relative flex flex-col gap-2 rounded-lg border border-transparent bg-white/0 p-3 md:p-4 transition-colors duration-200 hover:border-white/15 hover:bg-white/5 backdrop-brightness-[1.05]"
                    whileHover={MOTION.cardHover}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-text-primary group-hover:text-brand transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="px-2 py-1 bg-brand/20 text-brand text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-text-muted text-sm leading-[1.75] mb-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-brand/10 text-brand text-xs rounded transition-transform shadow-[0_1px_6px_rgba(118,208,255,0.25)] group-hover:-translate-y-px"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 text-sm">
                      {project.href && (
                        <motion.a
                          href={project.href}
                          className="inline-flex items-center gap-1 text-brand hover:text-brand/80 transition-colors focus-visible:ring-2 focus-visible:ring-brand outline-none rounded"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ x: 2 }}
                        >
                          View Project
                          <Icon name="arrowRight" size={14} />
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              displayProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  custom={index}
                  initial={false}
                  animate="show"
                  variants={MOTION.listItem}
                  exit={{ opacity: 0, y: -12 }}
                  whileHover={MOTION.cardHover}
                  className="group relative flex flex-col gap-2 rounded-lg border border-transparent bg-white/0 p-3 md:p-4 transition-colors duration-200 hover:border-white/15 hover:bg-white/5 backdrop-brightness-[1.05]"
                >
                  <div className="pr-8">
                    <h3 className="font-medium text-text-primary text-sm mb-1">
                      {project.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tech.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-brand/10 text-brand text-xs rounded transition-transform shadow-[0_1px_6px_rgba(118,208,255,0.25)] group-hover:-translate-y-px"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-text-muted text-xs">
                          +{project.tech.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  {project.href && (
                    <motion.a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${project.title}`}
                      className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center rounded text-brand opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 hover:text-brand/80 focus-visible:ring-2 focus-visible:ring-brand outline-none"
                      whileHover={{ x: 2 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon name="arrowRight" size={16} />
                    </motion.a>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* No click hint; static tiles */}
    </div>
  );
}
