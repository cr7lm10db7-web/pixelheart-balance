import React, { useMemo, useRef } from 'react';
import type { Profile } from '../store/useStore';
import { useStore, computeScores } from '../store/useStore';
import { AvatarPreview } from './AvatarPreview';
import { AvatarBuilder } from './AvatarBuilder';

// ─── PIXEL HEART SVG ────────────────────────────────────────────────────────
const PixelHeart: React.FC<{ filled: boolean; broken?: boolean }> = ({ filled, broken }) => {
  const baseColor  = broken ? '#666' : (filled ? '#d95763' : '#2a2a5e');
  const lightColor = broken ? '#888' : (filled ? '#ff6b6b' : '#1a1a3e');
  const darkColor  = broken ? '#444' : (filled ? '#b4202a' : '#1a1a3e');
  return (
    <svg viewBox="0 0 10 9" width="18" height="16"
         style={{ imageRendering: 'pixelated' }} xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="0" width="3" height="1" fill={baseColor} />
      <rect x="6" y="0" width="3" height="1" fill={baseColor} />
      <rect x="0" y="1" width="4" height="2" fill={lightColor} />
      <rect x="5" y="1" width="4" height="2" fill={lightColor} />
      <rect x="4" y="1" width="2" height="3" fill={lightColor} />
      <rect x="0" y="3" width="10" height="2" fill={lightColor} />
      <rect x="1" y="5" width="8" height="2" fill={baseColor} />
      <rect x="2" y="7" width="6" height="1" fill={darkColor} />
      <rect x="3" y="8" width="4" height="1" fill={baseColor} />
      {filled && !broken && <rect x="2" y="2" width="1" height="1" fill="#ffaaaa" />}
      {broken && (
        <>
          <rect x="4" y="1" width="1" height="1" fill="#222" />
          <rect x="5" y="3" width="1" height="1" fill="#222" />
          <rect x="4" y="5" width="1" height="1" fill="#222" />
          <rect x="5" y="7" width="1" height="1" fill="#222" />
        </>
      )}
    </svg>
  );
};

function scoreToHeartDisplay(score: number): { filled: number; broken: number; empty: number } {
  if (score >= 5) return { filled: 5, broken: 0, empty: 0 };
  if (score >= 3) return { filled: 4, broken: 0, empty: 1 };
  if (score >= 1) return { filled: 3, broken: 0, empty: 2 };
  if (score >= 0) return { filled: 2, broken: 0, empty: 3 };
  if (score >= -2) return { filled: 1, broken: 1, empty: 3 };
  if (score >= -4) return { filled: 0, broken: 2, empty: 3 };
  return { filled: 0, broken: 3, empty: 2 };
}

// ─── PROFILE SECTION ────────────────────────────────────────────────────────
export const ProfileSection: React.FC = () => {
  const { profiles, avatars, moments, updateProfileImage } = useStore();

  const { boyScore, girlScore } = useMemo(() => computeScores(moments), [moments]);
  const boyHearts  = scoreToHeartDisplay(boyScore);
  const girlHearts = scoreToHeartDisplay(girlScore);

  const handleImageUpload = (side: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateProfileImage(side, file);
  };

  return (
    <div className="flex flex-col items-center my-6">
      {/* Profiles row */}
      <div className="flex justify-center items-end gap-6 md:gap-16">

        {/* BOY side */}
        <div className="flex items-end gap-2">
          <div className="mb-2 opacity-90">
            <AvatarPreview config={avatars.boy} size={56} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <PixelAvatarBox
              profile={profiles.left}
              onUpload={(e) => handleImageUpload('left', e)}
              borderColor="#4A90D9"
            />
            <div className="pixel-border text-[7px] px-2 py-1 text-center"
                 style={{ backgroundColor: '#1a2a4e', borderColor: '#4A90D9', color: '#88ccff' }}>
              EL: {boyScore > 0 ? '+' : ''}{boyScore}
            </div>
            <div className="flex gap-[2px] mt-1">
              {Array.from({ length: boyHearts.filled }).map((_, i) => <PixelHeart key={`f${i}`} filled />)}
              {Array.from({ length: boyHearts.broken }).map((_, i) => <PixelHeart key={`b${i}`} filled={false} broken />)}
              {Array.from({ length: boyHearts.empty }).map((_, i) => <PixelHeart key={`e${i}`} filled={false} />)}
            </div>
          </div>
        </div>

        {/* CENTER divider */}
        <div className="flex flex-col items-center gap-[3px] pb-14 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2 h-2" style={{ backgroundColor: '#d95763' }} />
          ))}
        </div>

        {/* GIRL side */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col items-center gap-2">
            <PixelAvatarBox
              profile={profiles.right}
              onUpload={(e) => handleImageUpload('right', e)}
              borderColor="#e91e8c"
            />
            <div className="pixel-border text-[7px] px-2 py-1 text-center"
                 style={{ backgroundColor: '#2a1030', borderColor: '#e91e8c', color: '#ffaacc' }}>
              EA: {girlScore > 0 ? '+' : ''}{girlScore}
            </div>
            <div className="flex gap-[2px] mt-1">
              {Array.from({ length: girlHearts.filled }).map((_, i) => <PixelHeart key={`f${i}`} filled />)}
              {Array.from({ length: girlHearts.broken }).map((_, i) => <PixelHeart key={`b${i}`} filled={false} broken />)}
              {Array.from({ length: girlHearts.empty }).map((_, i) => <PixelHeart key={`e${i}`} filled={false} />)}
            </div>
          </div>
          <div className="mb-2 opacity-90">
            <AvatarPreview config={avatars.girl} size={56} />
          </div>
        </div>
      </div>

      {/* Avatar customization panels — below profiles */}
      <div className="flex justify-center gap-8 md:gap-16 mt-4 w-full">
        <AvatarBuilder who="boy" label="AVATAR EL" accentColor="#4A90D9" />
        <AvatarBuilder who="girl" label="AVATAR EA" accentColor="#e91e8c" />
      </div>
    </div>
  );
};

// ─── AVATAR BOX ─────────────────────────────────────────────────────────────
interface PixelAvatarBoxProps {
  profile: Profile;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  borderColor: string;
}

const PixelAvatarBox: React.FC<PixelAvatarBoxProps> = ({ profile, onUpload, borderColor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="flex flex-col items-center group relative cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="w-20 h-20 md:w-24 md:h-24 pixel-border shadow-pixel flex items-center justify-center p-1 active:translate-y-1 transition-all"
           style={{ backgroundColor: '#1a1a3e', borderColor }}>
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl} alt={profile.name}
            className="w-full h-full object-cover pixelate"
            style={{ border: `2px solid ${borderColor}` }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center"
               style={{ backgroundColor: '#2a2a5e', border: `2px solid ${borderColor}` }}>
            <span className="text-[7px] font-pixel text-center leading-4" style={{ color: '#8888bb' }}>
              UPLOAD<br />PIC
            </span>
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onUpload} />
      <div className="absolute top-0 w-20 h-20 md:w-24 md:h-24 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
           style={{ backgroundColor: 'rgba(13,13,43,0.85)', border: `4px solid ${borderColor}` }}>
        <span className="text-[7px] text-center" style={{ color: '#eeeeff' }}>CHANGE<br />IMG</span>
      </div>
      <span className="mt-2 text-[8px] truncate max-w-[90px]" style={{ color: '#8888bb' }}>{profile.name}</span>
    </div>
  );
};
