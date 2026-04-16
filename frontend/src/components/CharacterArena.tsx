import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { AvatarPreview } from './AvatarPreview';
import {
  playAttackSound, playHealSound, playHitSound,
  playCriticalSound, playDeathSound,
} from '../utils/sounds';

// ─── PIXEL HP BAR ──────────────────────────────────────────────────────────
const HPBar: React.FC<{ hp: number; maxHP: number; side: 'left' | 'right'; name: string }> = ({ hp, maxHP, side, name }) => {
  const pct = (hp / maxHP) * 100;
  const barColor = pct > 60 ? '#3a9e3a' : pct > 30 ? '#fbf236' : '#d95763';
  const barBg = pct > 60 ? '#1a3a1a' : pct > 30 ? '#2a2500' : '#3a1a1a';

  return (
    <div className={`flex flex-col ${side === 'right' ? 'items-end' : 'items-start'} gap-1`}>
      <span className="hidden md:block text-[7px] tracking-wider" style={{ color: '#8888bb' }}>
        {name}
      </span>
      <div className="w-28 md:w-36 h-5 pixel-border relative overflow-hidden"
           style={{ backgroundColor: barBg, borderColor: '#3a3a6e' }}>
        <motion.div
          className="absolute inset-y-0 left-0"
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          style={{ backgroundColor: barColor }}
        />
        <div className="absolute inset-0 flex">
          {Array.from({ length: maxHP }).map((_, i) => (
            <div key={i} className="flex-1 border-r" style={{ borderColor: 'rgba(0,0,0,0.3)' }} />
          ))}
        </div>
      </div>
      <span className="text-[8px] font-bold" style={{ color: barColor }}>
        HP {hp}/{maxHP}
      </span>
    </div>
  );
};

// ─── MINI HEART ─────────────────────────────────────────────────────────────
const MiniHeart: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg viewBox="0 0 7 6" width="10" height="9"
       style={{ imageRendering: 'pixelated' }} xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="0" width="2" height="1" fill={filled ? '#d95763' : '#2a2a5e'} />
    <rect x="4" y="0" width="2" height="1" fill={filled ? '#d95763' : '#2a2a5e'} />
    <rect x="0" y="1" width="7" height="2" fill={filled ? '#ff6b6b' : '#1a1a3e'} />
    <rect x="1" y="3" width="5" height="1" fill={filled ? '#d95763' : '#2a2a5e'} />
    <rect x="2" y="4" width="3" height="1" fill={filled ? '#b4202a' : '#1a1a3e'} />
    <rect x="3" y="5" width="1" height="1" fill={filled ? '#d95763' : '#2a2a5e'} />
  </svg>
);

// ─── FLOATING TEXT ──────────────────────────────────────────────────────────
const FloatingText: React.FC<{
  text: string; color: string; x: number; y?: number; large?: boolean; onDone: () => void;
}> = ({ text, color, x, y = 20, large, onDone }) => (
  <motion.div
    initial={{ opacity: 1, y: y, scale: large ? 1.5 : 1 }}
    animate={{ opacity: 0, y: y - 60, scale: large ? 2 : 1.2 }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    onAnimationComplete={onDone}
    className={`absolute ${large ? 'text-[14px]' : 'text-[10px]'} font-bold pointer-events-none z-50 whitespace-nowrap`}
    style={{ color, left: x, textShadow: `0 0 6px ${color}` }}
  >
    {text}
  </motion.div>
);

// ─── EMOJI REACTION ─────────────────────────────────────────────────────────
const EmojiReaction: React.FC<{
  emoji: string; side: 'left' | 'right'; onDone: () => void;
}> = ({ emoji, side, onDone }) => (
  <motion.div
    initial={{ opacity: 1, y: 0, scale: 0.5 }}
    animate={{ opacity: 0, y: -40, scale: 1.5 }}
    transition={{ duration: 1, ease: 'easeOut' }}
    onAnimationComplete={onDone}
    className="absolute z-50 pointer-events-none"
    style={{
      [side === 'left' ? 'left' : 'right']: 60,
      top: 10,
      fontSize: 24,
    }}
  >
    {emoji}
  </motion.div>
);

// ─── PROJECTILE ─────────────────────────────────────────────────────────────
const Projectile: React.FC<{
  from: 'left' | 'right'; onDone: () => void;
}> = ({ from, onDone }) => {
  const startX = from === 'left' ? 80 : 260;
  const endX = from === 'left' ? 260 : 80;

  return (
    <motion.div
      initial={{ x: startX, y: 70, opacity: 1, scale: 0.8, rotate: 0 }}
      animate={{ x: endX, y: 70, opacity: 1, scale: 1.3, rotate: from === 'left' ? 360 : -360 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.35, ease: 'easeIn' }}
      onAnimationComplete={onDone}
      className="absolute z-40 pointer-events-none"
      style={{ fontSize: 18 }}
    >
      💔
    </motion.div>
  );
};

// ─── IMPACT PARTICLES ───────────────────────────────────────────────────────
const ImpactParticles: React.FC<{ x: number; color: string; onDone: () => void }> = ({ x, color, onDone }) => (
  <>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 1, x, y: 80, scale: 1 }}
        animate={{
          opacity: 0,
          x: x + (Math.random() - 0.5) * 60,
          y: 80 + (Math.random() - 0.5) * 50,
          scale: 0,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onAnimationComplete={i === 0 ? onDone : undefined}
        className="absolute z-40 pointer-events-none"
        style={{
          width: 4, height: 4,
          backgroundColor: color,
          boxShadow: `0 0 4px ${color}`,
        }}
      />
    ))}
  </>
);

