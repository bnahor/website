import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience } from '../../data/experience';
import { Icon } from '../Icon';
import { MOTION } from '../../utils/motion';
import { useIsFirstRender } from '../../hooks/useIsFirstRender';

interface ExperienceTileProps {
  isExpanded: boolean;
}

type ExperienceTab = 'highlights' | 'all';

export function ExperienceTile({ isExpanded: _isExpanded }: ExperienceTileProps) {
  const [activeTab, setActiveTab] = useState<ExperienceTab>('highlights');
  const isInitialRender = useIsFirstRender();
  const tabs = useMemo(
    () => [
      {
        id: 'highlights',
        label: 'Highlights',
        description: 'Recent roles at a glance'
      },
      {
        id: 'all',
        label: 'All Roles',
        description: `${experience.length} positions across the career`
      }
    ],
    [experience.length]
  );

  const displayExperience = useMemo(
    () => (activeTab === 'highlights' ? experience.slice(0, 2) : experience),
    [activeTab, experience]
  );
  const showFullContent = activeTab === 'all';
  return (
    <div className="flex flex-col min-h-[480px] p-4 md:p-6">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">Experience</h2>
        <p className="text-text-muted text-sm">Professional journey and key accomplishments</p>
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-visible">
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

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={isInitialRender ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-4 py-2"
          >
            {displayExperience.map((item, index) => (
              <motion.div
                key={`${item.company}-${item.role}`}
                custom={index}
                initial={false}
                animate="show"
                variants={MOTION.listItem}
                whileHover={MOTION.cardHover}
                className="group relative flex flex-col gap-2 rounded-lg border border-transparent bg-white/0 p-3 md:p-4 transition-colors duration-200 hover:border-white/15 hover:bg-white/5 backdrop-brightness-[1.05]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm md:text-base leading-snug">{item.role}</h3>
                    <p className="text-brand text-xs md:text-sm font-medium">{item.company}</p>
                  </div>
                  <div className="text-xs text-text-muted whitespace-nowrap flex items-center gap-1 leading-none">
                    <Icon name="calendar" size={12} /> {item.start} – {item.end}
                  </div>
                </div>

                {item.bullets?.length > 0 && (
                  <ul className="text-sm text-text-muted space-y-1.5 leading-relaxed list-none m-0">
                    {item.bullets
                      .slice(0, showFullContent ? item.bullets.length : 2)
                      .map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand mt-1 flex-shrink-0">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                  </ul>
                )}

                {item.tech?.length > 0 && (
                  <div className="mt-auto pt-1 flex flex-wrap gap-1.5">
                    {item.tech
                      .slice(0, showFullContent ? item.tech.length : 4)
                      .map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-brand/10 text-brand text-xs rounded transition-transform shadow-[0_1px_6px_rgba(118,208,255,0.25)] group-hover:-translate-y-px"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
