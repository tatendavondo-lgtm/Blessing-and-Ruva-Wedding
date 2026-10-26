import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { WeddingConfig, Guest } from '../types/wedding';

interface EnvelopeUnveilProps {
  config: WeddingConfig;
  activeGuest: Guest | null;
  onOpen: () => void;
}

export const requestNativeFullscreen = () => {
  try {
    const doc = document as any;
    const isFullscreen =
      document.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (isFullscreen) return;

    const el = document.documentElement as any;
    if (typeof el.requestFullscreen === 'function') {
      const promise = el.requestFullscreen({ navigationUI: 'hide' });
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {
          try {
            el.requestFullscreen().catch(() => {});
          } catch {}
        });
      }
      return;
    }

    const webkitMethod =
      el.webkitRequestFullscreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullscreen;

    if (typeof webkitMethod === 'function') {
      webkitMethod.call(el);
      return;
    }
  } catch {
    // Browser prevented fullscreen
  }

  // Fallback for iOS WebKit where Apple restricts the Fullscreen API on iPhone
  try {
    window.scrollTo(0, 1);
  } catch {}
};

export const EnvelopeUnveil: React.FC<EnvelopeUnveilProps> = ({
  config,
  activeGuest,
  onOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    try {
      requestNativeFullscreen();
    } catch {
      // ignore
    }

    if (isOpening) return;
    setIsOpening(true);

    // 2. Delay confetti & transition slightly so Chrome completes fullscreen enter smoothly
    setTimeout(() => {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#F5E8D2', '#CFB28A', '#BE9A68', '#FAF7F0'],
        });
      } catch {
        // ignore
      }
    }, 120);

    setTimeout(() => {
      onOpen();
    }, 550);
  };

  return (
    <div
      onClick={handleOpenEnvelope}
      className="fixed inset-0 z-50 bg-[#060608] flex items-center justify-center p-4 select-none overflow-hidden safe-pb safe-pt cursor-pointer"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-[#CFB28A]/10 via-transparent to-transparent pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-[#CFB28A]/30 blur-xs animate-dust" />
      <div className="absolute bottom-1/4 right-1/5 w-2.5 h-2.5 rounded-full bg-[#E8D5B5]/25 blur-xs animate-dust [animation-delay:3s]" />

      {/* Royal Envelope Card */}
      <div
        className={`w-full max-w-sm sm:max-w-md bg-[#0D0D11] border-2 border-[#CFB28A]/50 rounded-3xl p-7 sm:p-10 text-center text-white shadow-2xl relative transition-all duration-700 gold-box-glow overflow-hidden cursor-pointer ${
          isOpening ? 'scale-105 opacity-0 -translate-y-8' : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* Faint Couple Backdrop inside Envelope */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <img
            src={config.backgroundImageUrl && !config.backgroundImageUrl.includes('aistudio.google.com') ? config.backgroundImageUrl : '/assets/images/couple_portrait.jpg'}
            alt="Blessing & Ruvarashe"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay filter blur-[0.5px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0D]/70 via-[#0A0A0D]/40 to-[#0A0A0D]/90" />
        </div>

        {/* Inner border */}
        <div className="absolute inset-2.5 border border-[#CFB28A]/25 rounded-2xl pointer-events-none z-10" />

        <div className="relative z-10">
          {/* Envelope Top Flap Graphic */}
          <div className="w-16 h-1 bg-[#CFB28A]/40 mx-auto rounded-full mb-6" />

          <div className="space-y-2 mb-6">
            <p className="font-cinzel uppercase text-[10px] tracking-[0.3em] text-[#CFB28A]">
              Official Wedding Invitation
            </p>

            <p className="font-serif-luxury italic text-xs text-stone-300">
              {activeGuest?.name ? (
                <>Specially prepared for <strong className="text-white font-medium">{activeGuest.name}</strong></>
              ) : (
                'You are cordially invited to celebrate'
              )}
            </p>
          </div>

          {/* Wax Seal Monogram Crest */}
          <div className="my-6 relative inline-block">
            <button
              type="button"
              onClick={handleOpenEnvelope}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#E6CAA2] via-[#CFB28A] to-[#886438] p-[3px] shadow-2xl animate-seal-glow cursor-pointer transition-transform hover:scale-105 active:scale-95 group focus:outline-none"
              aria-label="Tap seal to open invitation"
            >
              <div className="w-full h-full rounded-full bg-[#141418] border-2 border-[#CFB28A]/60 flex flex-col items-center justify-center p-2">
                <span className="font-wedding text-4xl sm:text-5xl text-[#F5E8D2] leading-none pt-2.5 group-hover:scale-110 transition-transform">
                  B&R
                </span>
                <span className="font-cinzel text-[7px] uppercase tracking-widest text-[#CFB28A]/90 mt-0.5">
                  22.12.26
                </span>
              </div>
            </button>
          </div>

          {/* Couple Title */}
          <div className="space-y-1 mb-8">
            <h2 className="font-wedding text-4xl sm:text-5xl text-white tracking-wide leading-tight">
              Blessing & Ruvarashe
            </h2>
            <p className="font-serif-luxury text-xs text-[#CFB28A] tracking-wider">
              Swan Creek Gardens · Shawasha Hills
            </p>
          </div>

          {/* Fullscreen CTA Button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleOpenEnvelope}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:opacity-95 text-black font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-full shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>✦</span>
              <span>Tap to Open Invitation</span>
              <span>✦</span>
            </button>

            <p className="font-serif-luxury text-[11px] text-stone-400">
              Opens in full-screen on mobile devices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
