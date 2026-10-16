import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from './AnimatedCard';
import { useTheme } from '../context/ThemeContext';
import { CAMPUS_EVENTS, CampusEvent } from '../data/mockData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  QrCode, 
  X, 
  Sparkles,
  Clock,
  ArrowUpRight,
  Sun,
  Coffee,
  Volume2,
  Palette
} from 'lucide-react';

type PassSkinKey = 'skin' | 'cardinal' | 'champagne';

interface PassSkinConfig {
  id: PassSkinKey;
  name: string;
  swatch: string;
  cardBg: string;
  borderColor: string;
  shadow: string;
  dividerColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  titleColor: string;
  subtitleColor: string;
  metaBg: string;
  metaBorder: string;
  metaLabel: string;
  metaValue: string;
  qrFrameBg: string;
  qrFrameBorder: string;
  qrColor: string;
  passIdColor: string;
  footerText: string;
  closeBtnBg: string;
  closeBtnText: string;
  closeBtnBorder: string;
  pulseDot: string;
  notchBorder: string;
}

const PASS_SKINS: Record<PassSkinKey, PassSkinConfig> = {
  skin: {
    id: 'skin',
    name: 'Warm Skin',
    swatch: '#e8cdb5',
    cardBg: 'bg-gradient-to-b from-[#fefbf9] via-[#f7eee5] to-[#f0e0d2]',
    borderColor: 'border-[#e4cebe]',
    shadow: 'shadow-[0_25px_70px_-12px_rgba(168,110,80,0.22),0_0_0_1px_rgba(168,110,80,0.08)]',
    dividerColor: 'border-[#dfc6b4]',
    badgeBg: 'bg-[#faece0]',
    badgeText: 'text-[#874326]',
    badgeBorder: 'border-[#e2cbba]',
    titleColor: 'text-[#2a1e18]',
    subtitleColor: 'text-[#7e6052]',
    metaBg: 'bg-[#fffaf6]',
    metaBorder: 'border-[#e7d2c3]',
    metaLabel: 'text-[#967464]',
    metaValue: 'text-[#38261e]',
    qrFrameBg: 'bg-white',
    qrFrameBorder: 'border-[#e7d2c3]',
    qrColor: 'text-[#362118]',
    passIdColor: 'text-[#947262]',
    footerText: 'text-[#7e6052]',
    closeBtnBg: 'bg-[#f0dfd2] hover:bg-[#e7d1c2]',
    closeBtnText: 'text-[#3d2920]',
    closeBtnBorder: 'border-[#dbc2b0]',
    pulseDot: 'bg-[#ea580c]',
    notchBorder: 'border-[#e4cebe]',
  },
  cardinal: {
    id: 'cardinal',
    name: 'Cardinal Red',
    swatch: '#8c1515',
    cardBg: 'bg-gradient-to-b from-[#fffcfc] via-[#faeded] to-[#f5dddd]',
    borderColor: 'border-[#e8bebe]',
    shadow: 'shadow-[0_25px_70px_-12px_rgba(140,21,21,0.2),0_0_0_1px_rgba(140,21,21,0.08)]',
    dividerColor: 'border-[#e5b8b8]',
    badgeBg: 'bg-[#8c1515]/10',
    badgeText: 'text-[#8c1515]',
    badgeBorder: 'border-[#8c1515]/30',
    titleColor: 'text-[#350808]',
    subtitleColor: 'text-[#7d3b3b]',
    metaBg: 'bg-[#fffdfd]',
    metaBorder: 'border-[#ecc4c4]',
    metaLabel: 'text-[#944e4e]',
    metaValue: 'text-[#3d0d0d]',
    qrFrameBg: 'bg-white',
    qrFrameBorder: 'border-[#ecc4c4]',
    qrColor: 'text-[#8c1515]',
    passIdColor: 'text-[#944e4e]',
    footerText: 'text-[#7d3b3b]',
    closeBtnBg: 'bg-[#f4dede] hover:bg-[#eacaca]',
    closeBtnText: 'text-[#480c0c]',
    closeBtnBorder: 'border-[#dfbebe]',
    pulseDot: 'bg-[#8c1515]',
    notchBorder: 'border-[#e8bebe]',
  },
  champagne: {
    id: 'champagne',
    name: 'Champagne Silk',
    swatch: '#d4af37',
    cardBg: 'bg-gradient-to-b from-[#fffdf9] via-[#fbf6e8] to-[#f4ecd2]',
    borderColor: 'border-[#e5d8b2]',
    shadow: 'shadow-[0_25px_70px_-12px_rgba(180,140,40,0.2),0_0_0_1px_rgba(180,140,40,0.08)]',
    dividerColor: 'border-[#e2d2a4]',
    badgeBg: 'bg-[#f7edcc]',
    badgeText: 'text-[#854d0e]',
    badgeBorder: 'border-[#e2cf95]',
    titleColor: 'text-[#2e2308]',
    subtitleColor: 'text-[#786638]',
    metaBg: 'bg-[#fffefa]',
    metaBorder: 'border-[#ebdcae]',
    metaLabel: 'text-[#94814e]',
    metaValue: 'text-[#3b2f12]',
    qrFrameBg: 'bg-white',
    qrFrameBorder: 'border-[#ebdcae]',
    qrColor: 'text-[#382b0b]',
    passIdColor: 'text-[#94814e]',
    footerText: 'text-[#786638]',
    closeBtnBg: 'bg-[#f3e7c4] hover:bg-[#e8daaf]',
    closeBtnText: 'text-[#3d3010]',
    closeBtnBorder: 'border-[#dbc998]',
    pulseDot: 'bg-[#d97706]',
    notchBorder: 'border-[#e5d8b2]',
  },
};

