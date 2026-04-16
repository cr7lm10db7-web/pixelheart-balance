// Deployment Timestamp: 2026-04-16T17:24:20Z
import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileSection } from './components/ProfileSection';
import { CharacterArena } from './components/CharacterArena';
import { RelationshipBadge } from './components/RelationshipBadge';
import { AddEventForm } from './components/AddEventForm';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { resetScale, fetchState } = useStore();

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return (
    <div className="h-[100dvh] w-[100dvw] overflow-hidden relative font-pixel select-none flex flex-col"
         style={{
           background: 'linear-gradient(180deg, #1a1a3e 0%, #0d0d2b 50%, #1a0a2e 100%)',
         }}>

      {/* Subtle pixel grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(100,160,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,0.3) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Slight scanline effect */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
        }}
      />

      <main className="w-full h-full max-w-[1200px] mx-auto px-2 pb-2 md:pt-2 flex flex-col relative z-10 overflow-hidden">
        <div className="shrink-0">
          <Header />
        </div>

        <div className="flex-1 flex flex-col xl:flex-row items-center justify-start xl:justify-center gap-1 md:gap-4 xl:gap-12 min-h-0 w-full pb-0">
           
           {/* LEFT COLUMN: Profiles & Arena */}
           <div className="flex flex-col items-center justify-center xl:h-full xl:max-h-full xl:w-1/2 shrink-0 w-full mb-1">
              <div className="scale-[0.6] md:scale-95 origin-bottom transform-gpu" style={{ marginTop: '-40px', marginBottom: '-50px' }}>
                <ProfileSection />
              </div>
              <div className="scale-75 md:scale-100 origin-top transform-gpu" style={{ marginTop: '0px' }}>
                <CharacterArena />
              </div>
           </div>

           {/* RIGHT COLUMN: Badge & Form */}
           <div className="flex flex-col items-center justify-start gap-1 md:gap-4 xl:w-1/2 w-full max-w-md xl:h-full shrink-0 mt-0">
              <div className="transform-gpu w-full flex justify-center scale-90 md:scale-95 hidden md:flex">
                 <RelationshipBadge />
              </div>
              <div className="scale-95 md:scale-95 origin-center transform-gpu w-full">
                 <AddEventForm />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
