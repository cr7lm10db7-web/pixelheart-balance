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
    <div className="h-screen w-screen overflow-hidden relative font-pixel select-none flex flex-col"
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

      <main className="w-full h-full max-w-[1200px] mx-auto px-2 py-2 flex flex-col relative z-10">
        <div className="shrink-0">
          <Header />
        </div>

        <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-12 min-h-0 w-full">
           
           {/* LEFT COLUMN: Profiles & Arena */}
           <div className="flex flex-col items-center justify-center h-full max-h-full xl:w-1/2 shrink-0">
              <div className="scale-95 origin-bottom transform-gpu" style={{ marginTop: '-10px' }}>
                <ProfileSection />
              </div>
              <div className="scale-100 origin-top transform-gpu" style={{ marginTop: '-10px' }}>
                <CharacterArena />
              </div>
           </div>

           {/* RIGHT COLUMN: Badge & Form */}
           <div className="flex flex-col items-center justify-center gap-4 xl:w-1/2 w-full max-w-md h-full shrink-0">
              <div className="transform-gpu w-full flex justify-center scale-95" style={{ marginBottom: '-10px' }}>
                 <RelationshipBadge />
              </div>
              <div className="scale-95 origin-center transform-gpu w-full">
                 <AddEventForm />
              </div>
              
              <div className="mt-2 shrink-0 w-full px-4">
                <button
                  onClick={resetScale}
                  className="w-full px-6 py-4 bg-[#2a1040] text-[#d95763] text-[10px] pixel-border border-[#d95763] shadow-pixel active:translate-y-1 active:shadow-none transition-all hover:bg-[#3a1050] tracking-widest"
                >
                  ↺ RESET GAME
                </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