export const CampusDiscovery: React.FC = () => {
  const { themeConfig } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<CampusEvent[]>(CAMPUS_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activePassEvent, setActivePassEvent] = useState<CampusEvent | null>(null);
  const [passSkin, setPassSkin] = useState<PassSkinKey>('skin');

  const currentSkin = PASS_SKINS[passSkin] || PASS_SKINS.skin;

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ['ALL', 'Tech & AI', 'Hackathon', 'Design', 'Social & Lo-Fi'];

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'ALL') return true;
    return ev.category === selectedCategory;
  });

  const handleRSVP = (event: CampusEvent) => {
    sound.playSuccess();
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              registered: true,
              spotsLeft: Math.max(0, e.spotsLeft - 1),
            }
          : e
      )
    );
    setActivePassEvent({ ...event, registered: true });
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [themeConfig.primary, '#ec4899', '#06b6d4'],
    });
  };

  // Close pass on Escape key press & lock body scroll while modal is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePassEvent) {
        sound.playPop();
        setActivePassEvent(null);
      }
    };

    if (activePassEvent) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePassEvent]);

  return (
    <div className="space-y-8 pb-36">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border border-indigo-200 bg-indigo-50 text-indigo-700">
              ✦ UNIFLOW INSTITUTE RADAR
            </span>
            <span className="text-[11px] font-mono text-slate-400">CAMPUS EVENTS & GUEST SEMINARS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-instrument italic text-slate-900 tracking-tight mt-1.5 font-normal">
            Institute Events & Digital Passes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
            Campus events, research keynotes, hardware workshops, and guest seminars conducted by Uniflow Institute. Click any event to generate your digital attendance pass.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap btn-tactile ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flagship Hackathon Spotlight Banner (Page 5 Featured Image - BIG & IMMERSIVE) */}
      <AnimatedCard index={0} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden relative group shadow-sm">
        <div className="relative h-[380px] sm:h-[440px] md:h-[460px] overflow-hidden">
          <img 
            src="/images/hackathon-team.jpg" 
            alt="TreeHacks 2026 Collegiate Hackathon Teams Collaborating"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/98 via-[#0a0a0b]/60 to-[#0a0a0b]/30 p-6 sm:p-10 flex flex-col justify-between">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/70 text-emerald-400 backdrop-blur-md border border-emerald-500/30 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  FLAGSHIP HACKATHON • 36 HOURS
                </span>
                <span className="hidden sm:inline-flex text-xs font-mono text-emerald-300 font-bold bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                  ₹4,00,000+ CASH & PRIZES
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-black/60 text-white/90 backdrop-blur-md border border-white/10 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>STARTS IN 14D : 08H : 22M</span>
              </div>
            </div>

            {/* Bottom Content & CTAs */}
            <div className="space-y-4">
              <div className="max-w-2xl space-y-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-emerald-400">
                  STANFORD ARRILLAGA CENTER • FEBRUARY 2026
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-instrument italic text-white tracking-tight leading-[1.1] drop-shadow-lg font-normal">
                  TreeHacks 2026: North America’s Premier Hackathon
                </h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal max-w-xl">
                  1,200+ elite engineers, builders & designers converge at Stanford. Build autonomous AI agents, spatial VisionOS interfaces, and robotic hardware with top tech founders & VCs.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                {(events[2]?.registered || events[0]?.registered) ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActivePassEvent(events[2] || events[0]);
                    }}
                    className="px-6 py-3.5 rounded-2xl text-xs font-mono uppercase tracking-wider font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all btn-tactile cursor-pointer border border-emerald-300 shadow-xl flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                    <span>View Digital Wallet Pass</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRSVP(events[2] || events[0])}
                    className="px-6 py-3.5 rounded-2xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all btn-tactile cursor-pointer border border-white/15 shadow-xl flex items-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.primary}, #10b981)`,
                      boxShadow: `0 6px 20px ${themeConfig.glow}`,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Claim Hacker VIP Pass</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center gap-3 text-xs font-mono text-white/70 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>1,248 / 1,500 Slots Filled</span>
                  <span className="text-white/20">•</span>
                  <span className="text-amber-300 font-bold">Applications Close Friday</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </AnimatedCard>

      {/* Events Grid with slow and beautiful filter transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)', scale: 0.99 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, y: -10, filter: 'blur(4px)', scale: 0.995 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {filteredEvents.map((event, i) => (
          <AnimatedCard
            key={event.id}
            index={i + 1}
            className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col justify-between group transition-all shadow-sm"
          >
            {/* Cover Image Header */}
            <div className="relative h-48 sm:h-52 overflow-hidden border-b border-slate-200/80">
              {event.imageUrl ? (
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${event.coverGradient}`} />
              )}
              {/* Dark Gradient Overlay for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/95 via-[#0a0a0b]/50 to-transparent p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 text-amber-300 backdrop-blur-md border border-amber-400/30">
                    {event.badge}
                  </span>
                  <span className="text-xs font-mono text-white/80 font-medium px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                    {event.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-instrument italic text-white leading-snug drop-shadow-sm font-normal">
                    {event.title}
                  </h3>
                  <div className="mt-1 text-xs text-white/60 font-normal">
                    Organized by {event.organizer}
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {event.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>

              {/* Spots Remaining Progress */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-medium">
                  <span>Capacity Status</span>
                  <span className="text-indigo-600 font-semibold">{event.spotsLeft} spots remaining</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="bg-indigo-600 h-full rounded-full" 
                    style={{ width: `${((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100}%` }} 
                  />
                </div>
              </div>

              {/* RSVP Action */}
              <div className="pt-2 flex items-center gap-3">
                {event.registered ? (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActivePassEvent(event);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-100 transition-all btn-tactile"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>View Digital Wallet Pass</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRSVP(event)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white flex items-center justify-center gap-2 transition-all btn-tactile cursor-pointer border border-transparent shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.primary}, #ec4899)`,
                      boxShadow: `0 4px 15px ${themeConfig.glow}`,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Claim Digital Pass</span>
                  </button>
                )}
              </div>
            </div>
          </AnimatedCard>
        ))}
        </motion.div>
      </AnimatePresence>

      {/* Campus Courtyard Study Terrace & Outdoor Atmospheric Radar (Page 5 Featured Image 2 - MEDIUM-TO-BIG) */}
      <AnimatedCard index={filteredEvents.length + 1} className="vadim-glass-card rounded-3xl border border-slate-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center shadow-sm">
        
        {/* Left Column (6 cols): The campus-window-desk.jpg photograph */}
        <div className="md:col-span-6 relative h-72 sm:h-80 md:h-[360px] overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/80 group">
          <img 
            src="/images/campus-window-desk.jpg" 
            alt="Minimalist Stanford Study Desk Overlooking Sunlit Campus Courtyard and Students"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/95 via-[#0a0a0b]/40 to-transparent p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/70 text-emerald-400 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                COURTYARD DESK 12 • 72°F SUNNY
              </span>
              <span className="text-xs font-mono text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium border border-white/10">
                TRESSIDER UNION
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl sm:text-3xl font-instrument italic text-white drop-shadow-sm leading-snug font-normal">
                Panoramic Courtyard Study Terrace
              </h4>
              <p className="text-xs text-white/60 font-normal leading-relaxed">
                Floor-to-ceiling glass view • Noise-cancelling headphone zone • Natural daylight circadian synchronization
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Atmospheric Telemetry & Seat Reservation */}
        <div className="md:col-span-6 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Coffee className="w-3 h-3 text-amber-600" />
                CAMPUS LIVE ATMOSPHERE
              </span>
              <span className="text-xs font-mono text-slate-400">Tressider Terrace</span>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● 4 OF 16 SEATS FREE
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-instrument italic text-slate-900 tracking-tight font-normal">
            Sunny Courtyard Desks & Acoustic Focus
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Take your laptop outside without losing Wi-Fi speeds. Stanford’s eduroam mesh delivers 850 Mbps across the lawn with ergonomic standing desks and coffee pop-ups.
          </p>

          {/* Environmental Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-medium block">Solar Index</span>
              <span className="text-xs font-mono font-bold text-amber-600 mt-1 block">UV 3.2 Mild</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-medium block">Acoustic</span>
              <span className="text-xs font-mono font-bold text-emerald-600 mt-1 block">42 dB Quiet</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-medium block">Espresso</span>
              <span className="text-xs font-mono font-bold text-cyan-600 mt-1 block">CoHo 2m Walk</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playSuccess();
                confetti({ particleCount: 40, spread: 60 });
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-white transition-all btn-tactile cursor-pointer border border-transparent shadow-md flex items-center gap-1.5"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.primary}, #10b981)`,
                boxShadow: `0 4px 15px ${themeConfig.glow}`,
              }}
            >
              <Sun className="w-3.5 h-3.5 text-white" />
              <span>Reserve Courtyard Desk</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setSelectedCategory('ALL');
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all btn-tactile cursor-pointer flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>View All Campus Spots</span>
            </button>
          </div>
        </div>

      </AnimatedCard>

      {/* Digital Apple-Wallet style pass modal (Clean Floating Pop-up - With Skin Theme) */}
      {mounted && createPortal(
        <AnimatePresence>
          {activePassEvent && (
            <motion.div 
              key="pass-portal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto select-none overflow-hidden"
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0,
                bottom: 0,
                zIndex: 9999,
              }}
            >
              {/* Click-outside dismiss backdrop: Light & transparent so page background is completely visible */}
              <div
                onClick={() => {
                  sound.playPop();
                  setActivePassEvent(null);
                }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
              />

                {/* Tactile Spring Floating Pop-up Card with Skin Theme - Centered on Screen */}
                <motion.div
                  key="pass-popup-card"
                  initial={{ opacity: 0, scale: 0.88, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 12 }}
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 30,
                    mass: 0.7,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full max-w-[360px] sm:max-w-[375px] rounded-3xl ${currentSkin.cardBg} border ${currentSkin.borderColor} ${currentSkin.shadow} p-4 sm:p-5 relative z-10 transition-colors duration-300 shadow-2xl flex flex-col`}
                >
                  {/* Header */}
                  <div className={`flex items-center justify-between pb-2 border-b ${currentSkin.dividerColor}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${currentSkin.pulseDot}`} />
                      <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-widest font-semibold ${currentSkin.titleColor}`}>
                        UNIFLOW INSTITUTE DIGITAL PASS
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        sound.playPop();
                        setActivePassEvent(null);
                      }}
                      className={`p-1.5 rounded-xl opacity-60 hover:opacity-100 hover:bg-black/5 transition-all cursor-pointer ${currentSkin.titleColor}`}
                      title="Close Pass"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pass Skin Selector Row */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className={`flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold ${currentSkin.subtitleColor}`}>
                      <Palette className="w-3 h-3" />
                      <span>Skin Theme:</span>
                    </div>
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/5 border border-black/5">
                      {(Object.keys(PASS_SKINS) as PassSkinKey[]).map((skinKey) => {
                        const skin = PASS_SKINS[skinKey];
                        const isSelected = passSkin === skinKey;
                        return (
                          <button
                            key={skinKey}
                            onClick={() => {
                              sound.playClick(1200);
                              setPassSkin(skinKey);
                            }}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white shadow-xs font-bold text-slate-900 scale-105'
                                : 'opacity-65 hover:opacity-100 text-slate-600'
                            }`}
                            title={`${skin.name} Skin`}
                          >
                            <span 
                              className="w-2 h-2 rounded-full border border-black/10 shrink-0" 
                              style={{ backgroundColor: skin.swatch }} 
                            />
                            <span>{skin.name.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pass Body */}
                  <div className="mt-2 space-y-1.5 text-center">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase tracking-wider ${currentSkin.badgeBg} ${currentSkin.badgeText} ${currentSkin.badgeBorder}`}>
                      {activePassEvent.badge}
                    </span>

                    <h3 className={`text-base sm:text-lg font-instrument italic leading-snug font-normal ${currentSkin.titleColor}`}>
                      {activePassEvent.title}
                    </h3>
                    <p className={`text-[10.5px] font-mono ${currentSkin.subtitleColor}`}>
                      {activePassEvent.location} • {activePassEvent.time}
                    </p>

                    {/* Attendee Details Grid */}
                    <div className={`p-2 sm:p-2.5 rounded-xl ${currentSkin.metaBg} border ${currentSkin.metaBorder} text-left grid grid-cols-2 gap-2 text-[10.5px] font-mono shadow-2xs`}>
                      <div>
                        <span className={`text-[8.5px] uppercase font-medium block ${currentSkin.metaLabel}`}>Attendee</span>
                        <div className={`font-semibold ${currentSkin.metaValue}`}>Alex Mercer</div>
                      </div>
                      <div>
                        <span className={`text-[8.5px] uppercase font-medium block ${currentSkin.metaLabel}`}>Affiliation</span>
                        <div className={`font-semibold ${currentSkin.metaValue}`}>Uniflow Visual Institute</div>
                      </div>
                      <div>
                        <span className={`text-[8.5px] uppercase font-medium block ${currentSkin.metaLabel}`}>Access Level</span>
                        <div className="text-emerald-600 font-semibold">VIP Fast-Track</div>
                      </div>
                      <div>
                        <span className={`text-[8.5px] uppercase font-medium block ${currentSkin.metaLabel}`}>Seat / Roster</span>
                        <div className={`font-semibold ${currentSkin.metaValue}`}>Section A-14</div>
                      </div>
                    </div>

                    {/* Authentic Apple Wallet Perforated Tear Line with Notch Cutouts */}
                    <div className="relative my-1.5 flex items-center justify-center">
                      <div className={`absolute -left-4 sm:-left-5 w-4 h-4 rounded-full bg-[#f8fafc] border-r ${currentSkin.notchBorder} shadow-inner`} />
                      <div className={`w-full border-t border-dashed ${currentSkin.dividerColor}`} />
                      <div className={`absolute -right-4 sm:-right-5 w-4 h-4 rounded-full bg-[#f8fafc] border-l ${currentSkin.notchBorder} shadow-inner`} />
                    </div>

                    {/* Simulated QR Code Bar */}
                    <div className="pt-0.5 flex flex-col items-center">
                      <div className={`w-20 h-20 sm:w-22 sm:h-22 ${currentSkin.qrFrameBg} border ${currentSkin.qrFrameBorder} rounded-xl p-1.5 shadow-xs flex items-center justify-center`}>
                        <QrCode className={`w-16 h-16 sm:w-18 sm:h-18 ${currentSkin.qrColor}`} />
                      </div>
                      <span className={`text-[9px] font-mono mt-1 font-medium ${currentSkin.passIdColor}`}>
                        PASS ID: UNI-2026-ALX-9942
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={`mt-2.5 pt-2 border-t ${currentSkin.dividerColor} flex items-center justify-between`}>
                    <span className={`text-[10.5px] font-mono ${currentSkin.footerText}`}>Verified Uniflow Event Pass</span>
                    <button
                      onClick={() => {
                        sound.playPop();
                        setActivePassEvent(null);
                      }}
                      className={`px-3 py-1 rounded-xl text-[10.5px] font-mono uppercase tracking-wider font-semibold ${currentSkin.closeBtnBg} ${currentSkin.closeBtnText} border ${currentSkin.closeBtnBorder} transition-colors btn-tactile cursor-pointer shadow-xs`}
                    >
                      Close Pass
                    </button>
                  </div>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};
