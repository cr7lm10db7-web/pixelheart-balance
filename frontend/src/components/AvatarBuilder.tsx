import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AvatarPreview } from './AvatarPreview';
import {
  HAIR_STYLES, HAIR_COLORS, SKIN_TONES,
  CLOTHES_STYLES, CLOTHES_COLORS, ACCESSORIES,
} from '../utils/avatarConfig';
import type { AvatarConfig, HairStyle, ClothesStyle, Accessory } from '../utils/avatarConfig';

interface AvatarBuilderProps {
  who: 'boy' | 'girl';
  label: string;
  accentColor: string;
}

export const AvatarBuilder: React.FC<AvatarBuilderProps> = ({ who, label, accentColor }) => {
  const { avatars, updateAvatar } = useStore();
  const [open, setOpen] = useState(false);
  const config = avatars[who];

  const set = (partial: Partial<AvatarConfig>) => updateAvatar(who, partial);

  return (
    <div className="flex flex-col items-center relative">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="text-[7px] px-3 py-2 pixel-border transition-all active:translate-y-[2px] tracking-wider mt-2"
        style={{
          backgroundColor: open ? accentColor : '#1a1a3e',
          borderColor: accentColor,
          color: open ? '#0d0d2b' : accentColor,
        }}
      >
        {open ? '▲ ÎNCHIDE' : '⚙ AVATAR'}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="mt-3 pixel-border shadow-pixel p-3 md:p-4 w-60 md:w-64 flex flex-col gap-2 md:gap-4 z-50 md:absolute md:top-full"
          style={{ backgroundColor: '#0d0d2b', borderColor: accentColor }}
        >
          {/* Live preview (Hidden on desktop builder to save space) */}
          <div className="flex md:hidden items-center justify-center py-2"
               style={{ backgroundColor: '#1a1a3e', border: `2px solid ${accentColor}` }}>
            <AvatarPreview config={config} size={60} />
          </div>

          <p className="text-[7px] text-center tracking-widest hidden md:block" style={{ color: accentColor }}>
            {label}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            <Section title="STIL">
              <div className="flex flex-wrap gap-1">
                {HAIR_STYLES.map((hs) => (
                  <OptionBtn
                    key={hs.value}
                    active={config.hairStyle === hs.value}
                    accent={accentColor}
                    onClick={() => set({ hairStyle: hs.value as HairStyle })}
                  >
                    {hs.label}
                  </OptionBtn>
                ))}
              </div>
            </Section>

            <Section title="C.PĂR">
              <div className="flex flex-wrap gap-1">
                {HAIR_COLORS.map((hc) => (
                  <ColorBtn
                    key={hc.value}
                    color={hc.value}
                    active={config.hairColor === hc.value}
                    accent={accentColor}
                    onClick={() => set({ hairColor: hc.value })}
                  />
                ))}
              </div>
            </Section>

            <Section title="TEN">
              <div className="flex flex-wrap gap-1">
                {SKIN_TONES.map((st) => (
                  <ColorBtn
                    key={st.value}
                    color={st.value}
                    active={config.skinTone === st.value}
                    accent={accentColor}
                    onClick={() => set({ skinTone: st.value })}
                  />
                ))}
              </div>
            </Section>

            <Section title="HAINE">
              <div className="flex flex-wrap gap-1">
                {CLOTHES_STYLES.map((cs) => (
                  <OptionBtn
                    key={cs.value}
                    active={config.clothesStyle === cs.value}
                    accent={accentColor}
                    onClick={() => set({ clothesStyle: cs.value as ClothesStyle })}
                  >
                    {cs.label}
                  </OptionBtn>
                ))}
              </div>
            </Section>

            <Section title="C.HNE">
              <div className="flex flex-wrap gap-1">
                {CLOTHES_COLORS.map((cc) => (
                  <ColorBtn
                    key={cc.value}
                    color={cc.value}
                    active={config.clothesColor === cc.value}
                    accent={accentColor}
                    onClick={() => set({ clothesColor: cc.value })}
                  />
                ))}
              </div>
            </Section>

            <Section title="ACC">
              <div className="flex flex-wrap gap-1">
                {ACCESSORIES.map((ac) => (
                  <OptionBtn
                    key={ac.value}
                    active={config.accessory === ac.value}
                    accent={accentColor}
                    onClick={() => set({ accessory: ac.value as Accessory })}
                  >
                    {ac.label}
                  </OptionBtn>
                ))}
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <p className="text-[6px] mb-1 tracking-widest" style={{ color: '#8888bb' }}>{title}</p>
    {children}
  </div>
);

const OptionBtn: React.FC<{
  active: boolean;
  accent: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, accent, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-2 py-1 text-[6px] pixel-border transition-all active:translate-y-[1px]"
    style={{
      backgroundColor: active ? accent : '#1a1a3e',
      borderColor: active ? accent : '#3a3a6e',
      color: active ? '#0d0d2b' : '#8888bb',
    }}
  >
    {children}
  </button>
);

const ColorBtn: React.FC<{
  color: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}> = ({ color, active, accent, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-6 h-6 pixel-border transition-all active:translate-y-[1px]"
    style={{
      backgroundColor: color,
      borderColor: active ? accent : '#3a3a6e',
      borderWidth: active ? '3px' : '2px',
      boxShadow: active ? `0 0 6px ${accent}` : 'none',
    }}
  />
);
