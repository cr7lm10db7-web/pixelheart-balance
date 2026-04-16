import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { MomentType } from '../store/useStore';

export const MomentsPanel: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-4 mt-8">
      <MomentsColumn type="good" title="GOOD" />
      <MomentsColumn type="bad" title="BAD" />
    </div>
  );
};

const MomentsColumn: React.FC<{ type: MomentType, title: string }> = ({ type, title }) => {
  const { moments, addMoment, removeMoment } = useStore();
  const [val, setVal] = useState('');

  const columnMoments = moments.filter(m => m.type === type);
  const isGood = type === 'good';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) return;
    addMoment({ type, title: val, weight: 1, person: 'together' });
    setVal('');
  };

  return (
    <div className={`p-6 bg-pixel-white pixel-border shadow-pixel max-h-[500px] flex flex-col ${isGood ? 'border-pixel-green' : 'border-pixel-red'}`}>
      <div className="flex justify-between items-center mb-6 border-b-4 border-pixel-dark pb-3">
        <h3 className={`text-xl font-bold ${isGood ? 'text-pixel-green text-shadow-pixel' : 'text-pixel-red text-shadow-pixel'}`}>
          {title}
        </h3>
        <span className="text-pixel-gray text-xs">PTS: {columnMoments.length}</span>
      </div>

      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input 
          type="text" 
          placeholder="New event..."
          className="flex-1 px-3 py-3 bg-[#f0f0f0] pixel-border focus:outline-none focus:bg-white transition-colors text-[10px] md:text-xs"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button 
          type="submit"
          className={`px-4 py-3 text-[10px] md:text-xs text-white pixel-border active:translate-y-1 active:shadow-none shadow-pixel-hover transition-all ${isGood ? 'bg-pixel-green hover:bg-[#a8e6cf]' : 'bg-pixel-red hover:bg-pixel-lightRed'}`}
        >
          ADD
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {columnMoments.map(m => (
          <div
            key={m.id}
            className={`group relative p-3 flex items-center justify-between pixel-border ${isGood ? 'bg-[#f0f8f0]' : 'bg-[#fff0f0]'}`}
          >
            <p className="text-[10px] md:text-xs leading-5 w-[85%] break-words text-pixel-dark">{m.title}</p>
            <button 
              onClick={() => removeMoment(m.id)}
              className="text-pixel-red hover:text-white hover:bg-pixel-red w-6 h-6 flex justify-center items-center pixel-border text-[10px] transition-colors"
            >
              x
            </button>
          </div>
        ))}
        
        {columnMoments.length === 0 && (
          <p className="text-center text-pixel-lightGray text-[10px] mt-10">NO DATA</p>
        )}
      </div>
    </div>
  );
};
