import React, { useRef } from 'react';
import type { Profile } from '../store/useStore';
import { useStore } from '../store/useStore';
import { AvatarPreview } from './AvatarPreview';
import { AvatarBuilder } from './AvatarBuilder';

// ─── PROFILE SECTION (cleaned — NO hearts, HP is in arena) ─────────────────
export const ProfileSection: React.FC = () => {
  const { profiles, avatars, updateProfileImage } = useStore();

  const handleImageUpload = (side: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateProfileImage(side, file);
  };

  return (
    <div className="flex flex-col items-center mb-2">
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
          </div>
        </div>

        {/* CENTER — VS badge */}
        <div className="flex flex-col items-center gap-1 pb-10">
          <div className="pixel-border px-3 py-2"
               style={{ backgroundColor: '#2a0a0a', borderColor: '#d95763' }}>
            <span className="text-[8px] font-bold" style={{ color: '#d95763' }}>⚔ VS ⚔</span>
          </div>
        </div>

        {/* GIRL side */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col items-center gap-2">
            <PixelAvatarBox
              profile={profiles.right}
              onUpload={(e) => handleImageUpload('right', e)}
              borderColor="#e91e8c"
            />
          </div>
          <div className="mb-2 opacity-90">
            <AvatarPreview config={avatars.girl} size={56} />
          </div>
        </div>
      </div>

      {/* Avatar customization panels */}
      <div className="flex justify-center gap-8 md:gap-16 mt-2 w-full scale-90">
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
