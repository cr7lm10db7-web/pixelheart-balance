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
    <header className="flex flex-col items-center justify-center pt-1 md:pt-8 pb-1 md:pb-4 w-full relative">
      <button
        onClick={useStore.getState().resetScale}
        className="absolute top-1 right-1 px-2 py-1 md:px-3 md:py-2 bg-[#2a1040] text-[#d95763] text-[5px] md:text-[8px] pixel-border border-[#d95763] shadow-pixel active:translate-y-[1px] hover:bg-[#3a1050]"
      >
        ↺ RESET
      </button>

      <h1 className="hidden md:block text-[5px] md:text-[10px] tracking-widest text-[#8888bb] mb-1 md:mb-5 uppercase mt-1 md:mt-0">💖 PixelHeart Balance 💖</h1>
      <div className="flex flex-row items-center gap-1 md:gap-4 text-[9px] md:text-xl text-[#eeeeff] font-pixel pixel-border bg-[#1a1a3e] px-1 md:px-4 py-1 md:py-4 shadow-pixel border-[#3a3a6e] w-full max-w-[240px] md:max-w-none md:w-auto">
        <input
          className="bg-transparent border-b md:border-b-4 border-[#3a3a6e] focus:border-[#4A90D9] outline-none text-center w-[70px] md:w-40 transition-colors text-[#88ccff] truncate"
          value={leftName}
          onChange={(e) => handleLeft(e.target.value)}
        />
        <span className="text-[#d95763] animate-pulse mx-1 md:mx-2 text-[10px] md:text-2xl">❤️</span>
        <input
          className="bg-transparent border-b md:border-b-4 border-[#3a3a6e] focus:border-[#e91e8c] outline-none text-center w-[70px] md:w-40 transition-colors text-[#ffaacc] truncate"
          value={rightName}
          onChange={(e) => handleRight(e.target.value)}
        />
      </div>
    </header>
  );
};
