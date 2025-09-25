import { motion } from 'framer-motion';
import { MOTION } from '../../utils/motion';
import { education } from '../../data/education';
import { Icon } from '../Icon';

interface EducationTileProps {
  isExpanded: boolean;
}

export function EducationTile({ isExpanded: _isExpanded }: EducationTileProps) {
  return (
    <div className="flex flex-col min-h-[400px] p-4 md:p-6">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
          Education
        </h2>
        <p className="text-text-muted text-sm">
          Academic background and achievements
        </p>
      </div>

      {/* Education items */}
      <div className="flex-1 overflow-visible">
        <div className="space-y-4">
          {education.map((item, index) => (
            <div key={item.school} className="space-y-2">
              <motion.div
                custom={index}
                initial={false}
                animate="show"
                variants={MOTION.listItem}
                whileHover={MOTION.cardHover}
                className="group relative space-y-2 rounded-lg border border-transparent bg-white/0 p-3 transition-colors duration-200 hover:border-white/15 hover:bg-white/5 backdrop-brightness-[1.05]"
              >
                {/* School and degree */}
                <div>
                  <h3 className="font-semibold text-text-primary text-sm md:text-base">
                    {item.school}
                  </h3>
                  <p className="text-brand text-sm font-medium">
                    {item.degree}
                  </p>
                  {/* No field property in Education type */}
                </div>

                {/* Duration and location */}
                <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1 leading-none">
                    <Icon name="calendar" size={12} /> {item.start} - {item.end}
                  </span>
                </div>

                {/* Details */}
                {item.details && item.details.length > 0 && (
                  <div className="text-sm space-y-1">
                    {item.details.map((detail, idx) => (
                      <div key={idx} className="text-text-muted">
                        {detail}
                      </div>
                    ))}
                  </div>
                )}

                {/* Expanded content */}
                {/* Removed collapsed hint; tiles are static */}
              </motion.div>

              {/* Separator */}
              {index < education.length - 1 && (
                <div className="border-b border-stroke/30 pt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* No click hint; tiles are static now */}
    </div>
  );
}