// ─── DEATH OVERLAY ──────────────────────────────────────────────────────────
const DeathOverlay: React.FC<{
  onRestart: () => void;
  winner: string;
  isStreak: boolean;
  streakCount: number;
}> = ({ onRestart, winner, isStreak, streakCount }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 z-[60] flex flex-col items-center justify-center p-4 text-center"
    style={{ backgroundColor: 'rgba(10,5,20,0.92)' }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 12 }}
    >
      <div className="text-3xl mb-1">🏆</div>
      <div className="text-[12px] md:text-[14px] font-pixel text-[#fbf236] mb-1 tracking-widest uppercase">
        {winner} WINS!
      </div>

      {isStreak && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-[8px] md:text-[10px] text-[#ff6b6b] mb-4 font-bold tracking-tighter"
        >
          ON FIRE 🔥 {streakCount} WINS STREAK
        </motion.div>
      )}

      <div className="text-[8px] pixel-border px-4 py-2 mt-2 inline-block"
           style={{
             color: '#8888bb',
             backgroundColor: '#1a1a3e',
             borderColor: '#3a3a6e',
           }}>
        RELAȚIA S-A SFÂRȘIT (RUNDA ACEASTA)
      </div>
    </motion.div>

    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      onClick={onRestart}
      className="text-[9px] px-6 py-3 pixel-border mt-8 active:translate-y-[2px] transition-all tracking-widest font-bold"
      style={{
        backgroundColor: '#1a3a1a',
        borderColor: '#3a9e3a',
        color: '#99e550',
        boxShadow: '0 4px 0 #0a1a0a'
      }}
    >
      ↻ RESTART HP
    </motion.button>
  </motion.div>
);

