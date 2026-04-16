import React, { useMemo } from 'react';
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { useStore, computeScores } from '../store/useStore';
import { Bubble } from './Bubble';
import type { Moment } from '../store/useStore';

const PLATE_W = 128;

export const BalanceScale: React.FC = () => {
  const { moments } = useStore();

  const rotation = useMemo(() => {
    const { totalBalance } = computeScores(moments);
    const maxDiff = 10;
    // Clamp to ±15 degrees
    let deg = (-totalBalance / maxDiff) * 15;
    if (deg > 15) deg = 15;
    if (deg < -15) deg = -15;
    return deg;
  }, [moments]);

  const rotationValue = useMotionValue(rotation);
  const springRotation = useSpring(rotationValue, {
    stiffness: 80,
    damping: 12,
    mass: 1.2,
  });

  React.useEffect(() => {
    rotationValue.set(rotation);
  }, [rotation, rotationValue]);

  const goodMoments = moments.filter(m => m.type === 'good');
  const badMoments  = moments.filter(m => m.type === 'bad');

  return (
    <div className="flex flex-col items-center justify-center relative w-full">

      <div className="relative flex flex-col items-center" style={{ height: 360 }}>

        {/* Central Base Pillar */}
        <div className="absolute bottom-0 w-16 h-52 pixel-border shadow-pixel z-0 flex flex-col items-center"
             style={{ backgroundColor: '#2a2a5e', borderColor: '#3a3a6e' }}>
          <div className="w-12 h-4 mt-2" style={{ backgroundColor: '#3a3a6e' }} />
          <div className="w-12 h-4 mt-2 opacity-30" style={{ backgroundColor: '#1a1a3e' }} />
          {/* Decorative pixel pattern on pillar */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="w-4 h-1" style={{ backgroundColor: '#4a4a7e' }} />
            <div className="w-6 h-1" style={{ backgroundColor: '#4a4a7e' }} />
            <div className="w-4 h-1" style={{ backgroundColor: '#4a4a7e' }} />
          </div>
        </div>
        {/* Base plate */}
        <div className="absolute bottom-[-10px] w-32 h-6 pixel-border" style={{ backgroundColor: '#1a1a3e', borderColor: '#3a3a6e' }} />
        <div className="absolute bottom-[-12px] w-32 h-6 translate-x-1 translate-y-1 -z-10" style={{ backgroundColor: '#0a0a1e' }} />

        {/* Beam */}
        <motion.div
          style={{ rotate: springRotation, top: 60, position: 'absolute' }}
          className="w-80 md:w-[480px] h-6 pixel-border z-10"
        >
          <div className="absolute inset-0 pointer-events-none"
               style={{ backgroundColor: '#3a3a6e', borderBottom: '4px solid #2a2a5e' }} />
          <div className="relative w-full h-full flex justify-between z-20">
            <BalancePlate side="left"  rotation={springRotation} moments={goodMoments} />
            <BalancePlate side="right" rotation={springRotation} moments={badMoments}  />
          </div>
        </motion.div>

        {/* Center Pivot */}
        <div className="absolute w-10 h-10 pixel-border shadow-pixel z-20 flex items-center justify-center"
             style={{ top: 54, backgroundColor: '#fbf236', borderColor: '#c8a300' }}>
          <div className="w-3 h-3" style={{ backgroundColor: '#c8a300' }} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 px-4">
        <LegendItem color="#3a9e3a" label="POZITIV" />
        <LegendItem color="#b4202a" label="NEGATIV" />
        <LegendItem color="#4A90D9" label="EL" small />
        <LegendItem color="#e91e8c" label="EA" small />
        <LegendItem color="#9b59b6" label="AMBII" small />
      </div>
    </div>
  );
};

const LegendItem: React.FC<{ color: string; label: string; small?: boolean }> = ({ color, label, small }) => (
  <div className="flex items-center gap-2">
    <div className={`${small ? 'w-3 h-3' : 'w-4 h-4'} pixel-border`} style={{ backgroundColor: color, borderColor: '#3a3a6e' }} />
    <span className="text-[7px]" style={{ color: '#8888bb' }}>{label}</span>
  </div>
);

interface PlateProps {
  side: 'left' | 'right';
  rotation: any;
  moments: Moment[];
}

const BalancePlate: React.FC<PlateProps> = ({ side, rotation, moments }) => {
  const counterRotation = useTransform(rotation, (r: number) => -r);
  const isLeft = side === 'left';

  return (
    <div
      className={`absolute ${isLeft ? '-left-2' : '-right-2'} origin-top`}
      style={{ top: '6px' }}
    >
      <motion.div
        style={{ rotate: counterRotation }}
        className="relative flex flex-col items-center origin-top"
      >
        {/* Chain */}
        <div className="w-2 h-24"
             style={{
               backgroundColor: '#3a3a6e',
               backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 4px, #2a2a5e 4px, #2a2a5e 8px)',
             }} />

        {/* Plate surface + bubbles */}
        <div className="relative" style={{ width: PLATE_W }}>
          <AnimatePresence>
            {moments.map((m, idx) => (
              <Bubble key={m.id} moment={m} plateWidth={PLATE_W} index={idx} />
            ))}
          </AnimatePresence>

          {/* Plate bar */}
          <div
            className="pixel-border relative overflow-hidden"
            style={{
              height: 16,
              backgroundColor: isLeft ? '#1a3a1a' : '#3a1a1a',
              borderColor: '#3a3a6e',
            }}
          >
            {/* Tint */}
            <div className="absolute inset-0 opacity-30"
                 style={{ backgroundColor: isLeft ? '#3a9e3a' : '#b4202a' }} />
            {/* Label */}
            <span className="absolute inset-0 flex items-center justify-center text-[5px]"
                  style={{ color: isLeft ? '#6dcc6d' : '#d95763' }}>
              {isLeft ? '+ BINE' : '- RĂU'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
