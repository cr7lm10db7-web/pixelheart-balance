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

      <main className="w-full h-[100dvh] max-w-[1200px] mx-auto px-1 pb-1 flex flex-col relative z-10 overflow-hidden">
        <div className="shrink-0 flex-none z-20">
          <Header />
        </div>

        <div className="flex-1 flex flex-col xl:flex-row items-center justify-start xl:justify-center gap-0 md:gap-4 xl:gap-12 min-h-0 w-full pb-0 relative z-10 overflow-hidden">
           
           {/* LEFT COLUMN: Profiles & Arena */}
           <div className="flex flex-col items-center justify-start xl:justify-center xl:h-full xl:max-h-full xl:w-1/2 shrink-0 w-full mb-0">
              <div className="w-full flex justify-center mb-0 md:mb-4 shrink-0 transition-transform origin-top">
                <ProfileSection />
              </div>
              <div className="w-full flex justify-center shrink-0 origin-top">
                <CharacterArena />
              </div>
           </div>

           {/* RIGHT COLUMN: Badge & Form */}
           <div className="flex flex-col items-center justify-start gap-0 md:gap-4 xl:w-1/2 w-full max-w-md xl:h-full flex-1">
              <div className="w-full flex justify-center hidden md:flex shrink-0">
                 <RelationshipBadge />
              </div>
              <div className="w-full shrink-0 flex-1 flex flex-col justify-end md:justify-center pb-2">
                 <AddEventForm />
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
