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
    <header className="flex flex-col items-center justify-center pt-8 pb-4 w-full">
      <h1 className="text-[10px] tracking-[0.3em] text-[#8888bb] mb-5 uppercase">💖 PixelHeart Balance 💖</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 text-lg md:text-xl text-[#eeeeff] font-pixel pixel-border bg-[#1a1a3e] p-4 shadow-pixel border-[#3a3a6e]">
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
