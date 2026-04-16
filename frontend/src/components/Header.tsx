import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const { profiles, updateProfileName } = useStore();

  const [leftName, setLeftName] = useState(profiles.left.name);
  const [rightName, setRightName] = useState(profiles.right.name);

  useEffect(() => {
    setLeftName(profiles.left.name);
    setRightName(profiles.right.name);
  }, [profiles.left.name, profiles.right.name]);

  const handleLeft  = (v: string) => { setLeftName(v);  updateProfileName('left', v); };
  const handleRight = (v: string) => { setRightName(v); updateProfileName('right', v); };

  return (
    <header className="flex flex-col items-center justify-center pt-2 md:pt-8 pb-2 md:pb-4 w-full relative">
      <button
        onClick={useStore.getState().resetScale}
        className="absolute top-2 right-2 px-3 py-2 bg-[#2a1040] text-[#d95763] text-[8px] pixel-border border-[#d95763] shadow-pixel active:translate-y-[1px] hover:bg-[#3a1050]"
      >
        ↺ RESET
      </button>

      <h1 className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] text-[#8888bb] mb-3 md:mb-5 uppercase mt-6 md:mt-0">💖 PixelHeart Balance 💖</h1>
      <div className="flex flex-row items-center gap-2 md:gap-4 text-xs md:text-xl text-[#eeeeff] font-pixel pixel-border bg-[#1a1a3e] p-2 md:p-4 shadow-pixel border-[#3a3a6e] scale-90 md:scale-100">
        <input
          className="bg-transparent border-b-4 border-[#3a3a6e] focus:border-[#4A90D9] outline-none text-center w-28 md:w-40 transition-colors text-[#88ccff]"
          value={leftName}
          onChange={(e) => handleLeft(e.target.value)}
          title="Edit Name A"
        />
        <span className="text-[#d95763] animate-pulse mx-2 text-2xl">❤️</span>
        <input
          className="bg-transparent border-b-4 border-[#3a3a6e] focus:border-[#e91e8c] outline-none text-center w-28 md:w-40 transition-colors text-[#ffaacc]"
          value={rightName}
          onChange={(e) => handleRight(e.target.value)}
          title="Edit Name B"
        />
      </div>
    </header>
  );
};
