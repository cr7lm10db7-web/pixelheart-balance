import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Moment, MomentPerson } from '../store/useStore';
import { useStore } from '../store/useStore';

const PERSON_COLOR: Record<MomentPerson, string> = {
  boy:      '#4A90D9',
  girl:     '#e91e8c',
  together: '#9b59b6',
};

const PERSON_BORDER: Record<MomentPerson, string> = {
  boy:      '#1B5FA8',
  girl:     '#a0135f',
  together: '#6c3483',
};

const PERSON_LABEL: Record<MomentPerson, string> = {
  boy:      'EL',
  girl:     'EA',
  together: 'AMBII',
};

interface BubbleProps {
  moment: Moment;
  plateWidth: number;
  index: number;
}

export const Bubble: React.FC<BubbleProps> = ({ moment, plateWidth, index }) => {
  const { removeMoment } = useStore();
  const [tooltip, setTooltip] = useState(false);

  const isGood     = moment.type === 'good';
  const bgColor    = isGood ? '#3a9e3a' : '#b4202a';
  const personBorder = PERSON_BORDER[moment.person];
  const size       = 18 + moment.weight * 4;

  // Use the persistent offsetX/Y for position. Plate is PLATE_W wide.
  // We want to keep bubbles between ~10% and 90% of width
  const x = (moment.offsetX * 0.4 + 0.5) * plateWidth;
  const row = index % 3; // Stack in small groups
  const yOffset = row * (size * 0.4);

  // Stagger float animation per bubble
  const floatDelay = (index * 0.4) % 2.5;

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: index * 0.05 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => setTooltip((prev) => !prev)}
        className="bubble-float"
        style={{
          position: 'absolute',
          left: x,
          transform: 'translateX(-50%)', // Center on the x coordinate
          bottom: 16 + yOffset,
          width: size,
          height: size,
          backgroundColor: bgColor,
          border: `3px solid ${personBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          imageRendering: 'pixelated',
          zIndex: 30 + index,
          borderRadius: 0,
          animationDelay: `${floatDelay}s`,
          background: `radial-gradient(circle at 35% 35%, ${isGood ? '#6dcc6d' : '#d95763'} 0%, ${bgColor} 60%)`,
          boxShadow: `0 2px 0 0 ${personBorder}`,
        }}
      >
        {/* Person color dot */}
        <div
          style={{
            width: 6,
            height: 6,
            backgroundColor: PERSON_COLOR[moment.person],
            outline: '1px solid #000',
            flexShrink: 0,
          }}
        />

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              className="absolute z-[100] pixel-border text-[7px] p-3 font-pixel whitespace-nowrap"
              style={{
                bottom: size + 10,
                left: '50%',
                transform: 'translateX(-50%)',
                minWidth: 120,
                backgroundColor: '#0d0d2b',
                color: '#eeeeff',
                borderColor: personBorder,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-1 text-[#eeeeff]">{moment.title}</p>
              <p className="mb-1" style={{ color: PERSON_COLOR[moment.person] }}>
                {PERSON_LABEL[moment.person]}
              </p>
              <p className={isGood ? 'text-[#99e550]' : 'text-[#d95763]'}>
                {isGood ? `+${moment.weight}` : `-${moment.weight}`}
              </p>
              <button
                className="mt-2 text-[6px] text-[#d95763] hover:text-white w-full text-center border-t border-[#3a3a6e] pt-1 transition-colors"
                onClick={() => { removeMoment(moment.id); setTooltip(false); }}
              >
                ✕ ȘTERGE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
