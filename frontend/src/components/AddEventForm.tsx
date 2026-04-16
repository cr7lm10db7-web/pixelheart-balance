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
    <div className="w-full max-w-2xl mx-auto px-1 md:px-4 mt-0.5 md:mt-0">
      <div
        className={`pixel-border shadow-pixel p-1 md:p-6 transition-shadow ${flash === 'green' ? 'glow-green' : ''} ${flash === 'red' ? 'glow-red' : ''}`}
        style={{ backgroundColor: '#12122e', borderColor: '#3a3a6e' }}
      >
        <h3 className="hidden md:block text-[10px] mb-6 tracking-widest uppercase pb-3"
            style={{ color: '#8888bb', borderBottom: '4px solid #3a3a6e' }}>
          + Adaugă eveniment
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-1 md:gap-5">
          {/* Text input */}
          <input
            type="text"
            placeholder="Ce s-a întâmplat?"
            className="w-full px-1.5 py-1.5 md:px-3 md:py-3 pixel-border focus:outline-none text-[8px] md:text-[10px] transition-colors"
            style={{
              backgroundColor: '#1a1a3e',
              borderColor: '#3a3a6e',
              color: '#eeeeff',
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col md:flex-col gap-1 md:gap-5 w-full">
            {/* Row 1: Type + Person */}
            <div className="flex flex-row gap-1 md:gap-2 w-full">
              {/* Type selector */}
              <div className="flex gap-1 md:gap-3 flex-[0.8] md:flex-1">
                {(['good', 'bad'] as MomentType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className="flex-1 py-1 md:py-3 text-[12px] md:text-[10px] pixel-border transition-all active:translate-y-[1px] active:shadow-none flex items-center justify-center font-bold font-sans md:font-pixel"
                    style={{
                      backgroundColor: type === t ? (t === 'good' ? '#1a3a1a' : '#3a1a1a') : '#1a1a3e',
                      borderColor: type === t ? (t === 'good' ? '#3a9e3a' : '#b4202a') : '#3a3a6e',
                      color: type === t ? (t === 'good' ? '#99e550' : '#d95763') : '#8888bb',
                      boxShadow: type === t ? '2px 2px 0px 0px #081820' : '1px 1px 0px 0px #081820',
                    }}
                  >
                    <span>{t === 'good' ? '+' : '-'}</span>
                  </button>
                ))}
              </div>

              {/* Person selector */}
              <div className="flex gap-1 md:gap-2 flex-[1.2] md:flex-1">
                {PERSON_LABELS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPerson(p.value)}
                    className="flex-1 py-1 md:py-3 text-[12px] md:text-[10px] pixel-border transition-all active:translate-y-[1px] flex items-center justify-center font-sans md:font-pixel"
                    style={{
                      backgroundColor: person === p.value ? p.activeColor : '#1a1a3e',
                      borderColor: person === p.value ? p.activeBorder : '#3a3a6e',
                      color: person === p.value ? p.activeBorder : '#8888bb',
                      boxShadow: person === p.value ? '2px 2px 0px 0px #081820' : '1px 1px 0px 0px #081820',
                    }}
                  >
                    <span className="md:hidden">{p.label.split(' ')[0]}</span>
                    <span className="hidden md:inline">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Weight + Submit */}
            <div className="flex flex-row items-stretch gap-1 md:gap-2 w-full">
              {/* Weight */}
              <div className="flex items-center justify-center gap-1 md:gap-3 bg-[#1a1a3e] px-1 md:px-2 py-0.5 md:py-0 md:bg-transparent pixel-border md:border-none border-[#3a3a6e]">
                <span className="text-[6px] md:text-[8px] uppercase tracking-wider text-[#8888bb]">
                  LV
                </span>
                {[1, 2, 3].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeight(w)}
                    className="w-5 h-5 md:w-8 md:h-8 text-[8px] md:text-[10px] pixel-border transition-all active:translate-y-[0.5px] flex items-center justify-center"
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
                className="flex-1 py-1 px-1 md:py-5 text-[8px] md:text-[12px] pixel-border shadow-pixel active:translate-y-[0.5px] active:shadow-none transition-all tracking-widest font-bold"
                style={{
                  backgroundColor: '#1a1a3e',
                  borderColor: '#fbf236',
                  color: '#fbf236',
                  boxShadow: '0 0 10px rgba(251, 242, 54, 0.1)',
                }}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
