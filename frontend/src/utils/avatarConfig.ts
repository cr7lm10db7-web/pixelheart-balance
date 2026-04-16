// Avatar configuration types and presets

export type HairStyle = 'short' | 'long' | 'ponytail' | 'curly';
export type ClothesStyle = 'shirt' | 'hoodie' | 'dress';
export type Accessory = 'none' | 'glasses' | 'hat' | 'beard';

export interface AvatarConfig {
  hairStyle: HairStyle;
  hairColor: string;
  skinTone: string;
  clothesStyle: ClothesStyle;
  clothesColor: string;
  accessory: Accessory;
}

export const HAIR_STYLES: { value: HairStyle; label: string }[] = [
  { value: 'short',    label: 'SCURT' },
  { value: 'long',     label: 'LUNG' },
  { value: 'ponytail', label: 'COQ' },
  { value: 'curly',    label: 'CREȚ' },
];

export const HAIR_COLORS = [
  { value: '#3B2005', label: 'Brun' },
  { value: '#D4437A', label: 'Roz' },
  { value: '#fbf236', label: 'Blond' },
  { value: '#222222', label: 'Negru' },
  { value: '#b4202a', label: 'Roșu' },
  { value: '#4A90D9', label: 'Albastru' },
];

export const SKIN_TONES = [
  { value: '#FFDFC4', label: '1' },
  { value: '#F3C6A1', label: '2' },
  { value: '#D4A574', label: '3' },
  { value: '#A0764A', label: '4' },
  { value: '#785030', label: '5' },
  { value: '#4A3020', label: '6' },
];

export const CLOTHES_STYLES: { value: ClothesStyle; label: string }[] = [
  { value: 'shirt',  label: 'TRICOU' },
  { value: 'hoodie', label: 'HANORAC' },
  { value: 'dress',  label: 'ROCHIE' },
];

export const CLOTHES_COLORS = [
  { value: '#4A90D9', label: 'Albastru' },
  { value: '#7B2FBE', label: 'Violet' },
  { value: '#3a9e3a', label: 'Verde' },
  { value: '#b4202a', label: 'Roșu' },
  { value: '#e91e8c', label: 'Roz' },
  { value: '#fbf236', label: 'Galben' },
  { value: '#222222', label: 'Negru' },
];

export const ACCESSORIES: { value: Accessory; label: string }[] = [
  { value: 'none',    label: 'NIMIC' },
  { value: 'glasses', label: 'OCHELARI' },
  { value: 'hat',     label: 'ȘAPCĂ' },
  { value: 'beard',   label: 'BARBĂ' },
];

export const DEFAULT_BOY_AVATAR: AvatarConfig = {
  hairStyle: 'short',
  hairColor: '#3B2005',
  skinTone: '#F3C6A1',
  clothesStyle: 'shirt',
  clothesColor: '#4A90D9',
  accessory: 'none',
};

export const DEFAULT_GIRL_AVATAR: AvatarConfig = {
  hairStyle: 'long',
  hairColor: '#D4437A',
  skinTone: '#F3C6A1',
  clothesStyle: 'dress',
  clothesColor: '#7B2FBE',
  accessory: 'none',
};
