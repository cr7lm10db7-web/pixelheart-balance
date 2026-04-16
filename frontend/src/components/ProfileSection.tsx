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
    <div className="flex flex-col items-center">
      {/* Profiles row */}
      <div className="flex justify-center items-end gap-3 md:gap-16">

        {/* BOY side */}
        <div className="flex items-end gap-2">
          <div className="mb-2 opacity-90 hidden md:block">
            <AvatarPreview config={avatars.boy} size={56} />
          </div>
          <div className="flex flex-col items-center">
            <PixelAvatarBox
              profile={profiles.left}
              onUpload={(e) => handleImageUpload('left', e)}
              borderColor="#4A90D9"
            />
          </div>
        </div>

        {/* CENTER — VS badge (HIDDEN on mobile, it's in Arena) */}
        <div className="hidden md:flex flex-col items-center gap-1 pb-10">
          <div className="pixel-border px-3 py-2"
               style={{ backgroundColor: '#2a0a0a', borderColor: '#d95763' }}>
            <span className="text-[8px] font-pixel font-bold" style={{ color: '#d95763' }}>⚔ VS ⚔</span>
          </div>
        </div>

        {/* GIRL side */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col items-center">
            <PixelAvatarBox
              profile={profiles.right}
              onUpload={(e) => handleImageUpload('right', e)}
              borderColor="#e91e8c"
            />
          </div>
          <div className="mb-2 opacity-90 hidden md:block">
            <AvatarPreview config={avatars.girl} size={56} />
          </div>
        </div>
      </div>

      {/* Avatar customization panels */}
      <div className="flex justify-center gap-4 md:gap-16 mt-0 md:mt-2 w-full">
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
      <div className="w-10 h-10 md:w-24 md:h-24 pixel-border shadow-pixel flex items-center justify-center p-0 md:p-1 active:translate-y-1 transition-all"
           style={{ backgroundColor: '#1a1a3e', borderColor }}>
        {profile.imageUrl ? (
          <img
            src={profile.imageUrl} alt={profile.name}
            className="w-full h-full object-cover pixelate"
            style={{ border: `1px solid ${borderColor}` }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center"
               style={{ backgroundColor: '#2a2a5e', border: `1px solid ${borderColor}` }}>
            <span className="text-[4px] md:text-[7px] font-pixel text-center leading-[5px] md:leading-4" style={{ color: '#8888bb' }}>
              PIC
            </span>
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onUpload} />
      {/* Name hidden on small screens to prevent LiviuLiviu overlap */}
      <span className="mt-1 text-[8px] truncate max-w-[90px] hidden md:block" style={{ color: '#8888bb' }}>{profile.name}</span>
    </div>
  );
};
