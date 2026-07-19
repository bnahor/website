import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { ContactTile } from './components/ContactTile';
import { OutcomeRail } from './components/OutcomeRail';
import { SiteHeader } from './components/SiteHeader';
import { EducationTile } from './components/tiles/EducationTile';
import { ExperienceTile } from './components/tiles/ExperienceTile';
import { HeroTile } from './components/tiles/HeroTile';
import { ProjectsTile } from './components/tiles/ProjectsTile';
import { profile } from './data/profile';

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="site-shell">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>

          <div className="time-grid" aria-hidden="true" />

          <SiteHeader />

          <main id="main-content" className="site-main">
            <HeroTile />
            <OutcomeRail />
            <ExperienceTile />
            <ProjectsTile />

            <div className="closing-grid">
              <EducationTile />
              <ContactTile />
            </div>
          </main>

          <footer className="site-footer">
            <p>
              © {new Date().getFullYear()} {profile.name}
            </p>
            <p>Designed and built in Singapore.</p>
          </footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
