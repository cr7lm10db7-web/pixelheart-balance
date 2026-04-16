import React, { useState } from 'react';
import type { MomentType, MomentPerson } from '../store/useStore';
import { useStore } from '../store/useStore';

const PERSON_LABELS: { value: MomentPerson; label: string; activeColor: string; activeBorder: string }[] = [
  { value: 'boy',      label: '♂ EL',    activeColor: '#1a2a4e', activeBorder: '#4A90D9' },
  { value: 'girl',     label: '♀ EA',    activeColor: '#2a1030', activeBorder: '#e91e8c' },
  { value: 'together', label: '♥ AMBII', activeColor: '#2a1a40', activeBorder: '#9b59b6' },
];

export const AddEventForm: React.FC = () => {
  const { addMoment } = useStore();
  const [title, setTitle]   = useState('');
  const [type, setType]     = useState<MomentType>('good');
  const [person, setPerson] = useState<MomentPerson>('together');
  const [weight, setWeight] = useState(1);
  const [flash, setFlash]   = useState<'green' | 'red' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMoment({ type, person, title, weight });
    setTitle('');
    // Flash feedback
    setFlash(type === 'good' ? 'green' : 'red');
    setTimeout(() => setFlash(null), 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4">
      <div
        className={`pixel-border shadow-pixel p-6 transition-shadow ${flash === 'green' ? 'glow-green' : ''} ${flash === 'red' ? 'glow-red' : ''}`}
        style={{ backgroundColor: '#12122e', borderColor: '#3a3a6e' }}
      >
        <h3 className="text-[10px] mb-6 tracking-widest uppercase pb-3"
            style={{ color: '#8888bb', borderBottom: '4px solid #3a3a6e' }}>
          + Adaugă eveniment
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Text input */}
          <input
            type="text"
            placeholder="Ce s-a întâmplat?"
            className="w-full px-3 py-3 pixel-border focus:outline-none text-[10px] transition-colors"
            style={{
              backgroundColor: '#1a1a3e',
              borderColor: '#3a3a6e',
              color: '#eeeeff',
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Type selector */}
          <div className="flex gap-3">
            {(['good', 'bad'] as MomentType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="flex-1 py-3 text-[10px] pixel-border transition-all active:translate-y-1 active:shadow-none"
                style={{
                  backgroundColor: type === t
                    ? (t === 'good' ? '#1a3a1a' : '#3a1a1a')
                    : '#1a1a3e',
                  borderColor: type === t
                    ? (t === 'good' ? '#3a9e3a' : '#b4202a')
                    : '#3a3a6e',
                  color: type === t
                    ? (t === 'good' ? '#99e550' : '#d95763')
                    : '#8888bb',
                  boxShadow: type === t ? '4px 4px 0px 0px #081820' : '2px 2px 0px 0px #081820',
                }}
              >
                {t === 'good' ? '▲ POZITIV' : '▼ NEGATIV'}
              </button>
            ))}
          </div>

          {/* Person selector */}
          <div className="flex gap-2">
            {PERSON_LABELS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPerson(p.value)}
                className="flex-1 py-3 text-[10px] pixel-border transition-all active:translate-y-1"
                style={{
                  backgroundColor: person === p.value ? p.activeColor : '#1a1a3e',
                  borderColor: person === p.value ? p.activeBorder : '#3a3a6e',
                  color: person === p.value ? p.activeBorder : '#8888bb',
                  boxShadow: person === p.value ? '4px 4px 0px 0px #081820' : '2px 2px 0px 0px #081820',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Weight */}
          <div className="flex items-center gap-3">
            <span className="text-[8px] uppercase tracking-wider" style={{ color: '#8888bb' }}>
              Importanță:
            </span>
            {[1, 2, 3].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeight(w)}
                className="w-8 h-8 text-[10px] pixel-border transition-all active:translate-y-[2px]"
                style={{
                  backgroundColor: weight >= w ? '#2a2500' : '#1a1a3e',
                  borderColor: weight >= w ? '#fbf236' : '#3a3a6e',
                  color: weight >= w ? '#fbf236' : '#8888bb',
                }}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-5 text-[12px] pixel-border shadow-pixel active:translate-y-1 active:shadow-none transition-all tracking-[0.2em] font-bold"
            style={{
              backgroundColor: '#1a1a3e',
              borderColor: '#fbf236',
              color: '#fbf236',
              boxShadow: '0 0 15px rgba(251, 242, 54, 0.3)',
            }}
          >
            CONFIRMĂ EVENIMENT ›
          </button>
        </form>
      </div>
    </div>
  );
};
