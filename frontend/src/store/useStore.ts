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
  diceResult?: number;
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
  // Win system
  boyWins: number;
  girlWins: number;
  winStreak: { who: 'boy' | 'girl' | null; count: number };
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
      // Attack: person who did the negative event gets attacked
      if (m.person === 'boy') boyHP -= m.weight;  // He did bad -> She attacks him
      if (m.person === 'girl') girlHP -= m.weight; // She did bad -> He attacks her
      if (m.person === 'together') { boyHP -= m.weight; girlHP -= m.weight; }
    }
  });

  return {
    boyHP: Math.max(0, Math.min(MAX_HP, parseFloat(boyHP.toFixed(1)))),
    girlHP: Math.max(0, Math.min(MAX_HP, parseFloat(girlHP.toFixed(1)))),
  };
}

export const useStore = create<GameState>((set, get) => ({
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
  boyWins: 0,
  girlWins: 0,
  winStreak: { who: null, count: 0 },
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
        set({
          profiles: data.profiles,
          moments,
          boyWins: data.wins?.boy || 0,
          girlWins: data.wins?.girl || 0,
          ...hp
        });
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

    let diceResult: number | undefined;
    let finalWeight = moment.weight;

    if (moment.type === 'bad') {
      diceResult = Math.floor(Math.random() * 6) + 1;
      // 1->0.5, 2->1.0, 3->1.5, 4->2.0, 5->2.5, 6->3.0
      finalWeight = diceResult * 0.5;
    }

    const full: Moment = { ...moment, weight: finalWeight, id, date: new Date().toISOString(), offsetX, offsetY };

    // Build battle event
    let battleEvent: BattleEvent;
    if (moment.type === 'good') {
      battleEvent = {
        id,
        type: 'heal',
        attacker: moment.person === 'together' ? 'both' : moment.person,
        target: moment.person === 'together' ? 'both' : moment.person,
        amount: finalWeight,
        title: moment.title,
      };
    } else {
      if (moment.person === 'together') {
        battleEvent = {
          id,
          type: 'self-damage',
          attacker: 'both',
          target: 'both',
          amount: finalWeight,
          title: moment.title,
          diceResult,
        };
      } else {
        battleEvent = {
          id,
          type: 'attack',
          attacker: moment.person === 'boy' ? 'girl' : 'boy', // If he did bad, she attacks
          target: moment.person,                              // Target is the one who did bad
          amount: finalWeight,
          title: moment.title,
          diceResult,
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
        const currentMoments = get().moments;
        const newMoments = [...currentMoments, { ...full, ...newMoment }];
        const hp = computeHP(newMoments);

        // Win detection
        let winUpdate = {};
        if (hp.boyHP <= 0 && get().boyHP > 0) {
          // girl wins
          fetch(`${API_URL}/wins/girl`, { method: 'POST' });
          const newStreak = get().winStreak.who === 'girl' ? get().winStreak.count + 1 : 1;
          winUpdate = { girlWins: get().girlWins + 1, winStreak: { who: 'girl', count: newStreak } };
        } else if (hp.girlHP <= 0 && get().girlHP > 0) {
          // boy wins
          fetch(`${API_URL}/wins/boy`, { method: 'POST' });
          const newStreak = get().winStreak.who === 'boy' ? get().winStreak.count + 1 : 1;
          winUpdate = { boyWins: get().boyWins + 1, winStreak: { who: 'boy', count: newStreak } };
        }

        set({ moments: newMoments, ...hp, ...winUpdate, lastBattleEvent: battleEvent });
        return;
      }
    } catch {}

    const newMoments = [...get().moments, full];
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
