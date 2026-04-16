import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileSection } from './components/ProfileSection';
import { BalanceScale } from './components/BalanceScale';
import { RelationshipBadge } from './components/RelationshipBadge';
import { AddEventForm } from './components/AddEventForm';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { resetScale, fetchState } = useStore();

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return (
    <div className="min-h-screen relative overflow-x-hidden font-pixel select-none"
         style={{
           background: 'linear-gradient(180deg, #1a1a3e 0%, #0d0d2b 50%, #1a0a2e 100%)',
         }}>

      {/* Subtle pixel grid overlay */}
      <div
        className="fixed inset-0 z-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(100,160,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,0.3) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Slight scanline effect */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
        }}
      />

      <main className="max-w-5xl mx-auto px-4 pt-4 pb-24 relative z-10">
        <Header />

        <ProfileSection />

        {/* Clear separator before balance */}
        <div className="my-4" />

        <BalanceScale />

        <div className="my-6" />

        <RelationshipBadge />

        <AddEventForm />

        {/* Reset Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={resetScale}
            className="px-8 py-4 bg-[#2a1040] text-[#d95763] text-[10px] pixel-border border-[#d95763] shadow-pixel active:translate-y-1 active:shadow-none transition-all hover:bg-[#3a1050] tracking-widest"
          >
            ↺ RESET GAME
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
