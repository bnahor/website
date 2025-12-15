import { m } from 'framer-motion';
import { experience } from '../../data/experience';
import { education } from '../../data/education';
import { highlights } from '../../data/highlights';
import { Icon } from '../Icon';
import { useMemo } from 'react';

type TimelineIcon = 'briefcase' | 'education' | 'trophy';

interface TimelineEvent {
  type: 'experience' | 'education' | 'achievement';
  title: string;
  subtitle: string;
  date: string;
  endDate?: string | null;
  description?: string;
  location?: string;
  icon: TimelineIcon;
  color: string;
}

// Combine and sort all timeline events
function createTimeline(): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Add experience
  experience.forEach(exp => {
    events.push({
      type: 'experience',
      title: exp.role,
      subtitle: exp.company,
      date: exp.start,
      endDate: exp.end,
      description: exp.bullets?.[0] || '',
      icon: 'briefcase',
      color: 'brand'
    });
  });

  // Add education
  education.forEach(edu => {
    events.push({
      type: 'education',
      title: edu.degree,
      subtitle: edu.school,
      date: edu.start,
      endDate: edu.end,
      description: edu.details?.[0] || '',
      icon: 'education',
      color: 'purple'
    });
  });

  // Add highlights
  highlights.forEach(highlight => {
    events.push({
      type: 'achievement',
      title: highlight.title,
      // Avoid redundant subtitle for achievements; badge already indicates type
      subtitle: '',
      date: highlight.date,
      description: highlight.note || '',
      icon: 'trophy',
      color: 'yellow'
    });
  });

  // Sort by date (most recent first)
  return events.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

interface TimelineTileProps {
  isExpanded: boolean;
}

export function TimelineTile({ isExpanded }: TimelineTileProps) {
  const timeline = createTimeline();
  const displayEvents = isExpanded ? timeline : timeline.slice(0, 6);

  const groups = useMemo(() => {
    const map = new Map<string, TimelineEvent[]>();
    for (const ev of displayEvents) {
      const y = new Date(ev.date).getFullYear().toString();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(ev);
    }
    // sort each group by date desc
    for (const [y, arr] of map) {
      arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      map.set(y, arr);
    }
    // return array of [year, events] sorted by year desc
    return Array.from(map.entries()).sort(([a], [b]) => parseInt(b) - parseInt(a));
  }, [displayEvents]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
          Career Timeline
        </h2>
        <p className="text-text-muted text-sm">
          {isExpanded 
            ? 'Complete journey of education, experience, and achievements'
            : 'Recent milestones and career highlights'
          }
        </p>
      </div>

      {/* Timeline (grouped by year in responsive grid) */}
      <div className="flex-1 overflow-hidden px-1 md:px-0">
        <div className={`${isExpanded ? 'overflow-y-auto h-full pr-1' : ''}`}>
          <div className="space-y-6 pb-4">
            {groups.map(([year, items]) => (
              <div key={year} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm tracking-wider uppercase text-text-muted">{year}</div>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mx-1 md:mx-0">
                  {items.map((event, idx) => (
                    <m.div
                      key={`${event.type}-${event.title}-${idx}`}
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-black ${
                            event.type === 'experience' ? 'bg-brand' : event.type === 'education' ? 'bg-purple-500' : 'bg-yellow-500'
                          }`}>
                            <Icon name={event.icon} size={12} />
                          </span>
                          <span className="text-text-muted flex items-center gap-1 leading-none">
                            <Icon name="calendar" size={12} /> {event.date}{event.endDate && ` - ${event.endDate}`}
                          </span>
                        </div>
                        <span className="inline-flex items-center" aria-hidden={true}>
                          <span className={
                            `w-2 h-2 rounded-full ${
                              event.type === 'experience' ? 'bg-brand' :
                              event.type === 'education' ? 'bg-purple-400' :
                              'bg-yellow-400'
                            }`
                          } />
                          <span className="sr-only">{event.type} event</span>
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="font-semibold text-text-primary text-sm md:text-base leading-snug">{event.title}</div>
                        {event.subtitle && event.type !== 'achievement' && (
                          <div className="text-brand text-[13px] md:text-sm">{event.subtitle}</div>
                        )}
                        {event.location && (
                          <div className="text-xs text-text-muted flex items-center gap-1 leading-none">
                            <Icon name="location" size={12} /> {event.location}
                          </div>
                        )}
                        {event.description && (
                          <p className="text-xs md:text-sm text-text-muted leading-relaxed mt-1">
                            {!isExpanded && event.description.length > 120
                              ? `${event.description.substring(0, 120)}...`
                              : event.description}
                          </p>
                        )}
                      </div>
                    </m.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with summary stats */}
      <div className="flex-shrink-0 pt-4 border-t border-white/10">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-lg font-bold text-text-primary">
              {experience.length}
            </div>
            <div className="text-xs text-text-muted">Roles</div>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">
              {education.length}
            </div>
            <div className="text-xs text-text-muted">Degrees</div>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary">
              {highlights.length}
            </div>
            <div className="text-xs text-text-muted">Achievements</div>
          </div>
        </div>
        
        {/* No click hint; static tiles */}
      </div>
    </div>
  );
}
