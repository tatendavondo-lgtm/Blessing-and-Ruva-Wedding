import React, { useState, useEffect } from 'react';
import { Guest } from '../types/wedding';

interface NavigationProps {
  currentView: 'invitation' | 'map' | 'pass' | 'gate' | 'admin';
  onNavigate: (view: 'invitation' | 'map' | 'pass' | 'gate' | 'admin') => void;
  activeGuest: Guest | null;
  allGuests: Guest[];
  onOpenRSVP: () => void;
  onOpenStaffModal: () => void;
  isGateUnlocked: boolean;
  isAdminUnlocked: boolean;
  onLockGate: () => void;
  onLockAdmin: () => void;
  checkedInCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  activeGuest,
  onOpenRSVP,
  onOpenStaffModal,
  isGateUnlocked,
  isAdminUnlocked,
  onLockGate,
  onLockAdmin,
  checkedInCount,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        const docEl = document.documentElement as any;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen().catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen().catch(() => {});
        }
      }
    } catch {
      // browser fallback
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070709]/95 backdrop-blur-md border-b border-[#CFB28A]/20 transition-all text-stone-200">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Wordmark: Clicking B&R triggers secret staff portal PIN modal! */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenStaffModal}
            title="Blessing & Ruvarashe"
            aria-label="Staff Access Portal"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#CFB28A]/50 bg-[#121216] hover:bg-[#1A1A22] hover:border-[#CFB28A] active:scale-95 flex items-center justify-center shadow-md cursor-pointer transition-all focus:outline-none"
          >
            <span className="font-wedding text-xl sm:text-2xl text-[#F5E8D2] leading-none pt-1 sm:pt-2 select-none">
              B&R
            </span>
          </button>
          <button
            onClick={() => onNavigate('invitation')}
            className="text-left group cursor-pointer focus-visible:outline-none flex flex-col"
          >
            <span className="font-wedding text-2xl sm:text-4xl text-white group-hover:text-[#CFB28A] transition-colors whitespace-nowrap leading-none pt-1">
              Blessing & Ruvarashe
            </span>
            <span className="font-cinzel text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#CFB28A]/80 hidden xs:block">
              22 December 2026
            </span>
          </button>
        </div>

        {/* Wedding Navigation Links (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-cinzel tracking-widest text-[#E0CBAE]/80 uppercase">
          <button
            onClick={() => onNavigate('invitation')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'invitation'
                ? 'text-[#FAF7F0] border-b border-[#CFB28A] font-bold'
                : 'hover:text-white'
            }`}
          >
            Invitation
          </button>
          <button
            onClick={() => onNavigate('map')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'map'
                ? 'text-[#FAF7F0] border-b border-[#CFB28A]'
                : 'hover:text-[#CFB28A]'
            }`}
          >
            Venue Location
          </button>
          <button
            onClick={() => onNavigate('pass')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'pass'
                ? 'text-[#FAF7F0] border-b border-[#CFB28A] font-bold'
                : 'hover:text-white'
            }`}
          >
            Entry Pass
          </button>
        </nav>

        {/* Right CTA for Guests + Mobile Fullscreen button (clean look without staff locks) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Fullscreen toggle icon */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            aria-label="Toggle Full Screen"
            className="w-8 h-8 rounded-full border border-[#CFB28A]/30 bg-[#121216] hover:bg-[#1A1A22] text-[#CFB28A] flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            {isFullscreen ? '✕' : '⛶'}
          </button>

          {activeGuest && activeGuest.rsvpStatus === 'accepted' ? (
            <button
              onClick={() => onNavigate('pass')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:opacity-95 text-black font-cinzel text-[10px] sm:text-[11px] font-bold tracking-wider uppercase rounded-full shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Pass ({activeGuest.ticketCode})
            </button>
          ) : (
            <button
              onClick={onOpenRSVP}
              className="px-3.5 sm:px-5 py-1.5 sm:py-2.5 bg-gradient-to-r from-[#F5E8D2] via-[#CFB28A] to-[#BE9A68] hover:scale-102 active:scale-98 text-black font-cinzel text-[11px] sm:text-xs font-bold tracking-widest uppercase rounded-full shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              RSVP
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for Small Screens */}
      <div className="flex md:hidden items-center justify-around border-t border-[#CFB28A]/15 py-1.5 px-2 bg-[#09090C] text-[10px] font-cinzel uppercase tracking-wider text-[#CFB28A]/80">
        <button
          onClick={() => onNavigate('invitation')}
          className={`px-3 py-1 rounded transition-colors ${
            currentView === 'invitation' ? 'text-white font-bold bg-[#CFB28A]/20' : 'hover:text-white'
          }`}
        >
          Invitation
        </button>
        <button
          onClick={() => onNavigate('map')}
          className={`px-3 py-1 rounded transition-colors ${
            currentView === 'map' ? 'text-white font-bold bg-[#CFB28A]/20' : 'hover:text-white'
          }`}
        >
          Venue
        </button>
        <button
          onClick={() => onNavigate('pass')}
          className={`px-3 py-1 rounded transition-colors ${
            currentView === 'pass' ? 'text-white font-bold bg-[#CFB28A]/20' : 'hover:text-white'
          }`}
        >
          Entry Pass
        </button>
      </div>

      {/* Active Staff Bar when inside Gate or Admin */}
      {(currentView === 'gate' || currentView === 'admin') && (
        <div className="bg-[#121217] border-t border-[#CFB28A]/30 px-3 sm:px-4 py-2 text-xs text-stone-200">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-wider text-[#CFB28A] font-semibold uppercase">
                Active Staff View:
              </span>
              <button
                onClick={() => {
                  if (isGateUnlocked) {
                    onNavigate('gate');
                  } else {
                    onOpenStaffModal();
                  }
                }}
                className={`px-2.5 py-1 rounded text-[11px] sm:text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  currentView === 'gate'
                    ? 'bg-[#CFB28A] text-black font-bold'
                    : 'bg-[#1D1D24] text-stone-300 hover:bg-stone-700'
                }`}
              >
                <span>{isGateUnlocked ? '🎟️' : '🔒'}</span>
                <span>Gate Terminal ({checkedInCount})</span>
              </button>
              <button
                onClick={() => {
                  if (isAdminUnlocked) {
                    onNavigate('admin');
                  } else {
                    onOpenStaffModal();
                  }
                }}
                className={`px-2.5 py-1 rounded text-[11px] sm:text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  currentView === 'admin'
                    ? 'bg-[#CFB28A] text-black font-bold'
                    : 'bg-[#1D1D24] text-stone-300 hover:bg-stone-700'
                }`}
              >
                <span>{isAdminUnlocked ? '⚙️' : '🔒'}</span>
                <span>Admin Hub</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (currentView === 'gate') onLockGate();
                if (currentView === 'admin') onLockAdmin();
              }}
              className="text-[11px] text-stone-400 hover:text-rose-300 transition-colors cursor-pointer flex items-center gap-1 font-serif-luxury ml-auto"
            >
              <span>🔒</span>
              <span>Lock {currentView === 'gate' ? 'Gate' : 'Admin'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
