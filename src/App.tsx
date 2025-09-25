import { HeroTile } from './components/tiles/HeroTile';
import { EducationTile } from './components/tiles/EducationTile';
import { ExperienceTile } from './components/tiles/ExperienceTile';
import { profile } from './data/profile';
import { useEffect, useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { PlaneNoiseBackground } from './components/PlaneNoiseBackground';
import { ProjectsTile } from './components/tiles/ProjectsTile';
import { usePullToRefresh } from './hooks/usePullToRefresh';

export default function App() {
  const [ready, setReady] = useState(false);
  
  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setReady(false);
    setTimeout(() => setReady(true), 100);
  };
  
  
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
      requestAnimationFrame(finish);
    };
    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }
    return () => window.removeEventListener('load', onLoad);
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
            
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                <div className="floating-content">
                  <HeroTile isExpanded={false} />
                </div>
                <div className="floating-content">
                  <EducationTile isExpanded={false} />
                </div>
                <div className="floating-content">
                  <ExperienceTile isExpanded={false} />
                </div>
                <div className="floating-content">
                  <ProjectsTile />
                </div>
              </div>

              <div className="md:hidden space-y-8">
                <div className="floating-content">
                  <HeroTile isExpanded={false} />
                </div>
                <div className="floating-content">
                  <EducationTile isExpanded={false} />
                </div>
                <div className="floating-content">
                  <ExperienceTile isExpanded={false} />
                </div>
                <div className="floating-content">
                  <ProjectsTile />
                </div>
              </div>

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
