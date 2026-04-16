import React from 'react';
import type { AvatarConfig } from '../utils/avatarConfig';

// Darken a hex color by a factor (0-1)
function darken(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r * (1 - factor))},${Math.round(g * (1 - factor))},${Math.round(b * (1 - factor))})`;
}

interface AvatarPreviewProps {
  config: AvatarConfig;
  size?: number;
}

export const AvatarPreview: React.FC<AvatarPreviewProps> = ({ config, size = 64 }) => {
  const s = config.skinTone;
  const h = config.hairColor;
  const hd = darken(h, 0.25);
  const c = config.clothesColor;
  const cd = darken(c, 0.3);

  const height = Math.round(size * 1.25);

  return (
    <svg
      viewBox="0 0 16 20"
      width={size}
      height={height}
      style={{ imageRendering: 'pixelated' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── HAIR (behind head for long/ponytail) ── */}
      {config.hairStyle === 'long' && (
        <>
          <rect x="3" y="1" width="10" height="3" fill={h} />
          <rect x="3" y="3" width="1" height="6" fill={h} />
          <rect x="12" y="3" width="1" height="6" fill={h} />
          <rect x="3" y="9" width="1" height="3" fill={hd} />
          <rect x="12" y="9" width="1" height="3" fill={hd} />
        </>
      )}
      {config.hairStyle === 'ponytail' && (
        <>
          <rect x="3" y="1" width="10" height="3" fill={h} />
          <rect x="3" y="3" width="1" height="5" fill={h} />
          <rect x="12" y="3" width="1" height="5" fill={h} />
          {/* ponytail extension */}
          <rect x="12" y="2" width="2" height="2" fill={h} />
          <rect x="13" y="4" width="2" height="4" fill={hd} />
          <rect x="14" y="8" width="1" height="2" fill={hd} />
        </>
      )}

      {/* ── HAIR TOP ── */}
      <rect x="5" y="0" width="6" height="1" fill={h} />
      <rect x="4" y="1" width="8" height="1" fill={h} />
      {config.hairStyle === 'short' && (
        <rect x="4" y="2" width="8" height="1" fill={h} />
      )}
      {config.hairStyle === 'curly' && (
        <>
          <rect x="3" y="0" width="1" height="2" fill={h} />
          <rect x="12" y="0" width="1" height="2" fill={h} />
          <rect x="4" y="2" width="8" height="1" fill={h} />
          <rect x="3" y="2" width="1" height="4" fill={h} />
          <rect x="12" y="2" width="1" height="4" fill={h} />
          {/* curly bumps */}
          <rect x="2" y="1" width="1" height="2" fill={hd} />
          <rect x="13" y="1" width="1" height="2" fill={hd} />
          <rect x="2" y="4" width="1" height="2" fill={hd} />
          <rect x="13" y="4" width="1" height="2" fill={hd} />
        </>
      )}

      {/* ── HEAD ── */}
      <rect x="4" y="3" width="8" height="5" fill={s} />
      {/* outline */}
      <rect x="3" y="3" width="1" height="5" fill={darken(s, 0.35)} />
      <rect x="12" y="3" width="1" height="5" fill={darken(s, 0.35)} />
      <rect x="4" y="8" width="8" height="1" fill={darken(s, 0.4)} />

      {/* ── EYES ── */}
      <rect x="5" y="5" width="2" height="1" fill="#222" />
      <rect x="9" y="5" width="2" height="1" fill="#222" />

      {/* ── MOUTH ── */}
      <rect x="6" y="7" width="4" height="1" fill={darken(s, 0.2)} />

      {/* ── NECK ── */}
      <rect x="7" y="9" width="2" height="1" fill={s} />

      {/* ── CLOTHES ── */}
      {config.clothesStyle === 'shirt' && (
        <>
          <rect x="4" y="10" width="8" height="5" fill={c} />
          <rect x="3" y="10" width="1" height="5" fill={cd} />
          <rect x="12" y="10" width="1" height="5" fill={cd} />
          <rect x="7" y="10" width="2" height="2" fill={s} />
        </>
      )}
      {config.clothesStyle === 'hoodie' && (
        <>
          <rect x="4" y="10" width="8" height="5" fill={c} />
          <rect x="3" y="10" width="1" height="5" fill={cd} />
          <rect x="12" y="10" width="1" height="5" fill={cd} />
          {/* hood collar */}
          <rect x="5" y="10" width="6" height="2" fill={cd} />
          <rect x="7" y="10" width="2" height="1" fill={s} />
          {/* pocket */}
          <rect x="6" y="13" width="4" height="1" fill={cd} />
        </>
      )}
      {config.clothesStyle === 'dress' && (
        <>
          <rect x="5" y="10" width="6" height="4" fill={c} />
          <rect x="4" y="10" width="1" height="4" fill={cd} />
          <rect x="11" y="10" width="1" height="4" fill={cd} />
          <rect x="7" y="10" width="2" height="1" fill={s} />
          {/* flare */}
          <rect x="4" y="14" width="8" height="1" fill={c} />
          <rect x="3" y="15" width="10" height="1" fill={c} />
          <rect x="3" y="16" width="10" height="1" fill={cd} />
        </>
      )}

      {/* ── ARMS ── */}
      <rect x="2" y="10" width="1" height="4" fill={s} />
      <rect x="13" y="10" width="1" height="4" fill={s} />

      {/* ── LEGS ── */}
      {config.clothesStyle === 'dress' ? (
        <>
          <rect x="6" y="17" width="2" height="1" fill={s} />
          <rect x="8" y="17" width="2" height="1" fill={s} />
          <rect x="5" y="18" width="3" height="2" fill="#222" />
          <rect x="8" y="18" width="3" height="2" fill="#222" />
        </>
      ) : (
        <>
          <rect x="4" y="15" width="3" height="3" fill={darken(c, 0.45)} />
          <rect x="9" y="15" width="3" height="3" fill={darken(c, 0.45)} />
          <rect x="7" y="15" width="2" height="2" fill={darken(c, 0.45)} />
          <rect x="3" y="18" width="4" height="2" fill="#222" />
          <rect x="9" y="18" width="4" height="2" fill="#222" />
        </>
      )}

      {/* ── ACCESSORIES ── */}
      {config.accessory === 'glasses' && (
        <>
          <rect x="4" y="5" width="4" height="1" fill="#444" />
          <rect x="8" y="5" width="4" height="1" fill="#444" />
          <rect x="4" y="4" width="4" height="1" fill="#666" />
          <rect x="8" y="4" width="4" height="1" fill="#666" />
          <rect x="4" y="6" width="4" height="1" fill="#666" />
          <rect x="8" y="6" width="4" height="1" fill="#666" />
          {/* bridge */}
          <rect x="7" y="5" width="2" height="1" fill="#888" />
          {/* lenses (semi-transparent via lighter color) */}
          <rect x="5" y="5" width="2" height="1" fill="#aaddff" opacity="0.5" />
          <rect x="9" y="5" width="2" height="1" fill="#aaddff" opacity="0.5" />
        </>
      )}
      {config.accessory === 'hat' && (
        <>
          <rect x="3" y="-1" width="10" height="2" fill={c} />
          <rect x="2" y="1" width="12" height="1" fill={cd} />
          {/* brim */}
          <rect x="1" y="1" width="14" height="1" fill={cd} />
        </>
      )}
      {config.accessory === 'beard' && (
        <>
          <rect x="4" y="7" width="8" height="2" fill={hd} />
          <rect x="5" y="9" width="6" height="1" fill={hd} />
          <rect x="6" y="10" width="4" height="1" fill={h} />
        </>
      )}
    </svg>
  );
};
