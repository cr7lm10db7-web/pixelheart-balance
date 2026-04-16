import React, { useMemo } from 'react';
import { useStore, computeScores } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

type Level = {
  label: string;
  emoji: string;
  segmentColor: string;
  textColor: string;
  bgColor: string;
};

const LEVELS: Level[] = [
  { label: 'Mizerabil', emoji: '💀', segmentColor: '#b4202a', textColor: '#ff6b6b', bgColor: '#2a0a0a' },
  { label: 'Toxic',     emoji: '☠️', segmentColor: '#d95763', textColor: '#d95763', bgColor: '#2a1010' },
  { label: 'Mid',       emoji: '😐', segmentColor: '#fbf236', textColor: '#fbf236', bgColor: '#2a2500' },
  { label: 'Drăguț',   emoji: '🌸', segmentColor: '#a8e6cf', textColor: '#a8e6cf', bgColor: '#0a2e1c' },
  { label: 'Superb',   emoji: '💚', segmentColor: '#99e550', textColor: '#99e550', bgColor: '#0a2500' },
];

export const RelationshipBadge: React.FC = () => {
  const { moments } = useStore();

  const activeIdx = useMemo(() => {
    const { totalBalance } = computeScores(moments);
    if (totalBalance >= 5) return 4;
    if (totalBalance >= 2) return 3;
    if (totalBalance > -2) return 2;
    if (totalBalance >= -5) return 1;
    return 0;
  }, [moments]);

  const current = LEVELS[activeIdx];

  return (
    <div className="flex flex-col items-center justify-center my-6">
      <p className="text-[8px] mb-4 tracking-widest uppercase" style={{ color: '#8888bb' }}>
        Status Relație
      </p>

      {/* Segmented meter bar */}
      <div className="flex gap-1 p-2 pixel-border shadow-pixel mb-5"
           style={{ backgroundColor: '#0d0d2b', borderColor: '#3a3a6e' }}>
        {LEVELS.map((lvl, idx) => {
          const isActive = idx === activeIdx;
          const isPast = idx <= activeIdx;
          return (
            <div key={idx} className="relative flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  scaleY: isActive ? 1.35 : 1,
                  opacity: isPast ? 1 : 0.15,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="w-8 md:w-12 h-8 border-2 origin-bottom"
                style={{
                  backgroundColor: isPast ? lvl.segmentColor : '#1a1a3e',
                  borderColor: isActive ? '#ffffff' : '#3a3a6e',
                  boxShadow: isActive ? `0 0 8px ${lvl.segmentColor}` : 'none',
                }}
              />
              {isActive && (
                <motion.div
                  layoutId="indicator"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2"
                  style={{ backgroundColor: lvl.segmentColor }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Level label badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.label}
          initial={{ scale: 0.8, opacity: 0, y: 6 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -6 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="pixel-border shadow-pixel px-6 py-3 flex items-center gap-3"
          style={{
            backgroundColor: current.bgColor,
            borderColor: current.segmentColor,
            boxShadow: `0 0 12px ${current.segmentColor}40`,
          }}
        >
          <span className="text-lg">{current.emoji}</span>
          <span
            className="text-sm md:text-base font-bold tracking-widest uppercase"
            style={{ color: current.textColor }}
          >
            {current.label}
          </span>
          <span className="text-lg">{current.emoji}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
