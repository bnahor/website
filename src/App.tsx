import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import type { JSX, ReactNode } from 'react';
import { profile } from './data/profile';
import { LoadingScreen } from './components/LoadingScreen';
import { PlaneNoiseBackground } from './components/PlaneNoiseBackground';
import { DelayedTileFallback } from './components/tiles/DelayedTileFallback';
import { usePullToRefresh } from './hooks/usePullToRefresh';

const createPrefetch = (loader: () => Promise<unknown>) => {
  let promise: Promise<unknown> | null = null;
  return () => {
    if (!promise) {
      promise = loader();
    }
    return promise;
  };
};

const heroTileLoader = () => import('./components/tiles/HeroTile');
const HeroTile = lazy(async () => {
  const module = await heroTileLoader();
  return { default: module.HeroTile };
});
const prefetchHeroTile = createPrefetch(heroTileLoader);

const educationTileLoader = () => import('./components/tiles/EducationTile');
const EducationTile = lazy(async () => {
  const module = await educationTileLoader();
  return { default: module.EducationTile };
});
const prefetchEducationTile = createPrefetch(educationTileLoader);

const experienceTileLoader = () => import('./components/tiles/ExperienceTile');
const ExperienceTile = lazy(async () => {
  const module = await experienceTileLoader();
  return { default: module.ExperienceTile };
});
const prefetchExperienceTile = createPrefetch(experienceTileLoader);

const projectsTileLoader = () => import('./components/tiles/ProjectsTile');
const ProjectsTile = lazy(async () => {
  const module = await projectsTileLoader();
  return { default: module.ProjectsTile };
});
const prefetchProjectsTile = createPrefetch(projectsTileLoader);

function TileSlot({ children, prefetch }: { children: ReactNode; prefetch?: () => Promise<unknown> }) {
  const handleIntent = prefetch
    ? () => {
        void prefetch();
      }
    : undefined;

  return (
    <div
      className="floating-content"
      onPointerEnter={handleIntent}
      onFocus={handleIntent}
      onTouchStart={handleIntent}
    >
      <Suspense fallback={<DelayedTileFallback delayMs={120} />}>{children}</Suspense>
    </div>
  );
}

type TileDefinition = {
  key: string;
  prefetch: () => Promise<unknown>;
  render: () => JSX.Element;
};

const tileDefinitions: TileDefinition[] = [
  {
    key: 'hero',
    prefetch: prefetchHeroTile,
    render: () => <HeroTile isExpanded={false} />,
  },
  {
    key: 'education',
    prefetch: prefetchEducationTile,
    render: () => <EducationTile isExpanded={false} />,
  },
  {
    key: 'experience',
    prefetch: prefetchExperienceTile,
    render: () => <ExperienceTile isExpanded={false} />,
  },
  {
    key: 'projects',
    prefetch: prefetchProjectsTile,
    render: () => <ProjectsTile />,
  },
];

function TileGrid({ variant }: { variant: 'desktop' | 'mobile' }) {
  const containerClass =
    variant === 'desktop'
      ? 'hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12'
      : 'md:hidden space-y-8';

  return (
    <div className={containerClass}>
      {tileDefinitions.map(({ key, prefetch, render }) => (
        <TileSlot key={`${variant}-${key}`} prefetch={prefetch}>
          {render()}
        </TileSlot>
      ))}
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const refreshTimeoutRef = useRef<number | null>(null);

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setReady(false);
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = window.setTimeout(() => setReady(true), 100);
  }, []);

  const { isRefreshing, pullDistance, containerRef, isPulling } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80
  });
  

  useEffect(() => {
    const finish = () => setReady(true);
    const onLoad = async () => {
      const fonts: any = (document as any).fonts;
      if (fonts && typeof fonts.ready?.then === 'function') {
        try { await fonts.ready; } catch {}
      }
      await Promise.all([
        prefetchHeroTile(),
        prefetchEducationTile(),
        prefetchExperienceTile(),
        prefetchProjectsTile(),
      ]);
      requestAnimationFrame(finish);
    };
    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    prefetchHeroTile();
    prefetchEducationTile();
    prefetchExperienceTile();
    prefetchProjectsTile();
  }, []);

  useEffect(() => () => {
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current);
    }
  }, []);

  return (
    <div 
      ref={containerRef as any}
      className="text-text-primary bg-bg min-h-screen relative overflow-hidden"
      style={{
        transform: isPulling ? `translateY(${Math.min(pullDistance, 50)}px)` : undefined,
        transition: isPulling ? 'none' : 'transform 0.3s ease'
      }}
    >
      {(isPulling || isRefreshing) && (
        <div 
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-brand/10 backdrop-blur-sm border border-brand/20 rounded-b-lg px-4 py-2"
          style={{
            transform: `translateX(-50%) translateY(${Math.max(-50, (pullDistance - 50) / 2)}px)`,
            opacity: Math.min(1, pullDistance / 40)
          }}
        >
          <div className={`w-4 h-4 border-2 border-brand border-t-transparent rounded-full ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-brand text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : pullDistance >= 80 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}

      {ready && (
        <>
            <PlaneNoiseBackground />


          <div className="relative z-10">
            <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
              <TileGrid variant="desktop" />

              <TileGrid variant="mobile" />

              <footer className="mt-16 pt-8 border-t border-stroke/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-text-muted text-sm">
                    © {new Date().getFullYear()} {profile.name} — Built with React, Framer Motion & Tailwind CSS
                  </div>
                  <div className="flex items-center gap-6">
                    <a 
                      href={profile.links.github}
                      className="text-text-muted hover:text-text-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand outline-none rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                    <a 
                      href={profile.links.linkedin}
                      className="text-text-muted hover:text-text-primary transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand outline-none rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                    {/* Removed X link per request */}
                  </div>
                </div>
              </footer>
            </main>
          </div>
        </>
      )}

      <LoadingScreen show={!ready} minDurationMs={250} />
    </div>
  );
}
