import { create } from 'zustand';
import type { AvatarConfig } from '../utils/avatarConfig';
import { DEFAULT_BOY_AVATAR, DEFAULT_GIRL_AVATAR } from '../utils/avatarConfig';

export type MomentType = 'good' | 'bad';
export type MomentPerson = 'girl' | 'boy' | 'together';

export interface Moment {
  id: string;
  type: MomentType;
  person: MomentPerson;
  title: string;
  weight: number;
  date: string;
  offsetX: number;
  offsetY: number;
}

export interface Profile {
  name: string;
  imageUrl: string | null;
}

// Animation event that the arena listens to
export interface BattleEvent {
  id: string;
  type: 'attack' | 'heal' | 'self-damage';
  attacker: 'boy' | 'girl' | 'both';
  target: 'boy' | 'girl' | 'both';
  amount: number;
  title: string;
}

interface GameState {
  profiles: {
    left: Profile;
    right: Profile;
  };
  avatars: {
    boy: AvatarConfig;
    girl: AvatarConfig;
  };
  moments: Moment[];
  // HP system
  boyHP: number;
  girlHP: number;
  maxHP: number;
  // Animation queue
  lastBattleEvent: BattleEvent | null;

  fetchState: () => Promise<void>;
  updateProfileName: (side: 'left' | 'right', name: string) => Promise<void>;
  updateProfileImage: (side: 'left' | 'right', file: File) => Promise<void>;
  updateAvatar: (who: 'boy' | 'girl', config: Partial<AvatarConfig>) => void;
  addMoment: (moment: Omit<Moment, 'id' | 'date' | 'offsetX' | 'offsetY'>) => Promise<void>;
  removeMoment: (id: string) => Promise<void>;
  resetScale: () => Promise<void>;
  clearBattleEvent: () => void;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const MAX_HP = 10;

function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return ((h >>> 0) / 0xFFFFFFFF);
}

// Compute HP from moments history
function computeHP(moments: Moment[]): { boyHP: number; girlHP: number } {
  let boyHP = MAX_HP;
  let girlHP = MAX_HP;

  moments.forEach((m) => {
    if (m.type === 'good') {
      // Heal: person heals themselves
      if (m.person === 'boy' || m.person === 'together') boyHP += m.weight;
      if (m.person === 'girl' || m.person === 'together') girlHP += m.weight;
    } else {
      // Attack: person attacks the OTHER
      if (m.person === 'boy') girlHP -= m.weight; // Boy attacks Girl
      if (m.person === 'girl') boyHP -= m.weight;  // Girl attacks Boy
      if (m.person === 'together') { boyHP -= m.weight; girlHP -= m.weight; }
    }
  });

  return {
    boyHP: Math.max(0, Math.min(MAX_HP, boyHP)),
    girlHP: Math.max(0, Math.min(MAX_HP, girlHP)),
  };
}

export const useStore = create<GameState>((set) => ({
  profiles: {
    left: { name: 'Alex', imageUrl: null },
    right: { name: 'Maria', imageUrl: null },
  },
  avatars: {
    boy: { ...DEFAULT_BOY_AVATAR },
    girl: { ...DEFAULT_GIRL_AVATAR },
  },
  moments: [],
  boyHP: MAX_HP,
  girlHP: MAX_HP,
  maxHP: MAX_HP,
  lastBattleEvent: null,

  fetchState: async () => {
    try {
      const res = await fetch(`${API_URL}/state`);
      if (res.ok) {
        const data = await res.json();
        const moments = (data.moments || []).map((m: Moment) => ({
          ...m,
          person: m.person ?? 'together',
          offsetX: m.offsetX ?? seededRandom(m.id + 'x') * 2 - 1,
          offsetY: m.offsetY ?? seededRandom(m.id + 'y'),
        }));
        const hp = computeHP(moments);
        set({ profiles: data.profiles, moments, ...hp });
      }
    } catch {
      console.warn('Backend unavailable, using local fallback state.');
    }
  },

  updateProfileName: async (side, name) => {
    set((state) => ({
      profiles: { ...state.profiles, [side]: { ...state.profiles[side], name } },
    }));
    try {
      await fetch(`${API_URL}/profiles/${side}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
    } catch {}
  },

  updateProfileImage: async (side, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_URL}/upload/${side}`, { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        set((state) => ({
          profiles: { ...state.profiles, [side]: { ...state.profiles[side], imageUrl: data.imageUrl } },
        }));
        return;
      }
    } catch {}
    const localUrl = URL.createObjectURL(file);
    set((state) => ({
      profiles: { ...state.profiles, [side]: { ...state.profiles[side], imageUrl: localUrl } },
    }));
  },

  updateAvatar: (who, config) => {
    set((state) => ({
      avatars: {
        ...state.avatars,
        [who]: { ...state.avatars[who], ...config },
      },
    }));
  },

  addMoment: async (moment) => {
    const id = Math.random().toString(36).substr(2, 9);
    const offsetX = seededRandom(id + 'x') * 2 - 1;
    const offsetY = seededRandom(id + 'y');
    const full: Moment = { ...moment, id, date: new Date().toISOString(), offsetX, offsetY };

    // Build battle event
    let battleEvent: BattleEvent;
    if (moment.type === 'good') {
      battleEvent = {
        id,
        type: 'heal',
        attacker: moment.person === 'together' ? 'both' : moment.person,
        target: moment.person === 'together' ? 'both' : moment.person,
        amount: moment.weight,
        title: moment.title,
      };
    } else {
      if (moment.person === 'together') {
        battleEvent = {
          id,
          type: 'self-damage',
          attacker: 'both',
          target: 'both',
          amount: moment.weight,
          title: moment.title,
        };
      } else {
        battleEvent = {
          id,
          type: 'attack',
          attacker: moment.person,
          target: moment.person === 'boy' ? 'girl' : 'boy',
          amount: moment.weight,
          title: moment.title,
        };
      }
    }

    try {
      const res = await fetch(`${API_URL}/moments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(full),
      });
      if (res.ok) {
        const newMoment = await res.json();
        const newMoments = [...useStore.getState().moments, { ...full, ...newMoment }];
        const hp = computeHP(newMoments);
        set({ moments: newMoments, ...hp, lastBattleEvent: battleEvent });
        return;
      }
    } catch {}
    const newMoments = [...useStore.getState().moments, full];
    const hp = computeHP(newMoments);
    set({ moments: newMoments, ...hp, lastBattleEvent: battleEvent });
  },

  removeMoment: async (id) => {
    try { await fetch(`${API_URL}/moments/${id}`, { method: 'DELETE' }); } catch {}
    set((state) => {
      const moments = state.moments.filter((m) => m.id !== id);
      const hp = computeHP(moments);
      return { moments, ...hp };
    });
  },

  resetScale: async () => {
    try { await fetch(`${API_URL}/reset`, { method: 'POST' }); } catch {}
    set({ moments: [], boyHP: MAX_HP, girlHP: MAX_HP, lastBattleEvent: null });
  },

  clearBattleEvent: () => set({ lastBattleEvent: null }),
}));

// Keep legacy export for components that still use it
export function computeScores(moments: Moment[]) {
  let boyScore = 0;
  let girlScore = 0;
  moments.forEach((m) => {
    const val = m.type === 'good' ? m.weight : -m.weight;
    if (m.person === 'boy' || m.person === 'together') boyScore += val;
    if (m.person === 'girl' || m.person === 'together') girlScore += val;
  });
  return { boyScore, girlScore, totalBalance: boyScore + girlScore };
}