// ─── SCREEN SHAKE WRAPPER ───────────────────────────────────────────────────
const ScreenShake: React.FC<{ trigger: number; children: React.ReactNode }> = ({ trigger, children }) => (
  <motion.div
    key={trigger}
    className="w-full flex justify-center"
    animate={trigger > 0 ? { x: [0, -4, 4, -3, 3, -1, 1, 0], y: [0, 2, -2, 1, -1, 0] } : {}}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// ─── MAIN ARENA ─────────────────────────────────────────────────────────────
export const CharacterArena: React.FC = () => {
  const { avatars, profiles, boyHP, girlHP, maxHP, lastBattleEvent, clearBattleEvent, moments, resetScale, winStreak } = useStore();

  const [boyAnim, setBoyAnim] = useState<'idle' | 'attack' | 'hurt' | 'heal' | 'dead'>('idle');
  const [girlAnim, setGirlAnim] = useState<'idle' | 'attack' | 'hurt' | 'heal' | 'dead'>('idle');
  const [projectiles, setProjectiles] = useState<{ id: string; from: 'left' | 'right' }[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; text: string; color: string; x: number; large?: boolean }[]>([]);
  const [emojis, setEmojis] = useState<{ id: string; emoji: string; side: 'left' | 'right' }[]>([]);
  const [particles, setParticles] = useState<{ id: string; x: number; color: string }[]>([]);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const [, setCooldown] = useState(false);
  const processingRef = useRef(false);

  const addFloat = useCallback((text: string, color: string, x: number, large?: boolean) => {
    const id = Math.random().toString(36).substr(2, 6);
    setFloatingTexts(prev => [...prev, { id, text, color, x, large }]);
  }, []);

  const removeFloat = useCallback((id: string) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addEmoji = useCallback((emoji: string, side: 'left' | 'right') => {
    const id = Math.random().toString(36).substr(2, 6);
    setEmojis(prev => [...prev, { id, emoji, side }]);
  }, []);

  const removeEmoji = useCallback((id: string) => {
    setEmojis(prev => prev.filter(e => e.id !== id));
  }, []);

  const addProjectile = useCallback((from: 'left' | 'right') => {
    const id = Math.random().toString(36).substr(2, 6);
    setProjectiles(prev => [...prev, { id, from }]);
  }, []);

  const removeProjectile = useCallback((id: string) => {
    setProjectiles(prev => prev.filter(p => p.id !== id));
  }, []);

  const addParticles = useCallback((x: number, color: string) => {
    const id = Math.random().toString(36).substr(2, 6);
    setParticles(prev => [...prev, { id, x, color }]);
  }, []);

  const removeParticles = useCallback((id: string) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Check death
  useEffect(() => {
    if (boyHP <= 0 || girlHP <= 0) {
      if (!isDead) {
        setIsDead(true);
        playDeathSound();
        setShakeTrigger(s => s + 1);
        if (boyHP <= 0) setBoyAnim('dead');
        if (girlHP <= 0) setGirlAnim('dead');
      }
    } else {
      setIsDead(false);
      if (boyAnim === 'dead') setBoyAnim('idle');
      if (girlAnim === 'dead') setGirlAnim('idle');
    }
  }, [boyHP, girlHP]);

  // Process battle events
  useEffect(() => {
    if (!lastBattleEvent || processingRef.current || isDead) return;
    processingRef.current = true;
    setCooldown(true);
    const ev = lastBattleEvent;

    const isCritical = ev.diceResult === 6;

    const runAnimation = async () => {
      if (ev.type === 'attack') {
        // Phase 0: DICE ROLL above attacker
        if (ev.diceResult) {
          const attackerX = ev.attacker === 'boy' ? 40 : 250;
          addFloat(`🎲 ${ev.diceResult}`, '#fbf236', attackerX, true);
          await sleep(400);
        }

        // Attacker emoji + sound
        playAttackSound();
        addEmoji('😡', ev.attacker === 'boy' ? 'left' : 'right');

        // Phase 1: Lunge
        if (ev.attacker === 'boy') setBoyAnim('attack');
        else setGirlAnim('attack');
        await sleep(200);

        // Phase 2: Projectile
        addProjectile(ev.attacker === 'boy' ? 'left' : 'right');
        await sleep(350);

        // Phase 3: Impact
        playHitSound();
        if (isCritical) playCriticalSound();
        setShakeTrigger(s => s + 1);

        if (ev.target === 'boy') setBoyAnim('hurt');
        else setGirlAnim('hurt');

        // Target emoji
        addEmoji('😢', ev.target === 'boy' ? 'left' : 'right');

        // Particles
        addParticles(ev.target === 'boy' ? 80 : 260, '#d95763');

        // Damage text
        const dmgText = isCritical ? `CRITICAL! -${ev.amount} HP 💥` : `-${ev.amount} HP`;
        addFloat(dmgText, isCritical ? '#fbf236' : '#d95763', ev.target === 'boy' ? 50 : 200, isCritical);

        await sleep(500);
        setBoyAnim('idle');
        setGirlAnim('idle');

      } else if (ev.type === 'heal') {
        playHealSound();

        if (ev.target === 'boy' || ev.target === 'both') {
          setBoyAnim('heal');
          addEmoji('❤️', 'left');
          addFloat(`+${ev.amount} HP`, '#99e550', 50);
        }
        if (ev.target === 'girl' || ev.target === 'both') {
          setGirlAnim('heal');
          addEmoji('❤️', 'right');
          addFloat(`+${ev.amount} HP`, '#99e550', 200);
        }

        await sleep(800);
        setBoyAnim('idle');
        setGirlAnim('idle');

      } else if (ev.type === 'self-damage') {
        // MUTUAL ATTACK — both attack each other simultaneously!
        playAttackSound();
        setBoyAnim('attack');
        setGirlAnim('attack');
        addEmoji('😡', 'left');
        addEmoji('😡', 'right');
        await sleep(200);

        // Both projectiles
        addProjectile('left');
        addProjectile('right');
        await sleep(350);

        // Both hit
        playHitSound();
        setShakeTrigger(s => s + 1);
        setBoyAnim('hurt');
        setGirlAnim('hurt');
        addEmoji('😢', 'left');
        addEmoji('😢', 'right');
        addParticles(80, '#d95763');
        addParticles(260, '#d95763');
        addFloat(`-${ev.amount}`, '#d95763', 50);
        addFloat(`-${ev.amount}`, '#d95763', 200);

        await sleep(500);
        setBoyAnim('idle');
        setGirlAnim('idle');
      }

      clearBattleEvent();
      processingRef.current = false;
      // Cooldown to prevent spam
      await sleep(300);
      setCooldown(false);
    };

    runAnimation();
  }, [lastBattleEvent, isDead, clearBattleEvent, addFloat, addEmoji, addProjectile, addParticles]);

  // Character animation variants
  const getVariants = (anim: string, side: 'left' | 'right') => {
    const dir = side === 'left' ? 1 : -1;
    switch (anim) {
      case 'attack':
        return { x: [0, 25 * dir, 0], scale: [1, 1.1, 1] };
      case 'hurt':
        return { x: [0, -6, 6, -3, 0], filter: ['brightness(1)', 'brightness(4)', 'brightness(1)', 'brightness(2)', 'brightness(1)'] };
      case 'heal':
        return { y: [0, -6, 0], scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.4)', 'brightness(1)'] };
      case 'dead':
        return { y: 30, opacity: 0.3, scale: 0.8, filter: 'grayscale(1)' };
      default:
        return { y: [0, -3, 0] };
    }
  };

  const handleRestart = () => {
    resetScale();
    setIsDead(false);
    setBoyAnim('idle');
    setGirlAnim('idle');
    setFloatingTexts([]);
    setEmojis([]);
    setProjectiles([]);
    setParticles([]);
  };

  return (
    <div className="w-full flex flex-col items-center mt-0.5 md:mt-2 mb-0">

      {/* HP Bars */}
      <div className="w-full max-w-md flex justify-between items-start px-2 mb-0.5 md:mb-3">
        <HPBar hp={boyHP} maxHP={maxHP} side="left" name={profiles.left.name} />
        <div className="flex flex-col items-center gap-1 pt-0.5 md:pt-1">
          <span className="text-[5px] md:text-[6px] tracking-widest" style={{ color: '#d95763' }}>⚔</span>
        </div>
        <HPBar hp={girlHP} maxHP={maxHP} side="right" name={profiles.right.name} />
      </div>

      {/* Hearts row (HIDDEN ON MOBILE) */}
      <div className="hidden md:flex w-full max-w-md justify-between items-center px-1 md:px-2 mb-1 md:mb-4">
        <div className="flex gap-[1px] md:gap-[2px]">
          {Array.from({ length: maxHP }).map((_, i) => (
            <MiniHeart key={i} filled={i < boyHP} />
          ))}
        </div>
        <div className="flex gap-[1px] md:gap-[2px]">
          {Array.from({ length: maxHP }).map((_, i) => (
            <MiniHeart key={i} filled={i < girlHP} />
          ))}
        </div>
      </div>

      {/* Arena */}
      <ScreenShake trigger={shakeTrigger}>
        <div
          className="relative w-full max-w-md pixel-border shadow-pixel overflow-hidden h-[110px] md:h-[240px]"
          style={{
            backgroundColor: '#0d0d2b',
            borderColor: isDead ? '#d95763' : '#3a3a6e',
            backgroundImage:
              'linear-gradient(rgba(100,160,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,0.04) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            transition: 'border-color 0.3s',
          }}
        >
          {/* Arena floor */}
          <div className="absolute bottom-0 w-full h-16"
               style={{ background: 'linear-gradient(to top, #1a1a3e, transparent)', borderTop: '2px solid #2a2a5e' }} />
          <div className="absolute bottom-0 w-full h-2" style={{ backgroundColor: '#2a2a5e' }} />

          {/* Floating texts */}
          <AnimatePresence>
            {floatingTexts.map(ft => (
              <FloatingText key={ft.id} text={ft.text} color={ft.color} x={ft.x} large={ft.large} onDone={() => removeFloat(ft.id)} />
            ))}
          </AnimatePresence>

          {/* Emoji reactions */}
          <AnimatePresence>
            {emojis.map(em => (
              <EmojiReaction key={em.id} emoji={em.emoji} side={em.side} onDone={() => removeEmoji(em.id)} />
            ))}
          </AnimatePresence>

          {/* Projectiles */}
          <AnimatePresence>
            {projectiles.map(p => (
              <Projectile key={p.id} from={p.from} onDone={() => removeProjectile(p.id)} />
            ))}
          </AnimatePresence>

          {/* Impact particles */}
          <AnimatePresence>
            {particles.map(p => (
              <ImpactParticles key={p.id} x={p.x} color={p.color} onDone={() => removeParticles(p.id)} />
            ))}
          </AnimatePresence>

          {/* BOY (Left) */}
          <div className="absolute" style={{ left: 40, bottom: 20 }}>
            <motion.div
              animate={getVariants(boyAnim, 'left')}
              transition={
                boyAnim === 'idle'
                  ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                  : boyAnim === 'dead'
                  ? { duration: 0.8, ease: 'easeOut' }
                  : { duration: 0.3, ease: 'easeOut' }
              }
            >
              <AvatarPreview config={avatars.boy} size={72} />
              {boyAnim === 'heal' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: '0 0 20px 10px rgba(153,229,80,0.5)' }}
                />
              )}
            </motion.div>
          </div>

          {/* GIRL (Right) — flip wrapper is OUTSIDE motion.div so framer doesn't overwrite it */}
          <div className="absolute" style={{ right: 40, bottom: 20 }}>
            <div style={{ transform: 'scaleX(-1)' }}>
              <motion.div
                animate={getVariants(girlAnim, 'right')}
                transition={
                  girlAnim === 'idle'
                    ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                    : girlAnim === 'dead'
                    ? { duration: 0.8, ease: 'easeOut' }
                    : { duration: 0.3, ease: 'easeOut' }
                }
              >
                <AvatarPreview config={avatars.girl} size={72} />
                {girlAnim === 'heal' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ boxShadow: '0 0 20px 10px rgba(153,229,80,0.5)' }}
                  />
                )}
              </motion.div>
            </div>
          </div>

          {/* Center line */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[1px] h-32 opacity-10"
               style={{ backgroundColor: '#8888bb' }} />

          {/* Death overlay */}
          <AnimatePresence>
            {isDead && (
              <DeathOverlay
                onRestart={handleRestart}
                winner={boyHP <= 0 ? profiles.right.name : profiles.left.name}
                isStreak={winStreak.count >= 2}
                streakCount={winStreak.count}
              />
            )}
          </AnimatePresence>
        </div>
      </ScreenShake>

      {/* Event log (last 5) */}
      <div className="w-full max-w-md mt-4 flex flex-col gap-1 px-2">
        <span className="text-[6px] tracking-widest mb-1" style={{ color: '#8888bb' }}>
          ULTIMELE EVENIMENTE
        </span>
        {moments.slice(-5).reverse().map((m, idx) => (
          <div
            key={m.id}
            className={`flex items-center gap-2 px-2 py-1 pixel-border text-[7px] ${idx >= 2 ? 'hidden md:flex' : ''}`}
            style={{
              backgroundColor: m.type === 'good' ? '#0a1a0a' : '#1a0a0a',
              borderColor: m.type === 'good' ? '#3a9e3a' : '#b4202a',
              color: m.type === 'good' ? '#99e550' : '#d95763',
            }}
          >
            <span>{m.type === 'good' ? '❤️' : '💥'}</span>
            <span className="flex-1 truncate" style={{ color: '#eeeeff' }}>{m.title}</span>
            <span className="text-[6px]" style={{
              color: m.person === 'boy' ? '#4A90D9' : m.person === 'girl' ? '#e91e8c' : '#9b59b6',
            }}>
              {m.person === 'boy' ? 'EL' : m.person === 'girl' ? 'EA' : 'AMBII'}
            </span>
            <span>{m.type === 'good' ? `+${m.weight}` : `-${m.weight}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
