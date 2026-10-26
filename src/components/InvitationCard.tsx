import React, { useState } from 'react';
import { Guest, WeddingConfig } from '../types/wedding';
import { CountdownTimer } from './CountdownTimer';

interface InvitationCardProps {
  config: WeddingConfig;
  activeGuest: Guest | null;
  onOpenRSVP: () => void;
  onOpenPass: () => void;
  onNavigate: (view: 'invitation' | 'map' | 'pass' | 'gate' | 'admin') => void;
  isCapacityReached?: boolean;
  totalAcceptedHeadcount?: number;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  config,
  activeGuest,
  onOpenRSVP,
  onOpenPass,
  onNavigate: _onNavigate,
  isCapacityReached = false,
  totalAcceptedHeadcount = 0,
}) => {
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);

  const bgImage = config.backgroundImageUrl && !config.backgroundImageUrl.includes('aistudio.google.com')
    ? config.backgroundImageUrl
    : '/assets/images/couple_portrait.jpg';

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 relative">
      {/* Ambient delicate stardust floating elements */}
      <div className="absolute top-10 left-4 sm:left-8 w-2 h-2 rounded-full bg-[#CFB28A]/40 blur-xs animate-dust pointer-events-none" />
      <div className="absolute top-32 right-6 sm:right-12 w-2.5 h-2.5 rounded-full bg-[#E8D5B5]/30 blur-xs animate-dust [animation-delay:2s] pointer-events-none" />
      <div className="absolute bottom-16 left-8 sm:left-16 w-2 h-2 rounded-full bg-[#CFB28A]/35 blur-xs animate-dust [animation-delay:4s] pointer-events-none" />

      {/* Royal Wedding Invitation Card - Mobile & Fullscreen Optimized */}
      <section className="relative bg-[#0A0A0E] border-2 border-[#CFB28A]/60 rounded-2xl sm:rounded-3xl gold-box-glow p-4 xs:p-6 sm:p-12 text-center text-[#F7F1E6] overflow-hidden shadow-2xl">
        {/* Ambient Couple Backdrop */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <img
            src={bgImage}
            alt="Blessing & Ruvarashe"
            className="w-full h-full object-cover object-center filter blur-[0.5px] scale-102"
            style={{ opacity: config.backgroundOpacity ?? 0.18 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0D]/85 via-[#0A0A0D]/60 to-[#0A0A0D]/92" />
        </div>

        {/* Inner Delicate Inset Gold Hairline Border */}
        <div className="absolute inset-2 sm:inset-4 border border-[#CFB28A]/30 rounded-xl sm:rounded-2xl pointer-events-none z-10" />

        {/* Ornate Corner Accents */}
        <div className="absolute top-3 left-3 sm:top-6 sm:left-6 text-[#CFB28A]/80 text-base sm:text-xl select-none pointer-events-none z-10">
          ❧
        </div>
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 text-[#CFB28A]/80 text-base sm:text-xl select-none pointer-events-none -scale-x-100 z-10">
          ❧
        </div>
        <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 text-[#CFB28A]/80 text-base sm:text-xl select-none pointer-events-none -scale-y-100 z-10">
          ❧
        </div>
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 text-[#CFB28A]/80 text-base sm:text-xl select-none pointer-events-none -scale-100 z-10">
          ❧
        </div>

        {/* Main Content Layer */}
        <div className="relative z-10 space-y-6 sm:space-y-8">
          {/* Top Monogram Crest */}
          <div className="space-y-2 pt-1 sm:pt-2">
            <div className="inline-flex items-center justify-center relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#CFB28A]/70 bg-gradient-to-b from-[#181820]/95 to-[#0D0D12]/95 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <span className="font-wedding text-3xl sm:text-4xl text-[#F5E8D2] leading-none pt-1 sm:pt-2 drop-shadow">
                  B&R
                </span>
              </div>
            </div>

            <p className="font-cinzel uppercase text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.35em] text-[#CFB28A] font-semibold drop-shadow-sm">
              Wedding Celebration
            </p>
          </div>

          {/* Featured Couple Portrait - Luxurious Royal Gold Archival Frame */}
          <div className="flex flex-col items-center justify-center pt-2 pb-3">
            <div className="relative group select-none">
              {/* Outer Ambient Gold Glow */}
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-b from-[#CFB28A]/25 via-[#E8D5B5]/15 to-[#886438]/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Master Beveled Gold Picture Frame */}
              <div className="relative p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF5DE] via-[#CFB28A] via-45% to-[#7A5528] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.6)]">
                
                {/* Secondary Bevel Inset (Dark Bronze / Obsidian Channel) */}
                <div className="p-1 sm:p-1.5 rounded-[14px] sm:rounded-[20px] bg-gradient-to-b from-[#1C1813] via-[#0E0D0B] to-[#1F1912] shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)]">
                  
                  {/* Inner Fine Gold Filigree Ring */}
                  <div className="p-0.5 rounded-[12px] sm:rounded-[18px] bg-gradient-to-tr from-[#886438] via-[#E8D5B5] to-[#BE9A68] shadow-sm">
                    
                    {/* The Artwork Canvas / Photo */}
                    <div className="w-56 xs:w-64 sm:w-72 aspect-[3/4] rounded-[10px] sm:rounded-[16px] overflow-hidden relative bg-stone-950 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                      <img
                        src={bgImage}
                        alt="Blessing & Ruvarashe"
                        className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-105 filter contrast-[1.03] brightness-[1.01]"
                      />

                      {/* Glass Sheen Light Reflection Sweep */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-60 pointer-events-none" />

                      {/* Luxurious Soft Shadow Vignette around Edges */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E]/85 via-transparent via-40% to-black/30 pointer-events-none" />

                      {/* Floating Museum Plaque at the Bottom */}
                      <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-lg bg-[#0C0B0A]/70 backdrop-blur-md border border-[#CFB28A]/40 shadow-lg text-center pointer-events-none transform transition-transform duration-500 group-hover:-translate-y-0.5">
                        <span className="font-wedding text-2xl sm:text-3xl text-[#FFF8ED] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] tracking-wide block leading-none pt-0.5">
                          Blessing & Ruvarashe
                        </span>
                        <span className="font-cinzel text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#CFB28A] drop-shadow font-medium block pt-1">
                          The Matiza Union
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elegant Corner Filigree Accents (Top-Left) */}
                <div className="absolute -top-1.5 -left-1.5 w-5 h-5 pointer-events-none">
                  <div className="w-full h-full border-t-2 border-l-2 border-[#FFF0D4] rounded-tl-md shadow-[0_0_8px_rgba(207,178,138,0.8)]" />
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#FFF0D4] shadow-xs" />
                </div>

                {/* Elegant Corner Filigree Accents (Top-Right) */}
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 pointer-events-none">
                  <div className="w-full h-full border-t-2 border-r-2 border-[#FFF0D4] rounded-tr-md shadow-[0_0_8px_rgba(207,178,138,0.8)]" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FFF0D4] shadow-xs" />
                </div>

                {/* Elegant Corner Filigree Accents (Bottom-Left) */}
                <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 pointer-events-none">
                  <div className="w-full h-full border-b-2 border-l-2 border-[#FFF0D4] rounded-bl-md shadow-[0_0_8px_rgba(207,178,138,0.8)]" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#FFF0D4] shadow-xs" />
                </div>

                {/* Elegant Corner Filigree Accents (Bottom-Right) */}
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 pointer-events-none">
                  <div className="w-full h-full border-b-2 border-r-2 border-[#FFF0D4] rounded-br-md shadow-[0_0_8px_rgba(207,178,138,0.8)]" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FFF0D4] shadow-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* The Couple Names & Lineage */}
          <div className="space-y-3 sm:space-y-4 max-w-xl mx-auto px-1">
            {/* Groom */}
            <div className="space-y-0.5 sm:space-y-1">
              <h1 className="font-wedding text-4xl xs:text-5xl sm:text-7xl lg:text-8xl gold-gradient-text tracking-wide leading-[1.1] drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)] break-words">
                Blessing Matiza
              </h1>
              <p className="font-serif-luxury italic text-xs sm:text-sm text-[#F0DFCA] tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                First born of Mr & Mrs Matiza
              </p>
            </div>

            {/* Ornamental Script Ampersand */}
            <div className="py-0.5">
              <span className="font-wedding text-3xl sm:text-5xl text-[#CFB28A] block leading-none select-none drop-shadow-md">
                &
              </span>
            </div>

            {/* Bride */}
            <div className="space-y-0.5 sm:space-y-1">
              <h1 className="font-wedding text-4xl xs:text-5xl sm:text-7xl lg:text-8xl gold-gradient-text tracking-wide leading-[1.1] drop-shadow-[0_3px_8px_rgba(0,0,0,0.95)] break-words">
                Ruvarashe Chakawora
              </h1>
              <p className="font-serif-luxury italic text-xs sm:text-sm text-[#F0DFCA] tracking-wider drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                Third born of Mr & Mrs Chakawora
              </p>
            </div>
          </div>

          {/* Delicate Gold Filigree Divider */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-xs mx-auto py-0.5">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#CFB28A] to-transparent" />
            <span className="text-[#CFB28A] text-sm font-serif drop-shadow">❦</span>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#CFB28A] to-transparent" />
          </div>

          {/* Hosting Words */}
          <div className="max-w-lg mx-auto px-2">
            <p className="font-serif-luxury italic text-lg sm:text-2xl text-[#FAF7F0] leading-relaxed font-normal drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              “Joyfully invite you to celebrate our union in marriage”
            </p>
          </div>

          {/* Date with High-Contrast Luxury Typography */}
          <div className="max-w-md mx-auto py-1">
            <p className="font-cinzel text-xl sm:text-3xl text-white font-semibold tracking-wider sm:tracking-widest uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              Tuesday, 22 December 2026
            </p>
          </div>

          {/* Venue & Location - High-Visibility Luxury Section */}
          <div className="max-w-lg mx-auto my-2 sm:my-3">
            <div className="p-4 sm:p-6 bg-gradient-to-b from-[#14141C]/95 via-[#0E0E14]/95 to-[#161622]/95 border-2 border-[#CFB28A]/80 rounded-2xl shadow-2xl text-center relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8D5B5] to-transparent" />

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CFB28A]/20 border border-[#CFB28A]/50 text-[#F5E8D2] font-cinzel text-[10px] tracking-widest uppercase mb-2.5">
                <svg className="w-3.5 h-3.5 text-[#CFB28A]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Wedding Venue & Celebration</span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl text-white font-bold tracking-wider uppercase drop-shadow-md">
                {config.venueName}
              </h2>

              <p className="font-serif-luxury text-sm sm:text-base text-[#F7F1E6] mt-1.5 font-medium tracking-wide">
                {config.venueAddress}
              </p>

              <p className="font-serif-luxury italic text-xs sm:text-sm text-[#CFB28A] mt-1">
                Private Estate Lawn & Gardens · Shawasha Hills, Harare
              </p>

              <div className="pt-4 flex items-center justify-center">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${config.venueName}, ${config.venueAddress}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:brightness-105 active:scale-[0.98] text-stone-950 font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-[0_10px_30px_rgba(207,178,138,0.35)] transition-all cursor-pointer border border-[#FFF0D4]/70"
                >
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Clean Essential Details: Attire & Special Instructions */}
          <div className="border-t border-[#CFB28A]/30 pt-5 sm:pt-6 max-w-md mx-auto space-y-3.5">
            {/* Interactive Attire & Color Swatches Card */}
            <div className="p-3.5 sm:p-4 bg-[#131318]/90 backdrop-blur-sm border border-[#CFB28A]/45 rounded-2xl shadow-md text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-cinzel uppercase text-[9px] sm:text-[10px] tracking-[0.2em] text-[#CFB28A] font-semibold">
                  Wedding Attire
                </span>
                <button
                  type="button"
                  onClick={() => setIsPaletteModalOpen(true)}
                  className="font-serif-luxury italic text-[11px] text-[#CFB28A] hover:text-[#FFF5DE] underline cursor-pointer transition-colors"
                >
                  View Swatches ↗
                </button>
              </div>

              <p className="text-white text-xs sm:text-sm font-medium">
                {config.attire}
              </p>

              {/* Quick-tap Swatch Chips */}
              <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsPaletteModalOpen(true)}
                  className="flex items-center gap-1.5 bg-[#1B1B22] px-2.5 py-1 rounded-full border border-stone-700 hover:border-[#CFB28A]/60 transition-colors cursor-pointer"
                >
                  <span className="w-3 h-3 rounded-full bg-[#0A0A0D] border border-[#CFB28A]/60 shadow-xs shrink-0" />
                  <span className="text-[10px] text-stone-300 font-medium">Obsidian Black</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaletteModalOpen(true)}
                  className="flex items-center gap-1.5 bg-[#1B1B22] px-2.5 py-1 rounded-full border border-stone-700 hover:border-[#CFB28A]/60 transition-colors cursor-pointer"
                >
                  <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[#F5E8D2] via-[#CFB28A] to-[#886438] border border-[#FFF0D4] shadow-xs shrink-0" />
                  <span className="text-[10px] text-stone-300 font-medium">Champagne Gold</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaletteModalOpen(true)}
                  className="flex items-center gap-1.5 bg-[#1B1B22] px-2.5 py-1 rounded-full border border-stone-700 hover:border-[#CFB28A]/60 transition-colors cursor-pointer"
                >
                  <span className="w-3 h-3 rounded-full bg-[#FAF7F0] border border-stone-300 shadow-xs shrink-0" />
                  <span className="text-[10px] text-stone-300 font-medium">Silk Ivory</span>
                </button>
              </div>
            </div>

            {/* Special Instructions Card */}
            <div className="p-3 bg-[#131318]/90 backdrop-blur-sm border border-[#CFB28A]/35 rounded-xl shadow-md text-center">
              <span className="font-cinzel uppercase text-[9px] sm:text-[10px] tracking-[0.2em] text-[#CFB28A] block mb-0.5 font-semibold">
                Special Instruction
              </span>
              <p className="text-white text-xs sm:text-sm font-medium">
                {config.specialInstructions}
              </p>
            </div>

            {/* RSVP Deadline */}
            <p className="font-serif-luxury italic text-xs sm:text-sm text-[#E8D5B5] pt-1 drop-shadow-sm">
              Kindly RSVP by the first week of December (7 December 2026)
            </p>
          </div>

          {/* Dynamic Countdown Timer showing Days Remaining until December 2026 */}
          <CountdownTimer targetDate={config.weddingDate} />

          {/* RSVP / Pass Action */}
          <div className="pt-2 sm:pt-3">
            {activeGuest && activeGuest.rsvpStatus === 'accepted' ? (
              <div className="space-y-3 bg-[#141418]/95 backdrop-blur-md border border-[#CFB28A]/60 rounded-2xl p-4 sm:p-5 max-w-md mx-auto shadow-xl">
                <p className="font-serif-luxury text-sm sm:text-base text-[#F7F1E6]">
                  Welcome, <strong className="text-[#E8D5B5] font-semibold">{activeGuest.name}</strong>
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CFB28A]/15 border border-[#CFB28A]/40 rounded-full text-xs font-serif-luxury text-[#E8D5B5]">
                  <span>✓ Attendance Confirmed</span>
                  <span>·</span>
                  <span>{activeGuest.confirmedHeadcount} {activeGuest.confirmedHeadcount > 1 ? 'Guests' : 'Guest'}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={onOpenPass}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:opacity-95 text-black font-cinzel text-xs font-bold tracking-widest uppercase rounded-full shadow-lg transition-all cursor-pointer"
                  >
                    View 4-Digit Gate Pass →
                  </button>
                  {activeGuest.inviteType !== 'individual' && (
                    <button
                      onClick={onOpenRSVP}
                      className="text-xs text-stone-300 hover:text-white underline cursor-pointer font-serif-luxury py-1"
                    >
                      Update Response
                    </button>
                  )}
                </div>
              </div>
            ) : isCapacityReached ? (
              <div className="space-y-2.5 bg-[#141418]/95 backdrop-blur-md border border-rose-500/40 rounded-2xl p-5 sm:p-6 max-w-md mx-auto shadow-2xl text-center animate-in fade-in">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-[10px] text-rose-200 font-cinzel font-bold uppercase tracking-widest">
                  <span>🔒</span>
                  <span>Registration Closed · 300 Seats Filled</span>
                </div>
                <p className="font-serif-luxury text-xs sm:text-sm text-stone-200 leading-relaxed">
                  The celebration of Blessing & Ruvarashe at Swan Creek Gardens has reached the maximum permitted capacity of 300 guests. RSVP registrations are now officially closed.
                </p>
                <p className="text-[10px] font-cinzel text-[#CFB28A] tracking-wider uppercase pt-1">
                  Thank you for your overwhelming love & blessings.
                </p>
              </div>
            ) : (
              <button
                onClick={onOpenRSVP}
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:scale-102 active:scale-98 text-black font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase rounded-full shadow-2xl transition-all cursor-pointer"
              >
                RSVP to Attend
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Black & Champagne Attire Palette Modal */}
      {isPaletteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsPaletteModalOpen(false)}
        >
          <div
            className="bg-[#101015] border-2 border-[#CFB28A]/60 rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-7 space-y-4 shadow-2xl relative text-stone-100 gold-box-glow animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#CFB28A]/30">
              <div>
                <span className="font-cinzel text-[9px] uppercase tracking-[0.25em] text-[#CFB28A] font-semibold block">
                  Wedding Dress Code & Styling
                </span>
                <h3 className="font-wedding text-2xl sm:text-3xl font-semibold text-white mt-0.5">
                  Black & Champagne Palette
                </h3>
              </div>
              <button
                onClick={() => setIsPaletteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="font-serif-luxury italic text-xs sm:text-sm text-stone-300 leading-relaxed text-center">
              Guests are cordially invited to celebrate in formal evening elegance dressed in shades of <strong className="text-[#F5E8D2]">Obsidian Black</strong>, <strong className="text-[#CFB28A]">Champagne Gold</strong>, and <strong className="text-white">Silk Ivory</strong>.
            </p>

            {/* Visual Swatch Chips Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Obsidian Black */}
              <div className="p-3 rounded-xl bg-[#16161E] border border-stone-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#070709] border-2 border-[#CFB28A]/40 shadow-inner shrink-0" />
                <div>
                  <strong className="block text-xs font-semibold text-white">Obsidian Black</strong>
                  <span className="text-[10px] text-stone-400 font-serif-luxury">Tuxedos & Gowns</span>
                </div>
              </div>

              {/* Champagne Gold */}
              <div className="p-3 rounded-xl bg-[#16161E] border border-stone-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5E8D2] via-[#CFB28A] to-[#886438] border-2 border-[#FFF0D4] shadow-md shrink-0" />
                <div>
                  <strong className="block text-xs font-semibold text-[#F5E8D2]">Champagne Gold</strong>
                  <span className="text-[10px] text-stone-400 font-serif-luxury">Silk & Satin</span>
                </div>
              </div>

              {/* Silk Ivory */}
              <div className="p-3 rounded-xl bg-[#16161E] border border-stone-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#FAF7F0] border-2 border-[#E8D5B5] shadow-sm shrink-0" />
                <div>
                  <strong className="block text-xs font-semibold text-white">Silk Ivory</strong>
                  <span className="text-[10px] text-stone-400 font-serif-luxury">Crisp Shirts & Pearls</span>
                </div>
              </div>

              {/* Warm Bronze Accent */}
              <div className="p-3 rounded-xl bg-[#16161E] border border-stone-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8814F] to-[#5A3F1F] border-2 border-[#CFB28A]/40 shadow-inner shrink-0" />
                <div>
                  <strong className="block text-xs font-semibold text-stone-200">Warm Bronze</strong>
                  <span className="text-[10px] text-stone-400 font-serif-luxury">Metallic Highlights</span>
                </div>
              </div>
            </div>

            {/* Venue Footwear Recommendation Box */}
            <div className="p-3 bg-[#181822] border border-[#CFB28A]/30 rounded-xl text-xs space-y-1">
              <span className="font-cinzel text-[10px] text-[#CFB28A] uppercase tracking-wider font-semibold block">
                🌿 Swan Creek Gardens Footwear Note
              </span>
              <p className="font-serif-luxury text-stone-300 text-[11px] leading-relaxed">
                The celebration features private estate lawns and stone garden paths. Block heels, wedges, or dress flats are warmly recommended for ladies.
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsPaletteModalOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:opacity-95 text-black font-cinzel text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md"
            >
              Close Palette
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
